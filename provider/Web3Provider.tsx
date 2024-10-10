"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  WagmiProvider,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [coinbaseWallet],
    },
    {
      groupName: "Popular",
      wallets: [rainbowWallet, metaMaskWallet],
    },
    {
      groupName: "Wallet Connect",
      wallets: [walletConnectWallet],
    },
  ],
  {
    appName: "Streamfund",
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  }
);

export function getConfig() {
  return createConfig({
    connectors,
    chains: [baseSepolia],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
    },
  });
}

const Web3Provider = ({ children }: ChildrenProps) => {
  const queryClient = new QueryClient();
  const config = getConfig();
  const customTheme = {
    colors: {
      accentColor: "hsl(191 91% 53%)",
      accentColorForeground: "hsl(225, 0%, 0%)",
      actionButtonBorder: "hsl(0, 0%, 100%)",
      actionButtonBorderMobile: "hsl(0, 0%, 100%)",
      actionButtonSecondaryBackground: "hsl(225, 0%, 0%)",
      closeButton: "hsl(180, 3%, 39%)",
      closeButtonBackground: "hsl(0, 0%, 94%)",
      connectButtonBackground: "hsl(0, 0%, 100%)",
      connectButtonBackgroundError: "hsl(360,100%,64%)",
      connectButtonInnerBackground: "hsl(0, 0%, 95%)",
      connectButtonText: "hsl(225, 0%, 0%)",
      connectButtonTextError: "hsl(0,0%,100%)",
      error: "hsl(0,0%,100%)",
      generalBorder: "hsl(180, 0%, 94%)",
      generalBorderDim: "rgba(0, 0, 0, 0.03)",
      menuItemBackground: "hsl(180, 3%, 92%)",
      modalBackdrop: "rgba(0, 0, 0, 0.5)",
      modalBackground: "hsl(0, 0%, 100%)",
      modalBorder: "hsl(0, 0%, 100%)",
      modalText: "hsl(213, 11%, 16%)",
      modalTextDim: "rgba(60, 66, 66, 0.3)",
      modalTextSecondary: "hsl(200, 1%, 55%)",
      profileAction: "hsl(0, 0%, 100%)",
      profileActionHover: "hsl(0, 0%, 98%)",
      profileForeground: "hsl(0, 0%, 96%)",
      selectedOptionBorder: "hsl(191 91% 53%)",
      downloadBottomCardBackground:
        '"linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF"',
      downloadTopCardBackground:
        '"linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF"',
      connectionIndicator: "hsl(107, 100%, 44%)",
      standby: "hsl(47, 100%, 63%)",
    },
    radii: {
      actionButton: "6px",
      connectButton: "3px",
      menuButton: "3px",
      modal: "6px",
      modalMobile: "6px",
    },
    shadows: {
      connectButton: "0px 8px 32px rgba(0, 0, 0, 0.32)",
      dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
      profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
      selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
      selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.12)",
      walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
    },
    blurs: {
      modalOverlay: "blur(0px)", // e.g. 'blur(4px)'
    },
    fonts: {
      body: "...", // default
    },
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

export default Web3Provider;
