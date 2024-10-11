"use client";

import React from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";

type AnimationType =
  | "wave"
  | "bounce"
  | "pulse"
  | "rubberBand"
  | "tada"
  | "spin"
  | "wiggle"
  | "float"
  | "jiggle"
  | "heartbeat"
  | "swing"
  | "blink"
  | "twist"
  | "pendulum"
  | "rotate";

interface TextSegment {
  text: string;
  isMain?: boolean;
}

interface AnimationProps {
  segments: TextSegment[];
  type: AnimationType;
  delay?: number;
  staggerChildren?: number;
  fontSize?: number;
  color?: string;
  mainColor?: string;
  fontWeight?: number;
  mainFontWeight?: number;
  revealSpeed?: number;
  revealDuration?: number;
}

const animationVariants: Variants = {
  wave: (i: number) => ({
    y: [-20, 20],
    transition: {
      repeat: Infinity,
      repeatType: "reverse" as const,
      duration: 1,
      delay: i * 0.1,
    },
  }),
  bounce: {
    y: [0, -30],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.6,
    },
  },
  pulse: {
    scale: [1, 1.1],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.3,
    },
  },
  rubberBand: {
    scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1.05, 1],
    scaleY: [1, 0.75, 1.25, 0.85, 1.05, 0.95, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      repeatDelay: 1,
    },
  },
  tada: {
    scale: [1, 0.9, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1],
    rotate: [0, -3, 3, -3, 3, -3, 3, -3, 3, 0],
    transition: {
      repeat: Infinity,
      duration: 1,
      repeatDelay: 1,
    },
  },
  spin: {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear",
    },
  },
  wiggle: {
    rotate: [-3, 3],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.3,
    },
  },
  float: {
    y: [-10, 10],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut",
    },
  },
  jiggle: {
    x: [-2, 2],
    y: [-2, 2],
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.2,
    },
  },
  heartbeat: {
    scale: [1, 1.2, 1, 1.2, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      times: [0, 0.14, 0.3, 0.44, 0.6],
    },
  },
  swing: {
    rotate: [-10, 10],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1,
      ease: "easeInOut",
    },
  },
  blink: {
    opacity: [1, 0, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
      times: [0, 0.5, 1],
    },
  },
  twist: {
    rotateY: [0, 180],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1,
    },
  },
  pendulum: {
    rotate: [-45, 45],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut",
    },
  },
  rotate: {
    rotate: [0, 360],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: "linear",
    },
  },
};

export default function TextAnimation({
  segments,
  type,
  delay = 0,
  staggerChildren = 0.1,
  fontSize = 24,
  color = "#000000",
  mainColor = "#FF0000",
  fontWeight = 400,
  mainFontWeight = 700,
  revealSpeed = 0.5,
  revealDuration = 3,
}: AnimationProps) {
  let letterIndex = 0;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: i * delay,
        duration: revealDuration,
      },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: revealSpeed,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        duration: revealSpeed,
      },
    },
  };

  return (
    <motion.div
      style={{
        overflow: "visible",
        display: "flex",
        flexWrap: "wrap",
        fontSize: `${fontSize}px`,
        padding: type === "wave" ? "20px 0" : "0",
      }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {segments.map((segment, segmentIndex) => {
          const letters = Array.from(segment.text);
          return letters.map((letter, index) => {
            const currentIndex = letterIndex++;
            return (
              <motion.span
                key={`${segmentIndex}-${index}`}
                className={`font-protest ${segment.isMain ? "main-text" : ""}`}
                variants={child}
                custom={currentIndex}
                style={{
                  display: "inline-block",
                  color: segment.isMain ? mainColor : color,
                  fontWeight: segment.isMain ? mainFontWeight : fontWeight,
                }}
              >
                <motion.span
                  animate={type}
                  variants={animationVariants}
                  custom={currentIndex}
                  style={{ display: "inline-block" }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay:
                      type === "rubberBand" || type === "tada" ? 1 : 0,
                    delay: delay + currentIndex * 0.1,
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              </motion.span>
            );
          });
        })}
      </AnimatePresence>
    </motion.div>
  );
}
