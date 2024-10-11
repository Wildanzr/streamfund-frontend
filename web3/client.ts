import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { createConfig } from "wagmi";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ENDPOINT = `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(ENDPOINT),
});

export const simpleConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
