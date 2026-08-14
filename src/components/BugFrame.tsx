"use client";

import Image from "next/image";
import type { ChillBug } from "@/lib/types";
import { tierLabel } from "@/lib/rarity";

type BugFrameProps = {
  bug: ChillBug;
  index: number;
  onSelect: (bug: ChillBug) => void;
};

export function BugFrame({ bug, index, onSelect }: BugFrameProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(bug)}
      className="group hang-in w-full text-left outline-none"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
      aria-label={`${bug.name}, ${tierLabel(bug.rarity.tier)}`}
    >
      <div className="wood-frame transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
        <div className="wood-frame__mat">
          <div className="relative aspect-square overflow-hidden bg-[#ddd6ca]">
            {bug.imageUrl ? (
              <Image
                src={bug.imageUrl}
                alt={bug.name}
                fill
                sizes="(max-width: 640px) 78vw, 26rem"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-fg-muted">
                No image
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
