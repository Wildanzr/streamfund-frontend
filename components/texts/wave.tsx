"use client";

import React from "react";
import { motion } from "framer-motion";

interface WaveTextProps {
  text: string;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export default function WaveText({
  text,
  fontSize = 32,
  letterSpacing = 0,
  color = "#ffffff",
  amplitude = 10,
  frequency = 0.1,
  speed = 1,
}: WaveTextProps) {
  return (
    <div style={{ fontSize, letterSpacing, color }}>
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          style={{ display: "inline-block" }}
          animate={{
            y: [
              -amplitude * Math.sin(frequency * index),
              amplitude * Math.sin(frequency * index),
              -amplitude * Math.sin(frequency * index),
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 / speed, // Adjusted for faster animation
            ease: "easeInOut",
            delay: index * 0.05, // Reduced delay for faster overall animation
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
