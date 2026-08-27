import type { Metadata } from "next";
import { ChillHome } from "@/components/ChillHome";

export const metadata: Metadata = {
  title: "Chill Bugs — Stay Chill. Collect Adventure.",
  description:
    "A laid-back NFT collection of 3,995 unique bugs. Browse the gallery, play Go Chill, and join the community.",
};

export default function HomePage() {
  return <ChillHome />;
}
