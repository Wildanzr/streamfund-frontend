"use client";

import React from "react";
import { Button } from "../ui/button";

const Register = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <h3 className="font-play text-3xl font-bold">
        Are you ready to start your journey with StreamFund? Register now!
      </h3>
      <Button>Register</Button>
    </div>
  );
};

export default Register;
