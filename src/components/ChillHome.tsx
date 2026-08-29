import Image from "next/image";
import Link from "next/link";
import { HomeHeader } from "@/components/HomeHeader";
import { SocialIcons } from "@/components/SocialIcons";
import {
  DISCORD_URL,
  GO_CHILL_URL,
  OPENSEA_COLLECTION_URL,
  TWITTER_URL,
} from "@/lib/constants";

type CardAccent = "pink" | "cyan" | "lime" | "violet";

type HomeCard = {
  accent: CardAccent;
  title: string;
  body: string;
  href: string;
  external: boolean;
  cta: string;
  solid: boolean;
};

const CARDS: HomeCard[] = [
  {
    accent: "pink",
    title: "Gallery",
    body: "Browse the full collection of Chill Bugs — 3,995 unique NFTs with chill vibes and bold personalities.",
    href: "/museum",
    external: false,
    cta: "Explore Gallery →",
    solid: false,
  },
  {
    accent: "cyan",
    title: "Go Chill Game",
    body: "Hop into Go Chill, earn Bug Points, and claim your spot with the rest of the meadow.",
    href: GO_CHILL_URL,
    external: true,
    cta: "Play Now →",
    solid: true,
  },
  {
    accent: "lime",
    title: "Community",
    body: "Good vibes. Real friends. Join our growing community of chill collectors and adventure seekers.",
    href: DISCORD_URL,
    external: true,
    cta: "Join the Chill →",
    solid: true,
  },
  {
    accent: "violet",
    title: "OpenSea Collections",
    body: "View our verified collection on OpenSea and start your adventure today.",
    href: OPENSEA_COLLECTION_URL,
    external: true,
    cta: "View on OpenSea →",
    solid: false,
  },
];

export function ChillHome() {
  return (
    <div className="min-h-screen bg-black text-white">
      <HomeHeader />

      <div>
        <section>
          <Image
            src="/home-hero.jpg"
            alt="Chill Bugs on a sunset road trip"
            width={1024}
            height={576}
            priority
            className="h-auto w-full"
          />
          <HeroCopy className="mx-auto max-w-3xl px-5 py-8 sm:px-10 sm:py-10" />
        </section>

        <section className="mx-auto grid max-w-[92rem] grid-cols-1 gap-4 px-4 pb-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className={`chill-card chill-card--${card.accent} flex flex-col p-5`}
            >
              <div className="flex items-center gap-3">
                <CardIcon accent={card.accent} />
                <h2 className="text-xl font-extrabold italic">{card.title}</h2>
              </div>
              {card.accent === "cyan" ? (
                <Image
                  src="/home-game-cards.jpg"
                  alt="Go Chill playing cards"
                  width={440}
                  height={210}
                  className="mt-4 w-full rounded-lg object-cover"
                />
              ) : (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">
                  {card.body}
                </p>
              )}
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "chill-card-btn mt-5",
                    card.solid ? "chill-card-btn--solid" : "",
                  ].join(" ")}
                >
                  {card.cta}
                </a>
              ) : (
                <Link
                  href={card.href}
                  className={[
                    "chill-card-btn mt-5",
                    card.solid ? "chill-card-btn--solid" : "",
                  ].join(" ")}
                >
                  {card.cta}
                </Link>
              )}
            </article>
          ))}
        </section>
      </div>

      <footer className="flex flex-col items-start justify-between gap-4 border-t border-[#d6ff3c] bg-black px-5 py-4 sm:flex-row sm:items-center sm:px-8">
        <p className="max-w-xl text-sm text-white/85">
          <span className="mr-2 text-[#d6ff3c]">♡</span>
          Stay Chill. Stay Connected. Follow us for updates, drops, and more
          good vibes.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <SocialIcons />
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#d6ff3c] px-4 py-2 text-sm font-semibold text-black"
          >
            Follow on Twitter →
          </a>
        </div>
      </footer>
    </div>
  );
}

function HeroCopy({ className }: { className: string }) {
  return (
    <div className={className}>
      <h1 className="relative font-sans text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.9] font-extrabold tracking-tight italic">
        <Sparkles />
        Stay Chill.
        <span className="mt-1 block text-[#d6ff3c]">Collect Adventure.</span>
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-white/90 sm:text-base">
        Chill Bugs is a laid-back NFT collection of{" "}
        <span className="font-semibold text-[#d6ff3c]">3,995</span> unique bugs
        on a mission to spread good vibes and big adventures. Play{" "}
        <span className="font-semibold text-[#d6ff3c]">Go Chill</span>, and
        collect with a community that&apos;s always down to chill.
      </p>
    </div>
  );
}

function Sparkles() {
  return (
    <span className="absolute top-2 -left-7 hidden text-[#d6ff3c] sm:block" aria-hidden>
      <svg viewBox="0 0 36 72" className="h-16 w-8 fill-current">
        <path d="M8 14 10.2 8 12.4 14 18 16.2 12.4 18.4 10.2 24 8 18.4 2.4 16.2z" />
        <path d="M22 36 24.6 28 27.2 36 35 38.6 27.2 41.2 24.6 49 22 41.2 14.2 38.6z" />
        <path d="M6 54 7.6 50 9.2 54 13 55.6 9.2 57.2 7.6 61 6 57.2 2.2 55.6z" />
      </svg>
    </span>
  );
}

function CardIcon({ accent }: { accent: CardAccent }) {
  const className = "h-5 w-5";
  switch (accent) {
    case "pink":
      return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4fd8]/15 text-[#ff4fd8] shadow-[0_0_16px_rgba(255,79,216,0.45)]">
          <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M3 18h18l-6.2-8.4-3.1 4.1-2.4-3.2L3 18zm12.2-11.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
          </svg>
        </span>
      );
    case "cyan":
      return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3ecbff]/15 text-[#3ecbff] shadow-[0_0_16px_rgba(62,203,255,0.45)]">
          <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M6 8h12v8H6V8zm-3 2h2v4H3v-4zm16 0h2v4h-2v-4zM9 18h6v2H9v-2z" />
          </svg>
        </span>
      );
    case "lime":
      return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d6ff3c]/15 text-[#d6ff3c] shadow-[0_0_16px_rgba(214,255,60,0.4)]">
          <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 18a4 4 0 0 1 4-4h1.2a5.5 5.5 0 0 1 5.6 0H16a4 4 0 0 1 4 4v1H4v-1z" />
          </svg>
        </span>
      );
    case "violet":
      return (
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#9b6bff]/15 text-[#9b6bff] shadow-[0_0_16px_rgba(155,107,255,0.45)]">
          <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
            <path d="M4 17.5h16l-8-4.2-8 4.2zm8-12.3 5.8 8.4H6.2L12 5.2z" />
          </svg>
        </span>
      );
    default: {
      const _exhaustive: never = accent;
      return _exhaustive;
    }
  }
}
