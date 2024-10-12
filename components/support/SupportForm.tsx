"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAccount } from "wagmi";
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

const quickSupportOptions = [1, 1.5, 3, 5, 10];

interface SupportFormProps {
  streamer: string;
  tokens: Token[];
}

const formSchema = z.object({
  streamer: z.string(),
  token: z.string(),
  amount: z.string(),
  message: z.string(),
});

export default function SupportForm({ tokens, streamer }: SupportFormProps) {
  const { address } = useAccount();
  const [quickAmount, setQuickAmount] = useState(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [tokenInfo, setTokenInfo] = useState({
    address: "",
    balance: 0,
    decimals: 0,
    symbol: "",
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

  const hanldeFetchingBalance = async (token: string) => {
    if (!address) return;

    try {
      setIsFetchingBalance(true);
      console.log("Fetching balance for token:", token);
      await new Promise((resolve) => setTimeout(resolve, 4000));
      setTokenInfo({
        ...tokenInfo,
        balance: 112.7,
        symbol: "USDC",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingBalance(false);
    }
  };

  const handleQuickSupport = (value: number) => {
    setQuickAmount(value);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!address) return;

    try {
      console.log("Support submitted:", values);
    } catch (error) {
      console.error(error);
    } finally {
      // Removed isSubmitting state
      console.log("done");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md mx-auto bg-transparent text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Support your favorite Streamer!
            </CardTitle>
            <CardDescription className="text-center text-white/80">
              <span>{streamer}</span>
              <span>is waiting for your support</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      hanldeFetchingBalance(value);
                    }}
                    defaultValue={field.value}
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
                      {isFetchingBalance ? (
                        <Loader size="20" />
                      ) : (
                        <p className="text-sm text-white/80">
                          {tokenInfo.balance} ${tokenInfo.symbol}
                        </p>
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
                {quickSupportOptions.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="sm"
                    type="button"
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
                    <Input type="number" step={0.000001} {...field} />
                  </FormControl>
                  {field.value && (
                    <div className="flex flex-row space-x-2">
                      <p className="text-sm text-white/80">Equivalent:</p>
                      <p className="text-sm text-white/80">$10.2</p>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-aqua text-black" type="submit">
              Support now
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
