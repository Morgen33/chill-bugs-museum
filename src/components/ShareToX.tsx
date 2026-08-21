"use client";

import { useEffect, useState } from "react";
import {
  WALL_SHARE_IMAGE_NAME,
  wallShareOgImageUrl,
  wallShareToXUrl,
} from "@/lib/share";

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

async function fetchWallPng(url: string): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("wall image failed");
  }
  const blob = await res.blob();
  if (!blob.type.startsWith("image/")) {
    throw new Error("wall image was not an image");
  }
  return blob;
}

function pngFile(blob: Blob): File {
  return new File([blob], WALL_SHARE_IMAGE_NAME, { type: "image/png" });
}

function downloadPng(blob: Blob): void {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = WALL_SHARE_IMAGE_NAME;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

function isShareAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export function ShareWallToX({ address, count, room }: ShareWallToXProps) {
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [prepared, setPrepared] = useState<{ key: string; blob: Blob } | null>(
    null,
  );
  const wallKey = `${address.toLowerCase()}:${room}`;
  const readyBlob = prepared?.key === wallKey ? prepared.blob : null;

  useEffect(() => {
    const url = wallShareOgImageUrl(address, room);
    const key = `${address.toLowerCase()}:${room}`;
    let cancelled = false;
    void fetchWallPng(url)
      .then((blob) => {
        if (!cancelled) setPrepared({ key, blob });
      })
      .catch(() => {
        // share() fetches on demand if this preload misses
      });
    return () => {
      cancelled = true;
    };
  }, [address, room]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function share() {
    if (busy) return;
    setBusy(true);

    const href = wallShareToXUrl(address, count, room);
    let blob: Blob | null = readyBlob;

    try {
      blob = readyBlob ?? (await fetchWallPng(wallShareOgImageUrl(address, room)));
      setPrepared({ key: wallKey, blob });
      const file = pngFile(blob);
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

      if (isMobile && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        window.open(href, "_blank", "noopener,noreferrer");
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        downloadPng(blob);
        setToast("Pasted to clipboard");
      }
    } catch (error) {
      if (!isShareAbort(error)) {
        if (blob) downloadPng(blob);
        setToast("Could not copy the picture — attach the downloaded file");
        window.open(href, "_blank", "noopener,noreferrer");
      }
    }

    setBusy(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
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
      {toast ? (
        <p
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-brass px-4 py-2 text-xs font-semibold tracking-[0.14em] text-wall-deep uppercase shadow-lg"
        >
          {toast}
        </p>
      ) : null}
    </div>
  );
}
