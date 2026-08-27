import type { Metadata } from "next";
import { MuseumApp } from "@/components/MuseumApp";

export const metadata: Metadata = {
  title: "Museum · Chill Bugs",
  description:
    "Connect your wallet and hang your Chill Bugs in a personal gallery wing — rarer bugs earn the grander gilt frames.",
};

export default function MuseumPage() {
  return <MuseumApp />;
}
