"use client";

import React from "react";
import { Button } from "../ui/button";

const Register = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center space-y-4">
      <h3 className="font-play text-3xl font-bold">
        Are you ready to start your journey with StreamFund? Register now!
      </h3>
      <Button className="bg-aqua font-play font-bold text-2xl text-midnight hover:bg-aqua/80">
        Register
      </Button>
    </div>
  );
};

export default Register;
