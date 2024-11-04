"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { Address } from "viem";
import Loader from "../shared/Loader";
import { useToast } from "@/hooks/use-toast";
import ToastTx from "../shared/ToastTx";
import { getExplorer } from "@/lib/utils";
import { useInterchain } from "@/hooks/use-interchain";

const Register = () => {
  const etherscan = getExplorer();
  const { address } = useAccount();
  const { toast } = useToast();
  const { registerAsStreamer } = useInterchain();
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState<Address | undefined>();
  const RELOAD_TIME = 10 * 1000; // 10 seconds

  const handlePostAction = () => {
    toast({
      title: "Transaction confirmed",
      description: "Please wait for your profile to be created",
      variant: "success",
    });

    setTxHash(undefined);
    setTimeout(() => {
      window.location.reload();
    }, RELOAD_TIME);
  };

  const handleRegister = async () => {
    if (!address) return;
    setIsRegistering(true);
    try {
      console.log("Registering as streamer");
      const result = await registerAsStreamer();
      console.log("Result", result);
      if (result === false) return;
      if (!result) {
        toast({
          title: "Transaction failed",
          description: "Failed to register as a streamer",
          variant: "destructive",
        });
        return;
      }
      setTxHash(result as Address);
      toast({
        title: "Transaction submitted",
        action: (
          <ToastTx
            explorerLink={etherscan.url}
            explorerName={etherscan.name}
            txHash={txHash}
          />
        ),
      });

      // wait for 30 seconds for the transaction to be confirmed
      await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
      handlePostAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction failed",
        description: "Failed to register as a streamer",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center space-y-4">
      <h3 className="font-play text-3xl font-bold">
        Are you ready to start your journey with StreamFund? Register now!
      </h3>
      <Button
        onClick={handleRegister}
        disabled={isRegistering}
        className="flex bg-aqua font-play font-bold text-xl p-6 text-midnight hover:bg-aqua/80"
      >
        {isRegistering ? <Loader /> : "Register Now"}
      </Button>
    </div>
  );
};

export default Register;
