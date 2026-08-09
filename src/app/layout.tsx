import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Chill Bugs Museum",
  description:
    "Connect your wallet and hang your Chill Bugs on a personal museum wall — rarer bugs get bigger, glowing frames.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg font-sans text-fg">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
