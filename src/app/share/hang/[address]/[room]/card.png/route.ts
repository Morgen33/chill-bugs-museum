import { renderWallOgImage } from "@/lib/og-wall-image";

export const runtime = "nodejs";
export const maxDuration = 60;
export const revalidate = 86400;

type CardRouteProps = {
  params: Promise<{ address: string; room: string }>;
};

export async function GET(_request: Request, { params }: CardRouteProps) {
  return renderWallOgImage({ params });
}
