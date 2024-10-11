import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { Address } from "viem";
import { writeContract } from "@wagmi/core";
import { getConfig } from "@/provider/Web3Provider";

export const registerAsStreamer = async (address: Address) => {
  try {
    const config = getConfig();
    console.log("Config", config);
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
