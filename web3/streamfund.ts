import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { config } from "@/provider/SimpleProvider";
import { publicClient } from "./client";
import { TOKEN_ABI } from "@/constant/token-abi";

export const registerAsStreamer = async (address: Address) => {
  try {
    // console.log("Config", config);
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
