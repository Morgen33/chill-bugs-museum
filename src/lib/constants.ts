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
