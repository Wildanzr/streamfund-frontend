import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const ENDPOINT = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(ENDPOINT),
});
