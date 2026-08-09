"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export function MuseumHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src="/museum-hero.png"
        alt="Chill Bugs gallery hall with gilt frames and velvet rope"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_28%] scale-105"
      />

      <div
        aria-hidden
        className="spotlight-beam absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,236,200,0.18),transparent_70%)]"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-wall-deep via-wall-deep/80 to-wall-deep/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,transparent_15%,rgba(14,12,10,0.62)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-wall-deep via-wall-deep/90 to-transparent"
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-5 pb-16 pt-28 text-center sm:pb-20 sm:pt-32">
        <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase sm:text-base">
          Now open
        </p>

        <h1 className="mt-3 max-w-4xl font-serif text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.9] font-semibold tracking-tight text-fg">
          Chill Bugs
          <span className="mt-1 block font-medium text-gilt">Museum</span>
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
          Connect your wallet. Your collection hangs in a private wing — rarer
          bugs earn the grander gilt frames.
        </p>

        <div className="rk-connect mt-8">
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            label="Enter the gallery"
          />
        </div>

        <div
          aria-hidden
          className="rope-settle mt-12 flex w-full max-w-sm items-end justify-between px-2"
        >
          <span className="stanchion relative" />
          <span className="velvet-rope mb-7 flex-1 mx-1" />
          <span className="stanchion relative" />
        </div>
      </div>
    </section>
  );
}
