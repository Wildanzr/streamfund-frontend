import { TOKEN_ABI } from "@/constant/token-abi";
import axios from "axios";
import { BridgePlugin, BridgePluginParams, rawTx } from "klaster-sdk";
import { Address, encodeFunctionData, parseAbi } from "viem";

interface FeeObject {
  pct: string;
  total: string;
}

interface Limits {
  minDeposit: string;
  maxDeposit: string;
  maxDepositInstant: string;
  maxDepositShortDelay: string;
  recommendedDepositInstant: string;
}

interface RelayFeeResponse {
  estimatedFillTimeSec: number;
  capitalFeePct: string;
  capitalFeeTotal: string;
  relayGasFeePct: string;
  relayGasFeeTotal: string;
  relayFeePct: string;
  relayFeeTotal: string;
  lpFeePct: string;
  timestamp: string;
  isAmountTooLow: boolean;
  quoteBlock: string;
  exclusiveRelayer: Address;
  exclusivityDeadline: string;
  spokePoolAddress: Address;
  totalRelayFee: FeeObject;
  relayerCapitalFee: FeeObject;
  relayerGasFee: FeeObject;
  lpFee: FeeObject;
  limits: Limits;
}

const getSuggestedFee = async (data: BridgePluginParams) => {
  console.log("Data", data);
  const client = axios.create({
    baseURL: "https://testnet.across.to/api/",
  });

  console.log("Data", data);
  const res = await client.get<RelayFeeResponse>(
    `suggested-fees?inputToken=${data.sourceToken}&outputToken=${data.destinationToken}&
    originChainId=${data.sourceChainId}&destinationChainId=${data.destinationChainId}&amount=${data.amount}`
  );

  return res.data;
};

const encodeApproveTx = (
  tokenAddress: Address,
  amount: bigint,
  recipient: Address
) => {
  const tx = rawTx({
    gasLimit: BigInt(100000),
    to: tokenAddress,
    data: encodeFunctionData({
      abi: TOKEN_ABI,
      functionName: "approve",
      args: [recipient, amount],
    }),
  });

  return tx;
};

const encodeCallData = (data: BridgePluginParams, fees: RelayFeeResponse) => {
  const abi = parseAbi([
    "function depositV3(address depositor, address recipient, address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, address exclusiveRelayer, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, bytes calldata message) external",
  ]);
  const outputAmount = data.amount - BigInt(fees.totalRelayFee.total);
  const fillDeadline = Math.round(Date.now() / 1000) + 500;

  const [srcAddress, destAddress] = data.account.getAddresses([
    data.sourceChainId,
    data.destinationChainId,
  ]);
  if (!srcAddress || !destAddress) {
    throw Error(
      `Can't fetch address from multichain account for ${data.sourceChainId} or ${data.destinationChainId}`
    );
  }

  return encodeFunctionData({
    abi: abi,
    functionName: "depositV3",
    args: [
      srcAddress,
      destAddress,
      data.sourceToken,
      data.destinationToken,
      data.amount,
      outputAmount,
      BigInt(data.destinationChainId),
      fees.exclusiveRelayer,
      parseInt(fees.timestamp),
      fillDeadline,
      parseInt(fees.exclusivityDeadline),
      "0x",
    ],
  });
};

export const acrossBridgePlugin: BridgePlugin = async (data) => {
  const feesResponse = await getSuggestedFee(data);
  const outputAmount = data.amount - BigInt(feesResponse.totalRelayFee.total);

  const acrossApproveTx = encodeApproveTx(
    data.sourceToken,
    outputAmount,
    feesResponse.spokePoolAddress
  );

  // Call across pool to initiate bridging
  const acrossCallTx = rawTx({
    to: feesResponse.spokePoolAddress,
    data: encodeCallData(data, feesResponse),
    gasLimit: BigInt(250000),
  });

  return {
    receivedOnDestination: outputAmount,
    txBatch: {
      txs: [acrossApproveTx, acrossCallTx],
      chainId: data.sourceChainId,
    },
  };
};
