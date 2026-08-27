"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { EnterHome } from "@/components/EnterHome";

export function HomeLanding() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    if (video.muted) {
      video.setAttribute("muted", "");
    }
    const play = video.play();
    if (play) {
      void play.then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
    }
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (video.paused) {
      tryPlay();
    }
  }, [tryPlay]);

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    tryPlay();
    const onReady = () => tryPlay();
    video.addEventListener("canplay", onReady);
    video.addEventListener("loadeddata", onReady);
    return () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [tryPlay]);

  return (
    <main className="fixed inset-0 overflow-hidden bg-black text-fg">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/hero-poster.jpg"
        aria-label="Chill Bugs"
        controls={false}
        disablePictureInPicture
        suppressHydrationWarning
        onClick={tryPlay}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {needsTap ? (
        <button
          type="button"
          onClick={tryPlay}
          className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-sm"
        >
          Play
        </button>
      ) : null}

      <Link
        href="/home"
        className="absolute top-4 left-4 z-30 text-xs font-semibold tracking-[0.22em] text-white/75 uppercase drop-shadow-md transition hover:text-white sm:top-6 sm:left-6"
      >
        Skip intro
      </Link>

      <button
        type="button"
        onClick={toggleSound}
        className="absolute top-4 right-4 z-30 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur-sm transition hover:border-white/45 hover:bg-black/75 sm:top-6 sm:right-6"
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        {muted ? "Sound on" : "Sound off"}
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-56 bg-gradient-to-t from-black/65 to-transparent" />

      <EnterHome />
    </main>
  );
}
