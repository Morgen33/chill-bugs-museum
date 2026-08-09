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

  return (
    <div className="museum-grid museum-vignette relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold uppercase tracking-[0.12em]"
          >
            <span aria-hidden>🐛</span>
            <span className="text-sm sm:text-base">Chill Bugs</span>
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted sm:flex">
            <a
              href={OPENSEA_COLLECTION_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-lime"
            >
              Collection
            </a>
            <a
              href="https://chillbugs.xyz"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-lime"
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

      {!isConnected || !address ? (
        <MuseumHero />
      ) : (
        <div className="pt-16">
          <MuseumWall
            bugs={query.data ?? []}
            loading={query.isLoading || query.isFetching}
            error={query.error ? query.error.message : null}
            address={address}
          />
        </div>
      )}

      <footer className="border-t border-border/60 px-4 py-8 text-center text-xs uppercase tracking-[0.16em] text-fg-muted">
        Chill Bugs Museum · Unofficial holder gallery
      </footer>
    </div>
  );
}
