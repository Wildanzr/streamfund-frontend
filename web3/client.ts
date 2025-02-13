import { createPublicClient, http } from "viem";
import { mantaSepoliaTestnet } from "viem/chains";
import { createConfig } from "wagmi";

// const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ENDPOINT = "https://pacific-rpc.sepolia-testnet.manta.network/http";

export const publicClient = createPublicClient({
  chain: mantaSepoliaTestnet,
  transport: http(ENDPOINT),
});

export const simpleConfig = createConfig({
  chains: [mantaSepoliaTestnet],
  transports: {
    [mantaSepoliaTestnet.id]: http(),
  },
});
