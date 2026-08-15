import { wallShareToXUrl } from "@/lib/share";

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

export function ShareWallToX({ address, count, room }: ShareWallToXProps) {
  return (
    <a
      href={wallShareToXUrl(address, count, room)}
      target="_blank"
      rel="noopener noreferrer"
      className="relative z-10 inline-flex items-center justify-center gap-2 bg-brass px-5 py-2.5 text-sm font-semibold tracking-[0.14em] text-wall-deep uppercase transition hover:bg-gilt"
      aria-label="Share wall to X"
    >
      <XLogo />
      SHARE TO X
    </a>
  );
}
