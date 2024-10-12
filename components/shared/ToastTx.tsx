import React from "react";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { Address } from "viem";

interface ToastTransactionProps {
  txHash: Address | undefined;
  explorerName: string;
  explorerLink: string;
}

const ToastTx = ({
  explorerLink,
  explorerName,
  txHash,
}: ToastTransactionProps) => {
  return (
    <ToastAction
      altText={`View on ${explorerName}`}
      className="bg-transparent border border-aqua"
    >
      <Link
        href={`${explorerLink}/tx/${txHash}`}
        passHref
        className="underline"
        target="_blank"
      >
        {" "}
        View on {explorerName}{" "}
      </Link>
    </ToastAction>
  );
};

export default ToastTx;
