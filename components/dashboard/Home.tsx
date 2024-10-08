"use client";

import { useAccount } from "wagmi";
import { Basenames } from "../shared/Basenames";

export default function Home() {
  const account = useAccount();

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px] text-white">
      <section className="mb-6 mt-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-3">
            {account.status === "connected" && (
              <div>
                <Basenames address={account.addresses?.[0]} />
              </div>
            )}
            {/* <h1>{result}</h1> */}
          </div>
        </div>
      </section>
    </div>
  );
}
