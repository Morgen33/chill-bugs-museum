import type { Metadata } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chill Bugs",
  description:
    "Chill Bugs — a collection of curious bugs on Ethereum. Follow along on Twitter, OpenSea, and Discord.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-wall-deep font-sans text-fg">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
