"use client";

import Image from "next/image";
import type { ChillBug } from "@/lib/types";
import { formatPercentile, tierLabel } from "@/lib/rarity";

type BugFrameProps = {
  bug: ChillBug;
  index: number;
  onSelect: (bug: ChillBug) => void;
};

const tierClass: Record<ChillBug["rarity"]["tier"], string> = {
  common: "frame-common",
  uncommon: "frame-uncommon",
  rare: "frame-rare",
  legendary: "frame-legendary",
};

export function BugFrame({ bug, index, onSelect }: BugFrameProps) {
  const { tier, percentile, rarityAvailable } = bug.rarity;

  return (
    <button
      type="button"
      onClick={() => onSelect(bug)}
      className={`group relative hang-in sway ${tierClass[tier]} text-left outline-none`}
      style={{ animationDelay: `${Math.min(index, 12) * 70}ms` }}
      aria-label={`${bug.name}, ${tierLabel(tier)}`}
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-8 left-1/2 h-10 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,236,200,0.28),transparent_70%)] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="ornate-frame transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
          <div className="ornate-frame__mat">
            <div className="relative aspect-square overflow-hidden bg-wall-deep">
              {bug.imageUrl ? (
                <Image
                  src={bug.imageUrl}
                  alt={bug.name}
                  fill
                  sizes="(max-width: 768px) 45vw, 250px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-fg-muted">
                  No image
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
            </div>
          </div>
        </div>

        <div className="plaque mx-auto mt-3 max-w-[92%] px-2.5 py-1.5 text-center">
          <p className="truncate font-serif text-[13px] font-semibold tracking-wide">
            #{bug.tokenId}
          </p>
          <p className="mt-0.5 truncate text-[9px] font-medium tracking-[0.12em] uppercase opacity-80">
            {tierLabel(tier)}
            {rarityAvailable ? ` · ${formatPercentile(percentile)}` : ""}
          </p>
        </div>

        {!rarityAvailable && (
          <p className="mt-1.5 text-center text-[9px] tracking-wider text-fg-muted/70 uppercase">
            Rarity unavailable
          </p>
        )}
      </div>
    </button>
  );
}
