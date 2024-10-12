import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { config } from "@/provider/SimpleProvider";
import { publicClient } from "./client";

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
