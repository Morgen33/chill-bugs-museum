import Link from "next/link";
import {
  SOCIAL_LINKS,
  type SocialIcon,
} from "@/lib/constants";

export function SocialIcons({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Social"
      className={["flex items-center gap-5", className].filter(Boolean).join(" ")}
    >
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.name}
          className="text-white/85 transition hover:text-[#d6ff3c]"
        >
          <SocialGlyph icon={link.icon} />
        </a>
      ))}
    </nav>
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
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current sm:h-7 sm:w-7">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function OpenSeaGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current sm:h-7 sm:w-7">
      <path d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12S6.201 22.5 12 22.5 22.5 17.799 22.5 12 17.799 1.5 12 1.5zm4.93 12.74c-.13.23-.41.31-.64.18l-1.43-.82c-.18 1.93-1.8 3.44-3.78 3.44-2.12 0-3.84-1.76-3.84-3.93 0-.3.03-.58.09-.86l-2.13.05c-.26.01-.48-.19-.5-.45-.2-2.33 1.16-4.5 3.4-5.4.23-.1.5 0 .6.23l.86 1.9c.73-.5 1.61-.8 2.56-.8 2.12 0 3.84 1.76 3.84 3.93 0 .28-.03.56-.08.83l1.92.43c.26.06.42.32.36.58l-.23.7z" />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current sm:h-7 sm:w-7">
      <path d="M19.54 5.26A17.4 17.4 0 0 0 15.89 4c-.16.29-.35.68-.48.99a16.1 16.1 0 0 0-6.82 0A11 11 0 0 0 8.1 4a17.5 17.5 0 0 0-3.66 1.27C1.5 9.03.88 12.7 1.05 16.32A17.7 17.7 0 0 0 6.18 20c.4-.55.76-1.13 1.07-1.74a11.5 11.5 0 0 1-1.69-.82c.14-.1.28-.21.41-.32 3.24 1.53 6.75 1.53 9.96 0 .14.11.28.22.41.32-.54.33-1.11.6-1.7.83.31.6.67 1.18 1.07 1.73a17.6 17.6 0 0 0 5.14-3.68c.3-4.07-.5-7.7-2.31-11.07ZM8.68 14.55c-.97 0-1.77-.9-1.77-2s.78-2.01 1.77-2.01 1.79.91 1.77 2.01c0 1.1-.8 2-1.77 2Zm6.64 0c-.97 0-1.77-.9-1.77-2s.78-2.01 1.77-2.01 1.79.91 1.77 2.01c0 1.1-.78 2-1.77 2Z" />
    </svg>
  );
}
