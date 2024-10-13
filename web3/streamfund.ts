import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { config } from "@/provider/SimpleProvider";
import { publicClient } from "./client";
import { TOKEN_ABI } from "@/constant/token-abi";

// WRITE FUNCTIONS
export const registerAsStreamer = async (address: Address) => {
  try {
    console.log("Address", address);
    const result = await writeContract(config, {
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "registerAsStreamer",
      account: address,
    });

    return result;
  } catch (error) {
    console.error("Error registering as a streamer:", error);
    return false;
  }
};

export const giveAllowance = async (user: Address, token: Address) => {
  const maxAmount = BigInt(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  );
  try {
    const result = await writeContract(config, {
      abi: TOKEN_ABI,
      address: token,
      functionName: "approve",
      args: [STREAMFUND_ADDRESS, maxAmount],
      account: user,
    });

    return result;
  } catch (error) {
    console.error("Error giving allowance:", error);
    return false;
  }
};

export const supportWithETH = async (
  amount: number,
  streamer: Address,
  message: string
) => {
  try {
    const result = await writeContract(config, {
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "supportWithETH",
      args: [streamer, message],
      value: BigInt(amount),
    });

    return result;
  } catch (error) {
    console.error("Error supporting with ETH:", error);
    return false;
  }
};

export const supportWithToken = async (
  amount: number,
  streamer: Address,
  token: Address,
  message: string
) => {
  try {
    const result = await writeContract(config, {
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "supportWithToken",
      args: [streamer, token, BigInt(amount), message],
    });

    return result;
  } catch (error) {
    console.error("Error supporting with token:", error);
    return false;
  }
};

// READ FUNCTIONS
export const readStreamer = async (address: Address) => {
  try {
    const result = await publicClient.readContract({
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "getStreamerDetails",
      args: [address],
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const readTokenBalance = async (address: Address, token: Address) => {
  try {
    const result = await publicClient.readContract({
      abi: TOKEN_ABI,
      address: token,
      functionName: "balanceOf",
      args: [address],
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const readAllowance = async (address: Address, token: Address) => {
  try {
    const result = await publicClient.readContract({
      abi: TOKEN_ABI,
      address: token,
      functionName: "allowance",
      args: [address, STREAMFUND_ADDRESS],
    });

    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const readAllowedTokenPrice = async (token: Address) => {
  try {
    const result = await publicClient.readContract({
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "getAllowedTokenPrice",
      args: [token],
    });

    const inUSD = Number(result[0]) / 10 ** (Number(result[1]) ?? 18);

    return inUSD;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
