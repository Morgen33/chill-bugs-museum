import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WallShareView } from "@/components/WallShareView";
import { wallShareMetadata } from "@/lib/share-metadata";
import { loadWallShare, parseWallRoom } from "@/lib/wall-share";

type HangSharePageProps = {
  params: Promise<{ address: string; room: string }>;
};

export async function generateMetadata({
  params,
}: HangSharePageProps): Promise<Metadata> {
  const { address, room: roomParam } = await params;
  const room = parseWallRoom(roomParam);
  const wall = room ? await loadWallShare(address, room) : null;
  if (!wall) {
    return { title: "Chill Bugs Museum" };
  }
  return wallShareMetadata(wall);
}

export default async function HangSharePage({ params }: HangSharePageProps) {
  const { address, room: roomParam } = await params;
  const room = parseWallRoom(roomParam);
  const wall = room ? await loadWallShare(address, room) : null;
  if (!wall) notFound();
  return <WallShareView wall={wall} />;
}
