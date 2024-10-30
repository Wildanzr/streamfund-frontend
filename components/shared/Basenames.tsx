"use client";

import React from "react";
import { Identity, Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

interface DisplayBasenameProps {
  address: `0x${string}` | undefined;
  color?: string;
}

export function Basenames({ address, color }: DisplayBasenameProps) {
  return (
    <Identity
      address={address}
      chain={{
        id: base.id,
        name: base.name,
        nativeCurrency: {
          name: base.nativeCurrency.name,
          symbol: base.nativeCurrency.symbol,
          decimals: base.nativeCurrency.decimals,
        },
        rpcUrls: base.rpcUrls,
      }}
      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
    >
      <Name
        address={address}
        chain={{
          id: base.id,
          name: base.name,
          nativeCurrency: {
            name: base.nativeCurrency.name,
            symbol: base.nativeCurrency.symbol,
            decimals: base.nativeCurrency.decimals,
          },
          rpcUrls: base.rpcUrls,
        }}
        className="font-play text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        style={color ? { color } : {}}
      />
    </Identity>
  );
}
