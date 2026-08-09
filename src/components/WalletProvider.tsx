"use client";

import { RainbowKitProvider, darkTheme, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "chill-bugs-museum-dev";

const config = getDefaultConfig({
  appName: "Chill Bugs Museum",
  projectId,
  chains: [mainnet],
  ssr: true,
});

const limeTheme = darkTheme({
  accentColor: "#b6ff3c",
  accentColorForeground: "#0a0a0a",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

limeTheme.colors.modalBackground = "#121212";
limeTheme.colors.modalBorder = "rgba(255,255,255,0.08)";
limeTheme.colors.profileForeground = "#161616";
limeTheme.colors.closeButtonBackground = "#1a1a1a";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={limeTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
