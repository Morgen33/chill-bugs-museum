import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchBugByTokenId } from "@/lib/opensea";
import { formatPercentile, tierLabel } from "@/lib/rarity";
import { bugShareText } from "@/lib/share";

type SharePageProps = {
  params: Promise<{ tokenId: string }>;
};

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { tokenId } = await params;
  const bug = await fetchBugByTokenId(tokenId);
  if (!bug) {
    return { title: "Chill Bugs Museum" };
  }

  return {
    title: `${bug.name} · Chill Bugs Museum`,
    description: bugShareText(bug),
    openGraph: {
      title: bug.name,
      description: bugShareText(bug),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: bug.name,
      description: bugShareText(bug),
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { tokenId } = await params;
  const bug = await fetchBugByTokenId(tokenId);
  if (!bug) notFound();

  const { tier, percentile, rank, rarityAvailable } = bug.rarity;

  return (
    <main className="flex min-h-screen flex-col bg-wall-deep text-fg">
      <header className="border-b border-border/50 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-fg transition hover:text-gilt"
        >
          Chill Bugs Museum
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-8 px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <div className="ornate-frame frame-lightbox">
            <span aria-hidden className="frame-corner frame-corner--tl" />
            <span aria-hidden className="frame-corner frame-corner--tr" />
            <span aria-hidden className="frame-corner frame-corner--bl" />
            <span aria-hidden className="frame-corner frame-corner--br" />
            <div className="ornate-frame__mat">
              <div className="relative aspect-square overflow-hidden bg-wall-deep">
                {bug.imageUrl ? (
                  <Image
                    src={bug.imageUrl}
                    alt={bug.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 420px"
                    unoptimized
                    priority
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="font-serif text-sm tracking-[0.22em] text-gilt uppercase">
            {tierLabel(tier)}
            {rarityAvailable ? ` · ${formatPercentile(percentile)}` : ""}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {bug.name}
          </h1>
          {rarityAvailable && rank != null ? (
            <p className="mt-2 text-sm text-fg-muted">
              Rank #{rank}
              {bug.rarity.tokensScored ? ` / ${bug.rarity.tokensScored}` : ""}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-brass px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-wall-deep uppercase transition hover:bg-gilt"
          >
            Home
          </Link>
          <a
            href={bug.openseaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-border-strong px-5 py-2.5 text-sm font-semibold tracking-[0.12em] text-fg uppercase transition hover:border-gilt hover:text-gilt"
          >
            View on OpenSea
          </a>
        </div>
      </section>
    </main>
  );
}
