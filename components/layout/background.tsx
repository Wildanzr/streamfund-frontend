import React from "react";
import ParticleBg from "./particle";

const Background = () => {
  return (
    <>
      <div className="absolute inset-0 bg-woman bg-top bg-fixed bg-cover bg-no-repeat blur-sm z-0 brightness-50 " />
      <ParticleBg />
    </>
  );
};

export default Background;
