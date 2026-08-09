import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { CHILLBUGS_CONTRACT, CHILLBUGS_SLUG } from "@/lib/constants";
import { buildRarityInfo } from "@/lib/rarity";
import type { BugTrait, ChillBug } from "@/lib/types";

export const maxDuration = 60;

type OpenSeaTrait = {
  trait_type?: string;
  value?: string | number | boolean;
};

type OpenSeaRarity = {
  rank?: number | null;
  tokens_scored?: number | null;
  max_rank?: number | null;
};

type OpenSeaNft = {
  identifier?: string;
  name?: string | null;
  image_url?: string | null;
  display_image_url?: string | null;
  opensea_url?: string | null;
  collection?: string;
  contract?: string;
  traits?: OpenSeaTrait[] | null;
  rarity?: OpenSeaRarity | null;
};

type OpenSeaListResponse = {
  nfts?: OpenSeaNft[];
  next?: string | null;
};

type OpenSeaCollectionResponse = {
  collection?: {
    total_supply?: number | null;
    rarity?: {
      max_rank?: number | null;
      total_supply?: number | null;
    } | null;
  };
};

const DETAIL_CONCURRENCY = 12;

function mapTraits(traits: OpenSeaTrait[] | null | undefined): BugTrait[] {
  if (!traits?.length) return [];
  return traits
    .filter((t) => t.trait_type && t.value != null)
    .map((t) => ({
      traitType: String(t.trait_type),
      value: String(t.value),
    }));
}

function resolveTokensScored(
  rarity: OpenSeaRarity | null | undefined,
  collectionTokensScored: number | null,
): number | null {
  return (
    rarity?.tokens_scored ??
    rarity?.max_rank ??
    collectionTokensScored ??
    null
  );
}

function mapNft(
  nft: OpenSeaNft,
  collectionTokensScored: number | null,
): ChillBug | null {
  const tokenId = nft.identifier;
  if (!tokenId) return null;

  const imageUrl = nft.display_image_url || nft.image_url || "";
  const rarity = buildRarityInfo(
    nft.rarity?.rank,
    resolveTokensScored(nft.rarity, collectionTokensScored),
  );

  return {
    tokenId,
    name: nft.name?.trim() || `CHILL BUGS #${tokenId}`,
    imageUrl,
    openseaUrl:
      nft.opensea_url ||
      `https://opensea.io/item/ethereum/${CHILLBUGS_CONTRACT}/${tokenId}`,
    traits: mapTraits(nft.traits),
    rarity,
  };
}

async function fetchCollectionTokensScored(
  apiKey: string,
): Promise<number | null> {
  const res = await fetch(
    `https://api.opensea.io/api/v2/collections/${CHILLBUGS_SLUG}`,
    {
      headers: {
        Accept: "application/json",
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return null;

  const data = (await res.json()) as OpenSeaCollectionResponse;
  const scored =
    data.collection?.rarity?.max_rank ??
    data.collection?.rarity?.total_supply ??
    data.collection?.total_supply ??
    null;

  return typeof scored === "number" && scored > 0 ? scored : null;
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;

  async function run(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]!);
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => run(),
  );
  await Promise.all(runners);
}

async function fetchOwnedBugs(address: string, apiKey: string): Promise<ChillBug[]> {
  const collectionTokensScored = await fetchCollectionTokensScored(apiKey);
  const bugs: ChillBug[] = [];
  let next: string | null | undefined = null;

  do {
    const url = new URL(
      `https://api.opensea.io/api/v2/chain/ethereum/account/${address}/nfts`,
    );
    url.searchParams.set("collection", CHILLBUGS_SLUG);
    url.searchParams.set("limit", "50");
    if (next) url.searchParams.set("next", next);

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-API-KEY": apiKey,
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `OpenSea request failed (${res.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await res.json()) as OpenSeaListResponse;
    for (const nft of data.nfts ?? []) {
      const contract = nft.contract?.toLowerCase();
      if (contract && contract !== CHILLBUGS_CONTRACT) continue;
      const mapped = mapNft(nft, collectionTokensScored);
      if (mapped) bugs.push(mapped);
    }
    next = data.next;
  } while (next);

  // Account list omits rarity — enrich every token from the detail endpoint
  const needsRarity = bugs.filter((b) => !b.rarity.rarityAvailable);
  await mapPool(needsRarity, DETAIL_CONCURRENCY, async (bug) => {
    try {
      const detailUrl = `https://api.opensea.io/api/v2/chain/ethereum/contract/${CHILLBUGS_CONTRACT}/nfts/${bug.tokenId}`;
      const res = await fetch(detailUrl, {
        headers: {
          Accept: "application/json",
          "X-API-KEY": apiKey,
        },
        next: { revalidate: 300 },
      });
      if (!res.ok) return;
      const json = (await res.json()) as { nft?: OpenSeaNft };
      const nft = json.nft;
      if (!nft) return;
      bug.rarity = buildRarityInfo(
        nft.rarity?.rank,
        resolveTokensScored(nft.rarity, collectionTokensScored),
      );
      if (nft.traits?.length && bug.traits.length === 0) {
        bug.traits = mapTraits(nft.traits);
      }
      if (!bug.imageUrl) {
        bug.imageUrl = nft.display_image_url || nft.image_url || "";
      }
    } catch {
      // Keep common-tier fallback
    }
  });

  bugs.sort((a, b) => {
    const ap = a.rarity.percentile ?? Number.POSITIVE_INFINITY;
    const bp = b.rarity.percentile ?? Number.POSITIVE_INFINITY;
    if (ap !== bp) return ap - bp;
    return Number(a.tokenId) - Number(b.tokenId);
  });

  return bugs;
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim();

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: "Valid wallet address required" }, { status: 400 });
  }

  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OPENSEA_API_KEY is not configured. Add it to .env.local to load Chill Bugs.",
      },
      { status: 503 },
    );
  }

  try {
    const bugs = await fetchOwnedBugs(address.toLowerCase(), apiKey);
    return NextResponse.json({
      address: address.toLowerCase(),
      bugs,
      count: bugs.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch bugs";
    console.error("[api/bugs]", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
