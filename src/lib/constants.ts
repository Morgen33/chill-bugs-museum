export const CHILLBUGS_CONTRACT =
  process.env.NEXT_PUBLIC_CHILLBUGS_CONTRACT?.toLowerCase() ??
  "0x0aa201337b430361500832d6357f788cacbd9450";

export const CHILLBUGS_SLUG = "the-chillbugs";

export const OPENSEA_COLLECTION_URL =
  "https://opensea.io/collection/the-chillbugs";

/** Full wall hang: 8 columns × 4 rows, matching the gallery reference. */
export const WALL_COLUMNS = 8;
export const WALL_ROWS = 4;
export const WALL_PAGE_SIZE = WALL_COLUMNS * WALL_ROWS;
