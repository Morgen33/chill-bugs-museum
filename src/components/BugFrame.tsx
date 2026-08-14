"use client";

import Image from "next/image";
import type { ChillBug } from "@/lib/types";
import { tierLabel } from "@/lib/rarity";
import { ShareToXLink, XLogo } from "./ShareToX";

type BugFrameProps = {
  bug: ChillBug;
  index: number;
  onSelect: (bug: ChillBug) => void;
};

export function BugFrame({ bug, index, onSelect }: BugFrameProps) {
  return (
    <div
      className="group hang-in relative w-full"
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      <button
        type="button"
        onClick={() => onSelect(bug)}
        className="w-full text-left outline-none"
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
      <ShareToXLink
        bug={bug}
        className="absolute inset-x-2 bottom-2 z-10 inline-flex items-center justify-center gap-1.5 bg-wall-deep/85 px-2 py-1.5 font-serif text-[10px] tracking-[0.16em] text-gilt uppercase shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition hover:bg-gilt hover:text-wall-deep sm:text-[11px]"
      >
        <XLogo className="h-3 w-3 fill-current" />
        Share to X
      </ShareToXLink>
    </div>
  );
}
