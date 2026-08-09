import type { RarityInfo, RarityTier } from "./rarity";

export type BugTrait = {
  traitType: string;
  value: string;
};

export type ChillBug = {
  tokenId: string;
  name: string;
  imageUrl: string;
  openseaUrl: string;
  traits: BugTrait[];
  rarity: RarityInfo;
};

export type BugsApiResponse = {
  address: string;
  bugs: ChillBug[];
  count: number;
};

export type BugsApiError = {
  error: string;
};

export type { RarityTier };
