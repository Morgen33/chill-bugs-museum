"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function MuseumHero() {
  return (
    <section className="relative flex min-h-[78vh] flex-col items-center justify-center px-4 pb-16 pt-28 text-center sm:px-6">
      <span
        aria-hidden
        className="float-bug pointer-events-none absolute left-[8%] top-[22%] text-3xl opacity-70 sm:text-4xl"
      >
        🦋
      </span>
      <span
        aria-hidden
        className="float-bug pointer-events-none absolute right-[10%] top-[30%] text-2xl opacity-50 sm:text-3xl"
        style={{ animationDelay: "1.2s" }}
      >
        🦗
      </span>
      <span
        aria-hidden
        className="float-bug pointer-events-none absolute bottom-[18%] left-[18%] text-2xl opacity-40"
        style={{ animationDelay: "2.4s" }}
      >
        🐞
      </span>

      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-panel/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fg-muted">
        <span className="size-1.5 rounded-full bg-lime shadow-[0_0_8px_var(--lime-glow)]" />
        Personal museum · Now open
      </p>

      <h1 className="mt-6 max-w-4xl text-5xl font-bold uppercase leading-[0.95] tracking-tight text-fg sm:text-7xl md:text-8xl">
        <span className="block text-lime drop-shadow-[0_0_28px_var(--lime-glow)]">
          Chill Bugs
        </span>
        <span className="mt-2 block text-fg/90">Museum</span>
      </h1>

      <p className="mt-6 max-w-md text-base text-fg-muted sm:text-lg">
        Connect your wallet. Your bugs hang on the wall — rarer ones get the
        bigger, glowing frames.
      </p>

      <div className="rk-connect mt-10">
        <ConnectButton
          chainStatus="icon"
          showBalance={false}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          label="Connect wallet"
        />
      </div>
    </section>
  );
}
