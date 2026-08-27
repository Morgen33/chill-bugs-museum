export const CHILLBUGS_CONTRACT =
  process.env.NEXT_PUBLIC_CHILLBUGS_CONTRACT?.toLowerCase() ??
  "0x0aa201337b430361500832d6357f788cacbd9450";

export const CHILLBUGS_SLUG = "the-chillbugs";

export const OPENSEA_COLLECTION_URL =
  "https://opensea.io/collection/the-chillbugs";

export const TWITTER_URL = "https://x.com/TheChillBugs";

export const DISCORD_URL = "https://discord.gg/3S27nh49Hm";

export const SOCIAL_LINKS = [
  { name: "Twitter", href: TWITTER_URL, icon: "twitter" },
  { name: "OpenSea", href: OPENSEA_COLLECTION_URL, icon: "opensea" },
  { name: "Discord", href: DISCORD_URL, icon: "discord" },
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chill-bugs-museum.vercel.app"
).replace(/\/$/, "");

/** Full wall hang: 8 columns × 4 rows, matching the gallery reference. */
export const WALL_COLUMNS = 8;
export const WALL_ROWS = 4;
export const WALL_PAGE_SIZE = WALL_COLUMNS * WALL_ROWS;

export type HangLayout = {
  cols: number;
  rows: number;
};

/**
 * Compact centered hang. One bug is a featured piece; the grid only
 * tightens to the 8×4 photo layout as the wall fills.
 */
export function hangLayout(
  count: number,
  maxCols: number = WALL_COLUMNS,
): HangLayout {
  const n = Math.max(1, Math.min(count, WALL_PAGE_SIZE));
  const cap = Math.max(1, Math.min(maxCols, WALL_COLUMNS));

  if (n === 1) return { cols: 1, rows: 1 };
  if (n === 2) return { cols: Math.min(2, cap), rows: 1 };
  if (n === 3) return { cols: Math.min(3, cap), rows: Math.ceil(n / Math.min(3, cap)) };
  if (n === 4) return { cols: Math.min(2, cap), rows: Math.ceil(n / Math.min(2, cap)) };

  if (n <= 8) {
    const cols = Math.min(4, cap);
    return { cols, rows: Math.ceil(n / cols) };
  }

  if (n <= 16) {
    const cols = Math.min(4, cap);
    return { cols, rows: Math.ceil(n / cols) };
  }

  return { cols: cap, rows: Math.ceil(n / cap) };
}
