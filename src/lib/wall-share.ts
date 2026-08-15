import { isAddress } from "viem";
import { WALL_PAGE_SIZE } from "@/lib/constants";
import { fetchOwnedBugs } from "@/lib/opensea";
import type { ChillBug } from "@/lib/types";

export type WallShareData = {
  address: string;
  room: number;
  roomCount: number;
  bugs: ChillBug[];
  total: number;
};

export function parseWallRoom(value: string): number | null {
  if (!/^\d{1,4}$/.test(value)) return null;
  const room = Number(value);
  if (!Number.isInteger(room) || room < 1) return null;
  return room;
}

export async function loadWallShare(
  address: string,
  room: number,
): Promise<WallShareData | null> {
  if (!isAddress(address)) return null;

  const apiKey = process.env.OPENSEA_API_KEY;
  if (!apiKey) return null;

  const all = await fetchOwnedBugs(address.toLowerCase(), apiKey);
  if (all.length === 0) return null;

  const roomCount = Math.max(1, Math.ceil(all.length / WALL_PAGE_SIZE));
  if (room > roomCount) return null;

  const start = (room - 1) * WALL_PAGE_SIZE;
  return {
    address: address.toLowerCase(),
    room,
    roomCount,
    bugs: all.slice(start, start + WALL_PAGE_SIZE),
    total: all.length,
  };
}
