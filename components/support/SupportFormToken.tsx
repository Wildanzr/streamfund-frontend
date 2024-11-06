"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Address, formatEther, parseEther, parseUnits } from "viem";
import {
  NATIVE_ADDRESS,
  STREAMFUND_ADDRESS,
  SUPPORT_OPTIONS,
  UNIFIED_USDC,
} from "@/constant/common";
import { displayFormatter, getExplorer, trimAddress } from "@/lib/utils";
import { InfoIcon, Link } from "lucide-react";
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
import { Separator } from "../ui/separator";

interface SupportFormTokenProps {
  streamer: string;
  tokens: Token[];
}

const formSchema = z.object({
  streamer: z.string(),
  token: z.string(),
  amount: z.string(),
  message: z.string(),
});

export default function SupportFormToken({
  tokens,
  streamer,
}: SupportFormTokenProps) {
  const etherscan = getExplorer();
  const publicClient = usePublicClient();
  const { status, address, chain, isConnected } = useAccount();
  const { unifiedBalances, unifiedNative } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });
  const { toast } = useToast();
  const { supportWithEth, supportWithToken } = useInterchain();
  const { data, refetch } = useBalance({
    address: address as Address,
  });
  const [quickAmount, setQuickAmount] = useState(0);
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

  const readAllowedTokenPrice = async (token: Address) => {
    const result = await publicClient?.readContract({
      abi: STREAMFUND_ABI,
      address: STREAMFUND_ADDRESS,
      functionName: "getAllowedTokenPrice",
      args: [token],
    });

    return result ? Number(result[0]) / 10 ** (Number(result[1]) ?? 18) : 0;
  };

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
          setSupportState("support");
        }

        // else {
        //   const tokenDetail = getTokenInfo(token);
        //   const [balance, allowance] = await Promise.all([
        //     readTokenBalance(address as Address, parsedToken),
        //     readAllowance(address as Address, parsedToken),
        //   ]);
        //   setTokenInfo({
        //     address: parsedToken,
        //     balance: Number(balance) ?? 0,
        //     decimals: tokenDetail.decimal,
        //     symbol: tokenDetail.symbol,
        //     allowance: Number(allowance) ?? 0,
        //     currentPrice: price,
        //   });
        //   if (Number(allowance) === 0) {
        //     setSupportState("approve");
        //   } else {
        //     setSupportState("support");
        //   }
        // }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingBalance(false);
        form.setValue("amount", "");
        setQuickAmount(0);
      }
    },
    [address, data?.value, form, getTokenInfo, refetch]
  );

  const handleQuickSupport = useCallback(
    (value: number) => {
      setQuickAmount(value);
      const amountToBe = (value / tokenInfo.currentPrice).toFixed(
        tokenInfo.decimals
      );
      form.setValue("amount", amountToBe, { shouldValidate: true });
    },
    [form, tokenInfo.currentPrice, tokenInfo.decimals]
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!address || !unifiedNative[0]) return;
    const amountParsed = Number(values.amount);

    // // SUPPORT WITH NATIVE TOKEN
    if (tokenInfo.symbol === "ETH") {
      if (amountParsed > Number(formatEther(unifiedNative[0].unified))) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough balance to support",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsSubmitting(true);
        const itxHash = await supportWithEth(
          streamer as Address,
          form.getValues("message"),
          parseEther(form.getValues("amount"))
        );

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
        setQuickAmount(0);
        setTokenInfo({
          address: "",
          balance: 0,
          decimals: 0,
          symbol: "",
          allowance: 0,
          currentPrice: 0,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    }

    // SUPORT WITH ERC20 TOKEN
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
                    unifiedNative[0] && (
                      <div>
                        {parseFloat(
                          formatEther(unifiedNative[0].unified)
                        ).toFixed(3)}{" "}
                        {unifiedNative[0].symbol}
                      </div>
                    )
                  ) : (
                    <Loader size="20" />
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label>Quick support</Label>
          <div className="grid grid-cols-5 gap-5">
            {SUPPORT_OPTIONS.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                type="button"
                disabled={
                  isFetchingBalance || isSubmitting || !tokenInfo.address
                }
                className={`bg-transparent hover:bg-white/10 text-white hover:text-white ${
                  quickAmount === option ? "border border-aqua" : ""
                }`}
                value={option}
                onClick={() => handleQuickSupport(option)}
              >
                ${option}
              </Button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.000001}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setQuickAmount(0);
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
              <FormLabel>Message</FormLabel>
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

        <Button
          type="button"
          onClick={() =>
            supportWithToken(
              unifiedBalances[0],
              streamer as Address,
              UNIFIED_USDC[0].address as Address,
              "GMMM Mann",
              parseUnits("10", UNIFIED_USDC[0].decimal)
            )
          }
        >
          TEST KLASTER
        </Button>

        <div className="flex flex-col space-y-2 w-full h-full items-center justify-center">
          <Separator />
          <h3 className="text-white/80 text-base text-center">
            Need token? Mint here!
          </h3>
          {tokens.slice(1).map((token) => (
            <Link
              href={`${etherscan.url}/address/${token.address}`}
              key={token._id}
            >
              {token.symbol} - {trimAddress(token.address)}
            </Link>
          ))}
        </div>
      </form>
    </Form>
  );
}
