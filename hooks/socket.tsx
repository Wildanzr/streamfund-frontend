"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useSocketIO() {
  const [searchParams, setSearchParams] = useState(null);
  const params = useSearchParams();

  useEffect(() => {
    setSearchParams(params);
    console.log("searchParams", params);
  }, [params]);

  return [searchParams];
}
