"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { SocialIcons } from "@/components/SocialIcons";
import {
  GO_CHILL_URL,
  OPENSEA_COLLECTION_URL,
} from "@/lib/constants";

const NAV = [
  { href: "/home", label: "Home", external: false },
  { href: "/museum", label: "Gallery", external: false },
  { href: GO_CHILL_URL, label: "Go Chill Game", external: true },
  { href: OPENSEA_COLLECTION_URL, label: "OpenSea", external: true },
] as const;

export function HomeHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <header className="relative z-40 bg-black px-4 py-3 sm:px-8">
      <div className="flex items-center justify-between gap-4 md:grid md:grid-cols-[auto_1fr_auto] md:items-center">
        <Link href="/home" className="shrink-0" onClick={close}>
          <Image
            src="/logo.png"
            alt="Chill Bugs"
            width={160}
            height={160}
            priority
            className="h-20 w-20 object-contain md:h-40 md:w-40"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-8 text-base font-medium text-white md:flex">
          {NAV.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </nav>

        <SocialIcons className="hidden justify-end md:flex" />

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/25 text-white md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open ? (
        <div
          id={menuId}
          className="mt-4 border-t border-white/15 pt-4 pb-2 md:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                className="rounded-lg px-2 py-3 text-xl"
                onNavigate={close}
              />
            ))}
          </nav>
          <SocialIcons className="mt-5 px-2 pb-2" />
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  item,
  className,
  onNavigate,
}: {
  item: (typeof NAV)[number];
  className?: string;
  onNavigate?: () => void;
}) {
  const classes = [
    "transition hover:text-[#d6ff3c]",
    item.href === "/home"
      ? "decoration-[#d6ff3c] underline decoration-2 underline-offset-[6px]"
      : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={classes} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
