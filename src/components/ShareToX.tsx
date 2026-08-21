"use client";

import { useState } from "react";
import { wallShareOgImageUrl, wallShareToXUrl } from "@/lib/share";

export function XLogo({ className = "h-3.5 w-3.5 fill-current" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.688L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

type ShareWallToXProps = {
  address: string;
  count: number;
  room: number;
};

async function warmOgImage(url: string): Promise<void> {
  await Promise.race([
    fetch(url).then(async (res) => {
      if (!res.ok) throw new Error("og image failed");
      await res.arrayBuffer();
    }),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 20000);
    }),
  ]);
}

export function ShareWallToX({ address, count, room }: ShareWallToXProps) {
  const [busy, setBusy] = useState(false);

  async function share() {
    if (busy) return;
    setBusy(true);
    try {
      await warmOgImage(wallShareOgImageUrl(address, room));
    } catch {
      // Still open the composer; X may pick up the card on a later crawl.
    }
    window.open(
      wallShareToXUrl(address, count, room),
      "_blank",
      "noopener,noreferrer",
    );
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={() => {
        void share();
      }}
      disabled={busy}
      className="relative z-10 inline-flex items-center justify-center gap-2 bg-brass px-5 py-2.5 text-sm font-semibold tracking-[0.14em] text-wall-deep uppercase transition hover:bg-gilt disabled:cursor-wait disabled:opacity-80"
      aria-label="Share wall to X"
    >
      <XLogo />
      {busy ? "PREPARING…" : "SHARE TO X"}
    </button>
  );
}
