import { SITE_URL } from "./constants";

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

export function wallShareText(count: number): string {
  if (count === 1) {
    return "Just hung my Chill Bug on the museum wall";
  }
  return `Just hung ${count} Chill Bugs on my museum wall`;
}

function wallSharePath(address: string, room: number): string {
  const safeRoom = Math.max(1, Math.floor(room));
  return `/share/hang/${address.toLowerCase()}/${safeRoom}`;
}

export function wallSharePageUrl(address: string, room: number): string {
  return `${SITE_URL}${wallSharePath(address, room)}`;
}

export function wallShareOgImageUrl(address: string, room: number): string {
  return `${SITE_URL}${wallSharePath(address, room)}/card.png`;
}

export function wallShareToXUrl(address: string, count: number, room: number): string {
  return xIntentPostUrl({
    text: wallShareText(count),
    url: wallSharePageUrl(address, room),
    hashtags: ["ChillBugs"],
  });
}
