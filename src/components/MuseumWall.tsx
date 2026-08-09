"use client";

import { useEffect, useMemo, useState } from "react";
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

const PAGE_SIZE = 6;

export function MuseumWall({ bugs, loading, error, address }: MuseumWallProps) {
  const [selected, setSelected] = useState<ChillBug | null>(null);
  const [page, setPage] = useState(0);

  const short = useMemo(
    () => `${address.slice(0, 6)}…${address.slice(-4)}`,
    [address],
  );

  const pageCount = Math.max(1, Math.ceil(bugs.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);

  const pageBugs = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return bugs.slice(start, start + PAGE_SIZE);
  }, [bugs, safePage]);

  useEffect(() => {
    setPage(0);
  }, [address, bugs.length]);

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  useEffect(() => {
    if (bugs.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPage((p) => Math.max(0, p - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPage((p) => Math.min(pageCount - 1, p + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bugs.length, pageCount, selected]);

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
        <div className="flex min-h-[420px] flex-wrap items-end justify-center gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                width: i % 3 === 0 ? 240 : i % 2 === 0 ? 190 : 150,
              }}
            >
              <div
                className="bg-[linear-gradient(145deg,#c9a45a,#f3e2a8,#8b6914,#e8d08a,#6e5228)] p-4"
                style={{
                  height: i % 3 === 0 ? 260 : i % 2 === 0 ? 210 : 170,
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
    <section className="relative mx-auto flex w-full max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
          Private wing · {short}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
          Your Gallery
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
          {bugs.length} work{bugs.length === 1 ? "" : "s"} · rarest hang first
          in the grandest gilt frames
        </p>
      </div>

      <div className="relative flex min-h-[min(68vh,640px)] flex-col overflow-hidden border border-border bg-wall-lift/40 px-3 py-8 sm:px-10 sm:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 40% at 50% 12%, rgba(255,236,200,0.1), transparent 65%), linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35))",
          }}
        />

        <div
          key={safePage}
          className="relative flex flex-1 flex-wrap content-center items-end justify-center gap-5 sm:gap-7 md:gap-8"
        >
          {pageBugs.map((bug, index) => (
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
          className="rope-settle relative mx-auto mt-10 flex w-full max-w-xl items-end justify-between px-4"
        >
          <span className="stanchion relative" />
          <span className="velvet-rope mb-7 mx-1 flex-1" />
          <span className="stanchion relative" />
          <span className="velvet-rope mb-7 mx-1 flex-1" />
          <span className="stanchion relative" />
        </div>
      </div>

      <nav
        className="mt-8 flex items-center justify-center gap-4 sm:gap-6"
        aria-label="Gallery pages"
      >
        <button
          type="button"
          className="gallery-page-btn"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={safePage <= 0}
          aria-label="Previous page"
        >
          ←
        </button>

        <p className="min-w-[8rem] text-center font-serif text-lg tracking-[0.12em] text-gilt sm:text-xl">
          Room {safePage + 1}
          <span className="text-fg-muted"> / {pageCount}</span>
        </p>

        <button
          type="button"
          className="gallery-page-btn"
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={safePage >= pageCount - 1}
          aria-label="Next page"
        >
          →
        </button>
      </nav>

      <BugLightbox bug={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
