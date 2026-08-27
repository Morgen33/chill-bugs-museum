"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { SOCIAL_LINKS, type SocialIcon } from "@/lib/constants";

export function HomeLanding() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
    if (video.paused) {
      void video.play();
    }
  }, []);

  return (
    <main className="flex min-h-svh flex-col bg-black text-fg">
      <section className="relative min-h-0 flex-1 bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.jpg"
          aria-label="Chill Bugs"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggleSound}
          className="absolute right-4 bottom-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur-sm transition hover:border-white/45 hover:bg-black/75 sm:right-6 sm:bottom-6"
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
      </section>

      <footer className="flex shrink-0 flex-col items-center gap-3 bg-black px-5 pt-4 pb-5 sm:gap-4 sm:pt-5 sm:pb-6">
        <Image
          src="/logo.png"
          alt="Chill Bugs"
          width={512}
          height={512}
          priority
          className="h-40 w-40 object-contain sm:h-56 sm:w-56"
        />

          <nav
            aria-label="Social"
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5"
          >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 text-fg-muted transition hover:border-[#49d5ff]/50 hover:bg-white/10 hover:text-fg sm:px-5"
            >
              <SocialGlyph icon={link.icon} />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
                {link.name}
              </span>
            </a>
          ))}
        </nav>

        <Link
          href="/museum"
          className="text-[10px] tracking-[0.22em] text-white/35 uppercase transition hover:text-white/70"
        >
          Museum
        </Link>
      </footer>
    </main>
  );
}

function SocialGlyph({ icon }: { icon: SocialIcon }) {
  switch (icon) {
    case "twitter":
      return <TwitterGlyph />;
    case "opensea":
      return <OpenSeaGlyph />;
    case "discord":
      return <DiscordGlyph />;
    default: {
      const _exhaustive: never = icon;
      return _exhaustive;
    }
  }
}

function TwitterGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 fill-current"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function OpenSeaGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 fill-current"
    >
      <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5zm4.93 12.74c-.13.23-.41.31-.64.18l-1.43-.82c-.18 1.93-1.8 3.44-3.78 3.44-2.12 0-3.84-1.76-3.84-3.93 0-.3.03-.58.09-.86l-2.13.05c-.26.01-.48-.19-.5-.45-.2-2.33 1.16-4.5 3.4-5.4.23-.1.5 0 .6.23l.86 1.9c.73-.5 1.61-.8 2.56-.8 2.12 0 3.84 1.76 3.84 3.93 0 .28-.03.56-.08.83l1.92.43c.26.06.42.32.36.58l-.23.7z" />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 fill-current"
    >
      <path d="M19.54 5.26A17.4 17.4 0 0 0 15.89 4c-.16.29-.35.68-.48.99a16.1 16.1 0 0 0-6.82 0A11 11 0 0 0 8.1 4a17.5 17.5 0 0 0-3.66 1.27C1.5 9.03.88 12.7 1.05 16.32A17.7 17.7 0 0 0 6.18 20c.4-.55.76-1.13 1.07-1.74a11.5 11.5 0 0 1-1.69-.82c.14-.1.28-.21.41-.32 3.24 1.53 6.75 1.53 9.96 0 .14.11.28.22.41.32-.54.33-1.11.6-1.7.83.31.6.67 1.18 1.07 1.73a17.6 17.6 0 0 0 5.14-3.68c.3-4.07-.5-7.7-2.31-11.07ZM8.68 14.55c-.97 0-1.77-.9-1.77-2s.78-2.01 1.77-2.01 1.79.91 1.77 2.01c0 1.1-.8 2-1.77 2Zm6.64 0c-.97 0-1.77-.9-1.77-2s.78-2.01 1.77-2.01 1.79.91 1.77 2.01c0 1.1-.78 2-1.77 2Z" />
    </svg>
  );
}
