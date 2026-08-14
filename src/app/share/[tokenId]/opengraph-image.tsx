import { ImageResponse } from "next/og";
import { fetchBugByTokenId } from "@/lib/opensea";
import { formatPercentile, tierLabel } from "@/lib/rarity";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Chill Bug in the museum";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgImageProps = {
  params: Promise<{ tokenId: string }>;
};

async function inlineImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/png";
    if (!contentType.startsWith("image/")) return null;
    if (contentType.includes("avif") || contentType.includes("svg")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength === 0 || buf.byteLength > 4_500_000) return null;
    return `data:${contentType};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: OgImageProps) {
  const { tokenId } = await params;
  const bug = await fetchBugByTokenId(tokenId);
  const portrait = bug?.imageUrl ? await inlineImage(bug.imageUrl) : null;
  const rarity = bug
    ? bug.rarity.rarityAvailable
      ? `${tierLabel(bug.rarity.tier)} · ${formatPercentile(bug.rarity.percentile)}`
      : tierLabel(bug.rarity.tier)
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#1c1a17",
          color: "#f0e8d8",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 630,
            height: 630,
            background: "#141210",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {portrait ? (
            <img
              src={portrait}
              alt=""
              width={630}
              height={630}
              style={{ objectFit: "cover", width: 630, height: 630 }}
            />
          ) : (
            <div style={{ display: "flex", fontSize: 28, color: "#a89a84" }}>
              Chill Bugs Museum
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: 56,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#d4b87a",
              textTransform: "uppercase",
            }}
          >
            Chill Bugs Museum
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 54,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {bug?.name ?? "Chill Bug"}
          </div>
          {rarity ? (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 28,
                color: "#d4b87a",
              }}
            >
              {rarity}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
