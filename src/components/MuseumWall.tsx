"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { ChillBug } from "@/lib/types";
import {
  hangLayout,
  OPENSEA_COLLECTION_URL,
  WALL_COLUMNS,
  WALL_PAGE_SIZE,
} from "@/lib/constants";
import { BugFrame } from "./BugFrame";
import { BugLightbox } from "./BugLightbox";
import { ShareWallToX } from "./ShareToX";

type MuseumWallProps = {
  bugs: ChillBug[];
  loading: boolean;
  error: string | null;
  address: string;
};

function TrackRail() {
  return (
    <div className="gallery-lighting mt-3 sm:mt-5" aria-hidden>
      <div className="gallery-washes">
        {Array.from({ length: WALL_COLUMNS }).map((_, i) => (
          <span key={i} className="gallery-wash">
            <span className="gallery-wash__beams">
              <span className="gallery-wash__beam" />
              <span className="gallery-wash__core" />
            </span>
            <span className="gallery-wash__pool" />
          </span>
        ))}
      </div>
      <div className="gallery-hardware">
        <div className="gallery-track" />
        <div className="gallery-fixtures">
          {Array.from({ length: WALL_COLUMNS }).map((_, i) => (
            <span key={i} className="gallery-fixture">
              <span className="gallery-fixture__clip" />
              <span className="gallery-fixture__can" />
              <span className="gallery-fixture__glow" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryShell({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="gallery-wall relative flex min-h-0 flex-1 flex-col px-4 pb-6 sm:px-10 sm:pb-8">
        <TrackRail />
        {children}
      </div>
      <div className="gallery-baseboard" aria-hidden />
    </section>
  );
}

function HangGrid({
  cols,
  rows,
  children,
}: {
  cols: number;
  rows: number;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cell, setCell] = useState(320);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const gap = Math.min(28, Math.max(14, stage.clientWidth * 0.018));
      const maxFrame = Math.min(
        420,
        Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.52),
      );
      const stageW = Math.max(stage.clientWidth, 160);
      const stageH =
        stage.clientHeight > 160
          ? stage.clientHeight
          : window.innerHeight * 0.5;
      const cellW = (stageW - (cols - 1) * gap) / cols;
      const cellH = (stageH - (rows - 1) * gap) / rows;
      const minCell = cols <= 2 && rows <= 2 ? 240 : 64;
      const fitted = Math.min(maxFrame, cellW, cellH);
      setCell(Math.floor(Math.max(minCell, fitted > 1 ? fitted : minCell)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [cols, rows]);

  return (
    <div
      ref={stageRef}
      className="hang-stage relative mx-auto w-full max-w-[86rem]"
    >
      <div
        className="gallery-hang"
        style={{ "--cell": `${cell}px` } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

function useMaxHangCols() {
  const [maxCols, setMaxCols] = useState(WALL_COLUMNS);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setMaxCols(mq.matches ? 4 : WALL_COLUMNS);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return maxCols;
}

export function MuseumWall({ bugs, loading, error, address }: MuseumWallProps) {
  const [selected, setSelected] = useState<ChillBug | null>(null);
  const [page, setPage] = useState(0);
  const maxCols = useMaxHangCols();

  const pageCount = Math.max(1, Math.ceil(bugs.length / WALL_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);

  const pageBugs = useMemo(() => {
    const start = safePage * WALL_PAGE_SIZE;
    return bugs.slice(start, start + WALL_PAGE_SIZE);
  }, [bugs, safePage]);

  const layout = useMemo(
    () => hangLayout(pageBugs.length || 1, maxCols),
    [pageBugs.length, maxCols],
  );

  useEffect(() => {
    setPage(0);
  }, [address, bugs.length]);

  useEffect(() => {
    if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  useEffect(() => {
    if (bugs.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (selected) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPage((p) => Math.max(0, p - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPage((p) => Math.min(pageCount - 1, p + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bugs.length, pageCount, selected]);

  if (loading) {
    const loadingLayout = hangLayout(4, maxCols);
    return (
      <GalleryShell>
        <div className="relative mt-6 mb-4 text-center sm:mt-8">
          <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
            Curating your wing
          </p>
        </div>
        <HangGrid cols={loadingLayout.cols} rows={loadingLayout.rows}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="wood-frame animate-pulse">
              <div className="wood-frame__mat">
                <div className="aspect-square bg-[#d8d0c4]" />
              </div>
            </div>
          ))}
        </HangGrid>
      </GalleryShell>
    );
  }

  if (error) {
    return (
      <GalleryShell>
        <div className="relative z-10 mx-auto flex max-w-xl flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
            Museum notice
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
            Couldn’t load the wall
          </h2>
          <p className="mt-4 text-fg-muted">{error}</p>
        </div>
      </GalleryShell>
    );
  }

  if (bugs.length === 0) {
    return (
      <GalleryShell>
        <div className="relative z-10 mx-auto flex max-w-xl flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="font-serif text-sm tracking-[0.28em] text-gilt uppercase">
            Empty wing
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            No Chill Bugs in this wallet
          </h2>
          <p className="mt-4 text-fg-muted">
            Visit OpenSea, acquire a bug, then return to hang it in your private
            gallery.
          </p>
          <a
            href={OPENSEA_COLLECTION_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex bg-brass px-7 py-3 text-sm font-semibold tracking-[0.14em] text-white uppercase transition hover:bg-gilt"
          >
            Browse Chill Bugs
          </a>
        </div>
      </GalleryShell>
    );
  }

  return (
    <GalleryShell>
      <HangGrid cols={layout.cols} rows={layout.rows}>
        {pageBugs.map((bug, index) => (
          <BugFrame
            key={bug.tokenId}
            bug={bug}
            index={index}
            onSelect={setSelected}
          />
        ))}
      </HangGrid>

      <div className="relative z-10 mt-5 flex justify-center">
        <ShareWallToX
          address={address}
          count={pageBugs.length}
          room={safePage + 1}
        />
      </div>

      {pageCount > 1 ? (
        <nav
          className="relative mt-5 flex items-center justify-center gap-4 sm:gap-6"
          aria-label="Gallery pages"
        >
          <button
            type="button"
            className="gallery-page-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage <= 0}
            aria-label="Previous page"
          >
            ←
          </button>
          <p className="min-w-[8rem] text-center font-serif text-lg tracking-[0.12em] text-gilt sm:text-xl">
            Room {safePage + 1}
            <span className="text-fg-muted"> / {pageCount}</span>
          </p>
          <button
            type="button"
            className="gallery-page-btn"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            aria-label="Next page"
          >
            →
          </button>
        </nav>
      ) : null}

      <BugLightbox bug={selected} onClose={() => setSelected(null)} />
    </GalleryShell>
  );
}
