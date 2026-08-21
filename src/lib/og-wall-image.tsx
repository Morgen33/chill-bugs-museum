import { ImageResponse } from "next/og";
import { hangLayout } from "@/lib/constants";
import { loadPortraitDataUris } from "@/lib/og-portraits";
import { loadWallShare, parseWallRoom } from "@/lib/wall-share";

export const size = { width: 1200, height: 630 };

type OgImageProps = {
  params: Promise<{ address: string; room: string }>;
};

export async function renderWallOgImage({ params }: OgImageProps) {
  const { address, room: roomParam } = await params;
  const room = parseWallRoom(roomParam);
  const wall = room ? await loadWallShare(address, room) : null;
  const bugs = wall?.bugs ?? [];
  const layout = hangLayout(Math.max(bugs.length, 1));
  const pad = 40;
  const titleH = 58;
  const gap = bugs.length <= 4 ? 18 : 10;
  const availW = size.width - pad * 2;
  const availH = size.height - pad - titleH;
  const cell = Math.max(
    48,
    Math.floor(
      Math.min(
        (availW - gap * (layout.cols - 1)) / layout.cols,
        (availH - gap * (layout.rows - 1)) / layout.rows,
      ),
    ),
  );
  const gridW = layout.cols * cell + (layout.cols - 1) * gap;
  const framePad = Math.max(4, Math.round(cell * 0.06));
  const matPad = Math.max(6, Math.round(cell * 0.1));
  const picture = Math.max(24, cell - framePad * 2 - matPad * 2);
  const portraits = await loadPortraitDataUris(
    bugs.map((bug) => bug.imageUrl),
    picture,
  );
  const label =
    bugs.length === 1
      ? "1 Chill Bug on the wall"
      : `${bugs.length} Chill Bugs on the wall`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #e4ddd2 0%, #d9d2c6 42%, #d0c8ba 100%)",
          color: "#2c2823",
        }}
      >
        <div
          style={{
            display: "flex",
            height: titleH,
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 4,
              color: "#8a6d3d",
              textTransform: "uppercase",
            }}
          >
            Chill Bugs Museum
          </div>
          <div style={{ display: "flex", fontSize: 20, color: "#6f675c" }}>
            {label}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: gridW,
              gap,
              justifyContent: "center",
            }}
          >
            {bugs.map((bug, index) => (
              <div
                key={bug.tokenId}
                style={{
                  display: "flex",
                  width: cell,
                  height: cell,
                  padding: framePad,
                  background:
                    "linear-gradient(145deg, #ead9b4 0%, #c4a56a 28%, #a68548 52%, #e0c898 78%, #b8955c 100%)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    padding: matPad,
                    background: "#f3eee6",
                  }}
                >
                  {portraits[index] ? (
                    <img
                      src={portraits[index]!}
                      alt=""
                      width={picture}
                      height={picture}
                      style={{
                        objectFit: "cover",
                        width: picture,
                        height: picture,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        width: picture,
                        height: picture,
                        background: "#ddd6ca",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
