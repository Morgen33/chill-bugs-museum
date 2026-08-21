"use client";

import { useEffect, useState } from "react";
import {
  WALL_SHARE_IMAGE_NAME,
  wallShareOgImageUrl,
  wallShareText,
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

async function copyPng(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
    return false;
  }
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    return true;
  } catch {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": Promise.resolve(blob),
        }),
      ]);
      return true;
    } catch {
      return false;
    }
  }
}

function canShareFiles(file: File): boolean {
  return typeof navigator.canShare === "function" && navigator.canShare({ files: [file] });
}

async function sharePngNative(file: File, text: string): Promise<boolean> {
  if (!canShareFiles(file) || typeof navigator.share !== "function") {
    return false;
  }
  try {
    await navigator.share({ files: [file], text, title: "Chill Bugs Museum" });
    return true;
  } catch (error) {
    return error instanceof Error && error.name === "AbortError";
  }
}

function openComposer(
  href: string,
  popup: Window | null,
): void {
  if (popup && !popup.closed) {
    popup.location.href = href;
    return;
  }
  window.open(href, "_blank", "noopener,noreferrer");
}

export function ShareWallToX({ address, count, room }: ShareWallToXProps) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
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

  async function handOffPicture(blob: Blob): Promise<void> {
    const copied = await copyPng(blob);
    downloadPng(blob);
    setHint(
      copied
        ? "Paste the picture into the post (Ctrl+V / ⌘V), or attach the file that downloaded."
        : "Attach the wall picture that just downloaded to your post.",
    );
  }

  async function share() {
    if (busy) return;
    setBusy(true);
    setHint(null);

    const href = wallShareToXUrl(address, count, room);
    const caption = `${wallShareText(count)} #ChillBugs`;
    const readyFile = readyBlob ? pngFile(readyBlob) : null;
    const nativeReady = readyFile ? canShareFiles(readyFile) : false;
    const popup = nativeReady ? null : window.open("about:blank", "_blank");

    try {
      if (readyBlob && readyFile && nativeReady) {
        if (await sharePngNative(readyFile, caption)) {
          setBusy(false);
          return;
        }
      }

      if (readyBlob) {
        openComposer(href, popup);
        await handOffPicture(readyBlob);
        setBusy(false);
        return;
      }

      const blob = await fetchWallPng(wallShareOgImageUrl(address, room));
      setPrepared({ key: wallKey, blob });
      const file = pngFile(blob);
      if (await sharePngNative(file, caption)) {
        popup?.close();
        setBusy(false);
        return;
      }
      openComposer(href, popup);
      await handOffPicture(blob);
    } catch {
      openComposer(href, popup);
      setHint("Could not prepare the picture. Try again in a moment.");
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
      {hint ? (
        <p className="max-w-md text-center text-xs tracking-[0.12em] text-gilt uppercase">
          {hint}
        </p>
      ) : (
        <p className="max-w-md text-center text-xs tracking-[0.12em] text-fg-muted uppercase">
          X will not attach the picture by itself — this copies it for you to paste
        </p>
      )}
    </div>
  );
}
