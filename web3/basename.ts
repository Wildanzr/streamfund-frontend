import { base } from "viem/chains";
import L2ResolverAbi from "@/constant/basenames-abi";
import { encodePacked, keccak256, namehash } from "viem";
import type { Address } from "viem";
import { mainnet } from "viem/chains";
import { BASENAMES_ADDRESS } from "@/constant/common";
import { publicClient } from "./client";

/**
 * Convert an chainId to a coinType hex for reverse chain resolution
 */
export const convertChainIdToCoinType = (chainId: number): string => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return "addr";
  }

  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

/**
 * Convert an address to a reverse node for ENS resolution
 */
export const convertReverseNodeToBytes = (
  address: Address,
  chainId: number
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`
  );
  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
  return addressReverseNode;
};

// Function to resolve a Basename
export async function getBasename(address: Address) {
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    const basename = await publicClient.readContract({
      abi: L2ResolverAbi,
      address: BASENAMES_ADDRESS,
      functionName: "name",
      args: [addressReverseNode],
    });
    if (basename) {
      return basename;
    }
  } catch (error) {
    // Handle the error accordingly
    console.error("Error resolving Basename:", error);
  }
}
