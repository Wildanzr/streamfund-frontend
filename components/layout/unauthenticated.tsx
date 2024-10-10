import React from "react";
import Marquee from "../running/Marquee";

const Unauthenticated = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center">
      <h3>Connect your wallet to access the platform</h3>
      <Marquee
        backgroundColor="#000000"
        textColor="#ffffff"
        borderColor="#ffffff"
        font="monospace"
        text="THE START is my aleresadasakjkas dask afklajfkoajfqwoijap iklfjsa THE END"
        textSize="20"
      />
    </div>
  );
};

export default Unauthenticated;
