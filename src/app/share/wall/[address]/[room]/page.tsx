import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hangLayout } from "@/lib/constants";
import { loadWallShare, parseWallRoom } from "@/lib/wall-share";
import { wallShareText } from "@/lib/share";

type WallSharePageProps = {
  params: Promise<{ address: string; room: string }>;
};

export async function generateMetadata({
  params,
}: WallSharePageProps): Promise<Metadata> {
  const { address, room: roomParam } = await params;
  const room = parseWallRoom(roomParam);
  const wall = room ? await loadWallShare(address, room) : null;
  if (!wall) {
    return { title: "Chill Bugs Museum" };
  }

  const description = wallShareText(wall.bugs.length);
  return {
    title: `Museum wall · Chill Bugs Museum`,
    description,
    openGraph: {
      title: "Chill Bugs Museum",
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Chill Bugs Museum",
      description,
    },
  };
}

export default async function WallSharePage({ params }: WallSharePageProps) {
  const { address, room: roomParam } = await params;
  const room = parseWallRoom(roomParam);
  const wall = room ? await loadWallShare(address, room) : null;
  if (!wall) notFound();

  const layout = hangLayout(wall.bugs.length);
  const cellRem =
    wall.bugs.length === 1
      ? 20
      : wall.bugs.length <= 4
        ? 14
        : wall.bugs.length <= 8
          ? 11
          : 8;

  return (
    <main className="gallery-room flex min-h-screen flex-col">
      <header className="border-b border-border/50 bg-wall-deep/55 px-4 py-4 backdrop-blur-md sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-fg transition hover:text-gilt"
        >
          Chill Bugs Museum
        </Link>
      </header>

      <section className="gallery-wall relative flex min-h-0 flex-1 flex-col px-4 py-8 sm:px-10">
        <div className="relative z-10 mx-auto flex w-full max-w-[86rem] flex-1 items-center justify-center">
          <div
            className="flex flex-wrap content-center justify-center"
            style={{
              gap: "clamp(14px, 1.8vw, 28px)",
              width: `min(100%, calc(${layout.cols} * ${cellRem}rem + ${layout.cols - 1} * 1.5rem))`,
            }}
          >
            {wall.bugs.map((bug) => (
              <div
                key={bug.tokenId}
                className="wood-frame"
                style={{ width: `${cellRem}rem`, maxWidth: "100%" }}
              >
                <div className="wood-frame__mat">
                  <div className="relative aspect-square overflow-hidden bg-[#ddd6ca]">
                    {bug.imageUrl ? (
                      <Image
                        src={bug.imageUrl}
                        alt={bug.name}
                        fill
                        className="object-cover"
                        sizes="220px"
                        unoptimized
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="px-4 py-5 text-center font-serif text-sm tracking-[0.18em] text-gilt uppercase">
        {wall.bugs.length === 1
          ? "1 Chill Bug on the wall"
          : `${wall.bugs.length} Chill Bugs on the wall`}
      </p>
    </main>
  );
}
