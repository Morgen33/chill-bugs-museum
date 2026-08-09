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

const museumTheme = darkTheme({
  accentColor: "#c4a46a",
  accentColorForeground: "#1c1a17",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
});

museumTheme.colors.modalBackground = "#1c1a17";
museumTheme.colors.modalBorder = "rgba(196,164,106,0.22)";
museumTheme.colors.profileForeground = "#2a2722";
museumTheme.colors.closeButtonBackground = "#242119";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={museumTheme} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
