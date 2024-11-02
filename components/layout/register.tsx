"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import useWaitForTxAction from "@/hooks/use-wait-for-tx";
import { Address } from "viem";
import Loader from "../shared/Loader";
import { useToast } from "@/hooks/use-toast";
// import { getExplorer } from "@/lib/utils";

const Register = () => {
  // const etherscan = getExplorer();
  const { address } = useAccount();
  const { toast } = useToast();
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

  useWaitForTxAction({
    txHash,
    action: handlePostAction,
  });

  const handleRegister = async () => {
    if (!address) return;
    setIsRegistering(true);
    try {
      console.log("Registering as streamer");
      // const result = await registerAsStreamer(address);
      // console.log("Result", result);
      // if (result === false) return;
      // setTxHash(result);
      // toast({
      //   title: "Transaction submitted",
      //   action: (
      //     <ToastTx
      //       explorerLink={etherscan.url}
      //       explorerName={etherscan.name}
      //       txHash={txHash}
      //     />
      //   ),
      // });
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
        className="flex bg-aqua font-play font-bold text-2xl text-midnight hover:bg-aqua/80"
      >
        {isRegistering ? <Loader /> : "Register Now"}
      </Button>
    </div>
  );
};

export default Register;
