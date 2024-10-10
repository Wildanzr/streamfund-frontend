import React from "react";
import RunningForm from "../running/RunningForm";

const Unauthenticated = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <h3>Connect your wallet to access the platform</h3>

      <RunningForm
        address="0x"
        streamkey="0x"
        config={{
          backgroundColor: "#000000",
          borderColor: "#ffffff",
          font: "monospace",
          text: "This is simple marquee",
          textColor: "#ffffff",
          textSize: "20",
          streamer: {
            _id: "0x",
            address: "0x",
          },
        }}
      />
    </div>
  );
};

export default Unauthenticated;
