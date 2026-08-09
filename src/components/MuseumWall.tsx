"use client";

import { useMemo, useState } from "react";
import type { ChillBug } from "@/lib/types";
import { BugFrame } from "./BugFrame";
import { BugLightbox } from "./BugLightbox";
import { OPENSEA_COLLECTION_URL } from "@/lib/constants";

type MuseumWallProps = {
  bugs: ChillBug[];
  loading: boolean;
  error: string | null;
  address: string;
};

export function MuseumWall({ bugs, loading, error, address }: MuseumWallProps) {
  const [selected, setSelected] = useState<ChillBug | null>(null);

  const short = useMemo(
    () => `${address.slice(0, 6)}…${address.slice(-4)}`,
    [address],
  );

  if (loading) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime">
            Curating your wing
          </p>
          <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Hanging your bugs…
          </h2>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border bg-bg-panel"
              style={{
                width: i % 3 === 0 ? 220 : i % 2 === 0 ? 180 : 150,
                height: i % 3 === 0 ? 260 : i % 2 === 0 ? 220 : 190,
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime">
          Museum notice
        </p>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight">
          Couldn’t load the wall
        </h2>
        <p className="mt-4 text-fg-muted">{error}</p>
      </section>
    );
  }

  if (bugs.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime">
          Empty wing
        </p>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          No Chill Bugs in this wallet
        </h2>
        <p className="mt-4 text-fg-muted">
          Hop over to OpenSea, pick up a bug, then come back to hang it on your
          wall.
        </p>
        <a
          href={OPENSEA_COLLECTION_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex rounded-full bg-lime px-6 py-3 text-sm font-bold uppercase tracking-wider text-bg transition hover:brightness-110"
        >
          Browse Chill Bugs
        </a>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10 flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime">
          Private wing · {short}
        </p>
        <h2 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-5xl">
          Your Bug Museum
        </h2>
        <p className="mt-3 max-w-md text-sm text-fg-muted sm:text-base">
          {bugs.length} bug{bugs.length === 1 ? "" : "s"} on the wall — rarer
          frames hang larger and brighter.
        </p>
      </div>

      <div className="relative rounded-3xl border border-border bg-bg-elevated/40 px-3 py-8 sm:px-8 sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(182,255,60,0.05), transparent 60%)",
          }}
        />
        <div className="relative flex flex-wrap items-end justify-center gap-4 sm:gap-6 md:gap-8">
          {bugs.map((bug, index) => (
            <BugFrame
              key={bug.tokenId}
              bug={bug}
              index={index}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      <BugLightbox bug={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
