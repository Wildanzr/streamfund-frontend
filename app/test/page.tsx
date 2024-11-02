"use client";

import Background from "@/components/layout/background";
import Header from "@/components/layout/header";
import ToApp from "@/components/layout/toapp";
import React from "react";

const TestPage = () => {
  return (
    <div className="flex relative flex-col items-start justify-start w-full h-full min-h-screen">
      <Background />
      <div className="flex flex-col space-y-10 items-center justify-start w-full h-full z-10">
        <Header />
        <div className="flex flex-col space-y-5 w-full h-full items-center justify-center p-10">
          <h1 className="text-6xl font-play font-bold text-white text-left md:text-center">
            Stream, Engage, and Earn
          </h1>
          <h3 className="text-2xl font-play text-white text-left md:text-center">
            The Future of Support for Content Creators is Here!
          </h3>
        </div>

        <ToApp />

        <div className="flex flex-col space-y-5 w-full h-full justify-start z-10 p-10">
          <p className="text-white font-play text-2xl text-center">
            Your viewers are more than just fans; they’re your biggest
            supporters! StreamFund makes it easy for them to support and
            interact with you in real-time, while you enjoy instant payouts and
            transparent tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
