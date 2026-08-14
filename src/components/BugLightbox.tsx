"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { ChillBug } from "@/lib/types";
import { formatPercentile, tierLabel } from "@/lib/rarity";
import { ShareToXLink, XLogo } from "./ShareToX";

type BugLightboxProps = {
  bug: ChillBug | null;
  onClose: () => void;
};

export function BugLightbox({ bug, onClose }: BugLightboxProps) {
  useEffect(() => {
    if (!bug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [bug, onClose]);

  if (!bug) return null;

  const { tier, percentile, rank, rarityAvailable } = bug.rarity;

  return (
    <div
      className="bug-lightbox fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={bug.name}
    >
      <button
        type="button"
        className="fixed inset-0 bg-wall-deep/85 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex min-h-[calc(100dvh-2rem)] items-center justify-center sm:min-h-[calc(100dvh-4rem)]"
        onClick={onClose}
      >
        <div
          className="relative grid w-full max-w-3xl max-h-[90dvh] overflow-y-auto border border-border bg-wall shadow-[0_30px_80px_rgba(0,0,0,0.65)] md:grid-cols-[1.1fr_1fr] md:grid-rows-1 md:overflow-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <ShareToXLink
              bug={bug}
              className="inline-flex h-10 items-center gap-2 border border-gilt bg-wall-deep/90 px-3 text-xs font-semibold tracking-[0.14em] text-gilt uppercase transition hover:bg-gilt hover:text-wall-deep"
            >
              <XLogo />
              Share
            </ShareToXLink>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center border border-border-strong bg-wall-deep/80 font-serif text-2xl leading-none text-gilt transition hover:border-gilt hover:text-gilt-bright"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md bg-wall-deep p-4 sm:p-5 md:max-w-none">
            <div className="ornate-frame frame-lightbox">
              <span aria-hidden className="frame-corner frame-corner--tl" />
              <span aria-hidden className="frame-corner frame-corner--tr" />
              <span aria-hidden className="frame-corner frame-corner--bl" />
              <span aria-hidden className="frame-corner frame-corner--br" />
              <div className="ornate-frame__mat h-full">
                <div className="relative aspect-square overflow-hidden bg-wall-deep">
                  {bug.imageUrl ? (
                    <Image
                      src={bug.imageUrl}
                      alt={bug.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 420px"
                      unoptimized
                      priority
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto p-6 sm:p-8 md:pt-16">
            <div className="md:pr-28">
              <p className="font-serif text-sm tracking-[0.22em] text-gilt uppercase">
                {tierLabel(tier)}
                {rarityAvailable ? ` · ${formatPercentile(percentile)}` : ""}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                {bug.name}
              </h2>
              {rarityAvailable && rank != null && (
                <p className="mt-2 text-sm text-fg-muted">
                  Rank #{rank}
                  {bug.rarity.tokensScored
                    ? ` / ${bug.rarity.tokensScored}`
                    : ""}
                </p>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <ShareToXLink
                bug={bug}
                className="inline-flex items-center justify-center gap-2 bg-brass px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-wall-deep uppercase transition hover:bg-gilt"
              >
                <XLogo />
                Share to X
              </ShareToXLink>
              <a
                href={bug.openseaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-border-strong px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-fg uppercase transition hover:border-gilt hover:text-gilt"
              >
                View on OpenSea
              </a>
            </div>

            {bug.traits.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {bug.traits.map((trait) => (
                  <div
                    key={`${trait.traitType}-${trait.value}`}
                    className="border border-border bg-wall-deep/60 px-3 py-2"
                  >
                    <p className="text-[10px] tracking-wider text-fg-muted uppercase">
                      {trait.traitType}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-fg">
                      {trait.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
