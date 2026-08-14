"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAccount } from "wagmi";
import type { BugsApiResponse, ChillBug } from "@/lib/types";
import { MuseumHero } from "./MuseumHero";
import { MuseumWall } from "./MuseumWall";
import { OPENSEA_COLLECTION_URL } from "@/lib/constants";

async function fetchBugs(address: string): Promise<ChillBug[]> {
  const res = await fetch(`/api/bugs?address=${address}`);
  const data = (await res.json()) as BugsApiResponse & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Failed to load bugs");
  }
  return data.bugs ?? [];
}

export function MuseumApp() {
  const { address, isConnected } = useAccount();

  const query = useQuery({
    queryKey: ["chill-bugs", address],
    queryFn: () => fetchBugs(address!),
    enabled: Boolean(isConnected && address),
    staleTime: 60_000,
  });

  const inGallery = Boolean(isConnected && address);

  return (
    <div
      className={[
        "relative flex min-h-screen flex-col",
        inGallery ? "gallery-room" : "bg-wall-deep",
      ].join(" ")}
    >
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-wall-deep/55 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-fg sm:text-xl">
              Chill Bugs
            </span>
            <span className="hidden font-serif text-sm tracking-[0.2em] text-gilt uppercase sm:inline">
              Museum
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[11px] font-semibold tracking-[0.18em] text-fg-muted uppercase sm:flex">
            <a
              href={OPENSEA_COLLECTION_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gilt"
            >
              Collection
            </a>
            <a
              href="https://chillbugs.xyz"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-gilt"
            >
              Playground
            </a>
          </nav>
          <div className="rk-connect scale-90 sm:scale-100">
            <ConnectButton
              chainStatus="none"
              showBalance={false}
              accountStatus="avatar"
            />
          </div>
        </div>
      </header>

      {!inGallery ? (
        <MuseumHero />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col pt-14 sm:pt-16">
          <MuseumWall
            bugs={query.data ?? []}
            loading={query.isLoading || query.isFetching}
            error={query.error ? query.error.message : null}
            address={address!}
          />
        </div>
      )}

      <footer
        className={[
          "px-4 py-6 text-center text-[11px] tracking-[0.18em] text-fg-muted uppercase",
          inGallery
            ? "gallery-floor border-0"
            : "relative z-10 -mt-px border-t border-border/50 bg-wall-deep/80 py-8",
        ].join(" ")}
      >
        Chill Bugs Museum · Unofficial holder gallery
      </footer>
    </div>
  );
}
