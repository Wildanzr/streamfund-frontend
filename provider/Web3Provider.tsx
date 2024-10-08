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

const queryClient = new QueryClient();

const Web3Provider = ({ children }: ChildrenProps) => {
  const config = getConfig();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
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
