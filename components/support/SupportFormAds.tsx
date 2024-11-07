"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBalance } from "wagmi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Loader from "../shared/Loader";
import { Address, formatEther, formatUnits } from "viem";
import { NATIVE_ADDRESS, STREAMFUND_ADDRESS } from "@/constant/common";
import { displayFormatter, stringToNumber } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useToast } from "@/hooks/use-toast";
import { useAccount, usePublicClient } from "@particle-network/connectkit";
import { useInterchain } from "@/hooks/use-interchain";
import { useKlaster } from "@/hooks/use-klaster";
import ToastTx from "../shared/ToastTx";
import { STREAMFUND_ABI } from "@/constant/streamfund-abi";

interface SupportFormAdsProps {
  streamer: string;
  tokens: Token[];
}

const formSchema = z.object({
  streamer: z.string(),
  token: z.string(),
  amount: z.string(),
  message: z.string(),
});

export default function SupportFormAds({
  tokens,
  streamer,
}: SupportFormAdsProps) {
  const publicClient = usePublicClient();
  const { status, address, chain, isConnected } = useAccount();
  const { unifiedBalances, unifiedNative, soc } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });
  const { toast } = useToast();
  const { supportWithEth, supportWithToken } = useInterchain();
  const { data } = useBalance({
    address: address as Address,
  });
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportState, setSupportState] = useState<"approve" | "support">(
    "approve"
  );
  const [tokenInfo, setTokenInfo] = useState({
    address: "",
    balance: 0,
    decimals: 0,
    symbol: "",
    allowance: 0,
    currentPrice: 0,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streamer,
      token: "",
      amount: "",
      message: "",
    },
  });

  const getTokenInfo = useCallback(
    (token: string) => {
      const result = tokens.find((t) => t.address === token);
      if (!result) return tokens[0];
      return result;
    },
    [tokens]
  );

  const readAllowedTokenPrice = useCallback(
    async (token: Address) => {
      const result = await publicClient?.readContract({
        abi: STREAMFUND_ABI,
        address: STREAMFUND_ADDRESS,
        functionName: "getAllowedTokenPrice",
        args: [token],
      });

      return result ? Number(result[0]) / 10 ** (Number(result[1]) ?? 18) : 0;
    },
    [publicClient]
  );

  const handleFetchingBalance = useCallback(
    async (token: string) => {
      if (!address) return;
      const parsedToken = token as Address;

      try {
        setIsFetchingBalance(true);
        const tokenDetail = getTokenInfo(token);
        const price = await readAllowedTokenPrice(parsedToken);

        if (token === NATIVE_ADDRESS) {
          setTokenInfo({
            address: NATIVE_ADDRESS,
            balance: Number(data?.value) ?? 0,
            decimals: tokenDetail.decimal ?? 18,
            symbol: tokenDetail.symbol ?? "ETH",
            allowance: 999999999,
            currentPrice: price,
          });
        } else {
          // NEED TO CHECK ALLOWANCE ON ERC-20?
          setTokenInfo({
            address: tokenDetail.address,
            balance: Number(data?.value) ?? 0,
            decimals: tokenDetail.decimal ?? 6,
            symbol: tokenDetail.symbol ?? "USDC",
            allowance: 999999999,
            currentPrice: price,
          });
        }

        setSupportState("support");
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingBalance(false);
        form.setValue("amount", "");
      }
    },
    [address, data?.value, form, getTokenInfo, readAllowedTokenPrice]
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!soc) return;
    const amountParsed =
      stringToNumber(values.amount) * 10 ** tokenInfo.decimals;
    const currentBalance =
      tokenInfo.symbol === "ETH"
        ? Number(unifiedNative[0].unified)
        : Number(unifiedBalances[0].unified.balance);

    if (amountParsed > currentBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to support",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let itxHash: string | undefined = undefined;
      if (tokenInfo.symbol === "ETH") {
        itxHash = await supportWithEth(
          streamer as Address,
          form.getValues("message"),
          BigInt(amountParsed)
        );
      } else {
        itxHash = await supportWithToken(
          unifiedBalances[0],
          streamer as Address,
          tokenInfo.address as Address,
          form.getValues("message"),
          BigInt(amountParsed)
        );
      }

      if (itxHash) {
        toast({
          title: "Interchain transaction submitted!",
          action: (
            <ToastTx
              explorerLink={`https://explorer.klaster.io/details`}
              explorerName="Klaster Explorer"
              txHash={itxHash as Address}
            />
          ),
        });
        form.reset();
        setTokenInfo({
          address: "",
          balance: 0,
          decimals: 0,
          symbol: "",
          allowance: 0,
          currentPrice: 0,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFetchingBalance(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token._id} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <div className="flex flex-row space-x-2">
                  <p className="text-sm text-white/80">Available:</p>

                  {tokenInfo.symbol === "ETH" ? (
                    unifiedNative[0] ? (
                      <div>
                        {parseFloat(
                          formatEther(unifiedNative[0].unified)
                        ).toFixed(3)}{" "}
                        {unifiedNative[0].symbol}
                      </div>
                    ) : (
                      <Loader />
                    )
                  ) : unifiedBalances[0] ? (
                    <div>
                      {parseFloat(
                        formatUnits(
                          unifiedBalances[0].unified.balance,
                          unifiedBalances[0].unified.decimals
                        )
                      ).toFixed(3)}{" "}
                      {unifiedBalances[0].symbol}
                    </div>
                  ) : (
                    <Loader />
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (Minimum: $15)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.000001}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  disabled={
                    isFetchingBalance || isSubmitting || !tokenInfo.address
                  }
                />
              </FormControl>
              {field.value && (
                <div className="flex flex-row space-x-2">
                  <p className="text-sm text-white/80">Equivalent:</p>
                  {isFetchingBalance ? (
                    <Loader size="20" />
                  ) : (
                    <div className="flex flex-row space-x-2 items-start justify-start">
                      <p className="text-sm text-white/80">
                        {displayFormatter(
                          2,
                          tokenInfo.currentPrice * +field.value
                        )}{" "}
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon
                              className="text-aqua cursor-pointer"
                              size="20"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex w-full h-full bg-aqua p-3 rounded-md">
                              <p className="text-black text-xs">
                                This price is based on the current market price
                                and may vary.
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ads Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leave a message or question to your favorite streamer"
                  {...field}
                  disabled={
                    isFetchingBalance || isSubmitting || !tokenInfo.address
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full bg-aqua text-black"
          type={"submit"}
          variant="secondary"
          disabled={
            isFetchingBalance ||
            isSubmitting ||
            !tokenInfo.address ||
            form.watch("amount") === ""
          }
        >
          {isSubmitting ? (
            <Loader size="20" />
          ) : (
            <p className="mx-2">
              {supportState === "approve" ? "Approve" : "Support Now"}
            </p>
          )}
        </Button>
      </form>
    </Form>
  );
}
