"use client";

import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { base, baseSepolia } from "@particle-network/connectkit/chains";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
const appId = process.env.NEXT_PUBLIC_APP_ID as string;

if (!projectId || !clientKey || !appId) {
  throw new Error("Please configure the Particle project in .env first!");
}

const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";
const currentChain: readonly [typeof base] | readonly [typeof baseSepolia] =
  NODE_ENV === "production" ? [base] : [baseSepolia];

export const getExplorer = () => {
  const chain = NODE_ENV === "production" ? base : baseSepolia;

  return {
    explorer: chain.blockExplorers.default.url,
    env: NODE_ENV,
  };
};

const config = createConfig({
  projectId,
  clientKey,
  appId,
  appearance: {
    recommendedWallets: [{ walletId: "metamask", label: "Recommended" }],
    language: "en-US", // Optional, also supported ja-JP, zh-CN, zh-TW, and ko-KR
    mode: "dark",
    filterCountryCallingCode: (countries) => {
      // Optional, whitelist or blacklist phone numbers from specific countries
      return countries.filter((item) => item === "US");
    },
  },
  walletConnectors: [
    evmWalletConnectors({
      metadata: {
        name: "StreamFund",
        icon:
          typeof window !== "undefined"
            ? `${window.location.origin}/favicon.ico`
            : "",
        description: "Particle Connectkit Next.js Scaffold.",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
      walletConnectProjectId: process.env
        .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    }),
    authWalletConnectors({
      authTypes: ["email", "google", "twitter", "github"], // Optional, restricts the types of social logins supported
    }),
  ],
  plugins: [
    wallet({
      entryPosition: EntryPosition.BR, // Alters the position in which the modal button appears upon login
      visible: true, // Dictates whether or not the wallet modal is included/visible or not
    }),
  ],
  chains: currentChain,
});

// Export ConnectKitProvider to be used within your index or layout file (or use createConfig directly within those files).
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
