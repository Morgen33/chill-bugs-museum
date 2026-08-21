import sharp from "sharp";

const FETCH_HEADERS = {
  Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8,*/*;q=0.5",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

function thumbUrl(url: string, width: number): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("seadn.io")) {
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fm", "jpg");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  async function run(): Promise<void> {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index]!, index);
    }
  }

  const runners = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => run(),
  );
  await Promise.all(runners);
  return results;
}

async function portraitDataUri(url: string, px: number): Promise<string | null> {
  try {
    const res = await fetch(thumbUrl(url, Math.max(px, 96)), {
      headers: FETCH_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const input = Buffer.from(await res.arrayBuffer());
    if (input.byteLength < 32) return null;

    const jpeg = await sharp(input)
      .rotate()
      .resize(px, px, { fit: "cover", position: "centre" })
      .jpeg({ quality: 76 })
      .toBuffer();

    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function loadPortraitDataUris(
  urls: string[],
  px: number,
): Promise<(string | null)[]> {
  return mapPool(urls, 16, async (url) => {
    if (!url) return null;
    return portraitDataUri(url, px);
  });
}
