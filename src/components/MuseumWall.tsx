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
        <div className="mb-12 text-center">
          <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
            Curating your wing
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Hanging your collection…
          </h2>
        </div>
        <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                width: i % 3 === 0 ? 220 : i % 2 === 0 ? 180 : 150,
              }}
            >
              <div
                className="bg-[linear-gradient(145deg,#8a7040,#d4b87a,#6e5630)] p-3"
                style={{
                  height: i % 3 === 0 ? 240 : i % 2 === 0 ? 200 : 170,
                }}
              >
                <div className="h-full bg-wall-deep/80" />
              </div>
              <div className="plaque mx-auto mt-3 h-8 w-4/5" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
          Museum notice
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
          Couldn’t load the wall
        </h2>
        <p className="mt-4 text-fg-muted">{error}</p>
      </section>
    );
  }

  if (bugs.length === 0) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
          Empty wing
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          No Chill Bugs in this wallet
        </h2>
        <p className="mt-4 text-fg-muted">
          Visit OpenSea, acquire a bug, then return to hang it in your private
          gallery.
        </p>
        <a
          href={OPENSEA_COLLECTION_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex bg-brass px-7 py-3 text-sm font-semibold tracking-[0.14em] text-wall-deep uppercase transition hover:bg-gilt"
        >
          Browse Chill Bugs
        </a>
      </section>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12 flex flex-col items-center text-center">
        <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
          Private wing · {short}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
          Your Gallery
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
          {bugs.length} work{bugs.length === 1 ? "" : "s"} on view — rarer
          pieces hang in the grander gilt frames.
        </p>
      </div>

      <div className="relative overflow-hidden border border-border bg-wall-lift/40 px-3 py-10 sm:px-10 sm:py-14">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 50% 12%, rgba(255,236,200,0.1), transparent 65%), linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
          }}
        />

        <div className="relative flex flex-wrap items-end justify-center gap-5 sm:gap-7 md:gap-9">
          {bugs.map((bug, index) => (
            <BugFrame
              key={bug.tokenId}
              bug={bug}
              index={index}
              onSelect={setSelected}
            />
          ))}
        </div>

        <div
          aria-hidden
          className="rope-settle relative mx-auto mt-12 flex w-full max-w-2xl items-end justify-between px-4"
        >
          <span className="stanchion relative" />
          <span className="velvet-rope mb-7 flex-1 mx-1" />
          <span className="stanchion relative" />
          <span className="velvet-rope mb-7 flex-1 mx-1" />
          <span className="stanchion relative" />
        </div>
      </div>

      <BugLightbox bug={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
