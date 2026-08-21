import type { Metadata } from "next";
import { wallShareOgImageUrl, wallSharePageUrl, wallShareText } from "@/lib/share";
import type { WallShareData } from "@/lib/wall-share";

export function wallShareMetadata(wall: WallShareData): Metadata {
  const description = wallShareText(wall.bugs.length);
  const image = {
    url: wallShareOgImageUrl(wall.address, wall.room),
    width: 1200,
    height: 630,
    alt: "Chill Bugs museum wall",
    type: "image/png" as const,
  };

  return {
    title: `Museum wall · Chill Bugs Museum`,
    description,
    openGraph: {
      title: "Chill Bugs Museum",
      description,
      type: "website",
      url: wallSharePageUrl(wall.address, wall.room),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: "Chill Bugs Museum",
      description,
      images: [image.url],
    },
  };
}
