import Link from "next/link";

export function EnterHome() {
  return (
    <Link
      href="/home"
      className="enter-home absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-30 inline-flex min-w-[200px] -translate-x-1/2 items-center justify-center rounded-full bg-[#d6ff3c] px-10 py-3 font-[family-name:var(--font-bangers)] text-3xl tracking-[0.12em] text-black shadow-[0_8px_0_#3d4a00,0_0_32px_rgba(214,255,60,0.45)] transition hover:brightness-110 sm:bottom-12 sm:min-w-[260px] sm:px-12 sm:py-4 sm:text-5xl"
    >
      ENTER
    </Link>
  );
}
