import React from "react";
import AlertForm from "../alert/AlertForm";

const Unauthenticated = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <h3>Connect your wallet to access the platform</h3>
      <AlertForm
        address="0x"
        streamkey="0x"
        config={{
          backgroundColor: "#000",
          textColor: "#fff",
          textSize: 20,
          font: "font-play",
          sound: "https://streamfund.s3.amazonaws.com/sounds/1.mp3",
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
