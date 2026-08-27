import Image from "next/image";
import Link from "next/link";

export function EnterHome() {
  return (
    <Link
      href="/home"
      className="enter-home absolute bottom-8 left-1/2 z-20 flex w-[min(70vw,260px)] -translate-x-1/2 flex-col items-center sm:bottom-12 sm:w-[300px]"
      aria-label="Press here to enter Chill Bugs"
    >
      <Image
        src="/logo.png"
        alt=""
        width={512}
        height={512}
        priority
        className="h-auto w-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.55)]"
      />
      <span className="mt-1 rotate-[-4deg] font-[family-name:var(--font-bangers)] text-4xl leading-none tracking-wide text-[#f5ff4a] drop-shadow-[0_3px_0_#111] sm:text-5xl">
        PRESS HERE
      </span>
    </Link>
  );
}
