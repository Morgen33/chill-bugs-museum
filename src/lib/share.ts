import type { ChillBug } from "./types";
import { formatPercentile, tierLabel } from "./rarity";

type XIntentParams = {
  text: string;
  url?: string;
  hashtags?: string[];
};

/** X web intent — opens the composer in a new tab. No API key required. */
export function xIntentPostUrl({ text, url, hashtags }: XIntentParams): string {
  const search = new URLSearchParams();
  search.set("text", text);
  if (url) search.set("url", url);
  if (hashtags && hashtags.length > 0) {
    search.set("hashtags", hashtags.join(","));
  }
  return `https://x.com/intent/post?${search.toString()}`;
}

export function bugShareText(bug: ChillBug): string {
  const { tier, percentile, rarityAvailable } = bug.rarity;
  const rarity = rarityAvailable
    ? `${tierLabel(tier)} · ${formatPercentile(percentile)}`
    : tierLabel(tier);
  return `Just hung ${bug.name} in my Chill Bugs Museum — ${rarity}`;
}

export function bugShareToXUrl(bug: ChillBug): string {
  return xIntentPostUrl({
    text: bugShareText(bug),
    url: bug.openseaUrl,
    hashtags: ["ChillBugs"],
  });
}
