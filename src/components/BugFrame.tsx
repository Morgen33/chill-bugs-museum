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
  const isLegendary = tier === "legendary";

  return (
    <button
      type="button"
      onClick={() => onSelect(bug)}
      className={`group relative hang-in sway ${tierClass[tier]} text-left outline-none`}
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
      aria-label={`${bug.name}, ${tierLabel(tier)}`}
    >
      <div
        className={[
          "relative overflow-hidden bg-bg-panel transition-transform duration-300 group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5",
          isLegendary ? "glow-breathe" : "",
        ].join(" ")}
        style={{
          padding: "var(--frame-pad)",
          borderRadius: "var(--frame-radius)",
          border: "var(--frame-border)",
          boxShadow: isLegendary ? undefined : "var(--frame-shadow)",
        }}
      >
        <div
          className="relative aspect-square overflow-hidden bg-bg"
          style={{ borderRadius: "calc(var(--frame-radius) - 6px)" }}
        >
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
            <div className="flex h-full items-center justify-center text-fg-muted text-sm">
              No image
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5 opacity-70" />
        </div>

        <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-fg">
              #{bug.tokenId}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-fg-muted">
              {tierLabel(tier)}
              {rarityAvailable ? ` · ${formatPercentile(percentile)}` : ""}
            </p>
          </div>
          {(tier === "rare" || tier === "legendary") && (
            <span
              className={[
                "mt-0.5 size-2 shrink-0 rounded-full",
                tier === "legendary" ? "bg-gold shadow-[0_0_10px_var(--gold-glow)]" : "bg-lime shadow-[0_0_10px_var(--lime-glow)]",
              ].join(" ")}
            />
          )}
        </div>

        {!rarityAvailable && (
          <p className="mt-1 px-0.5 text-[9px] uppercase tracking-wider text-fg-muted/70">
            Rarity unavailable
          </p>
        )}
      </div>
    </button>
  );
}
