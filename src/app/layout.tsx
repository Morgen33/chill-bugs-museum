import type { Metadata, Viewport } from "next";
import { Bangers, Cormorant_Garamond, Figtree } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Chill Bugs",
  description:
    "Chill Bugs — a collection of curious bugs on Ethereum. Follow along on Twitter, OpenSea, and Discord.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${figtree.variable} ${bangers.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-wall-deep font-sans text-fg">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
