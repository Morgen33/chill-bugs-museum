export type RarityTier = "common" | "uncommon" | "rare" | "legendary";

export type RarityInfo = {
  rank: number | null;
  tokensScored: number | null;
  /** Lower is rarer. Null when OpenSea has no ranking. */
  percentile: number | null;
  tier: RarityTier;
  rarityAvailable: boolean;
};

/** Percentile from OpenSea rank + collection size (max_rank / tokens scored). */
export function percentileFromRank(
  rank: number | null | undefined,
  tokensScored: number | null | undefined,
): number | null {
  if (
    rank == null ||
    tokensScored == null ||
    !Number.isFinite(rank) ||
    !Number.isFinite(tokensScored) ||
    rank <= 0 ||
    tokensScored <= 0
  ) {
    return null;
  }
  return (rank / tokensScored) * 100;
}

export function tierFromPercentile(percentile: number | null): RarityTier {
  if (percentile == null) return "common";
  if (percentile <= 1) return "legendary";
  if (percentile <= 10) return "rare";
  if (percentile <= 25) return "uncommon";
  return "common";
}

export function buildRarityInfo(
  rank: number | null | undefined,
  tokensScored: number | null | undefined,
): RarityInfo {
  const percentile = percentileFromRank(rank, tokensScored);
  return {
    rank: rank ?? null,
    tokensScored: tokensScored ?? null,
    percentile,
    tier: tierFromPercentile(percentile),
    rarityAvailable: percentile != null,
  };
}

export function tierLabel(tier: RarityTier): string {
  switch (tier) {
    case "legendary":
      return "Legendary";
    case "rare":
      return "Rare";
    case "uncommon":
      return "Uncommon";
    case "common":
      return "Common";
    default: {
      const _exhaustive: never = tier;
      return _exhaustive;
    }
  }
}

export function formatPercentile(percentile: number | null): string {
  if (percentile == null) return "—";
  if (percentile < 0.1) return "Top 0.1%";
  return `Top ${percentile.toFixed(percentile < 10 ? 1 : 0)}%`;
}
