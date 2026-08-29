"use client";

import React from "react";
import { motion } from "framer-motion";
import { sound } from "./ui-audio-synthesizer";

interface TactileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
  className?: string;
}

export function TactileButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: TactileButtonProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // 1. Synthesize instant tactile click audio with spatial pan
    sound.click(e.clientX);

    // 2. Trigger mobile haptic micro-tap
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleClick = () => {
    if (variant === "success") {
      sound.success();
    }
    onClick?.();
  };

  const baseStyles =
    "relative inline-flex items-center justify-center font-medium rounded-xl px-5 py-2.5 text-sm transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

  const variants = {
    primary: "bg-white text-zinc-950 hover:bg-zinc-100 shadow-md",
    secondary: "bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800",
    success: "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold shadow-emerald-500/20 shadow-lg",
  };

  return (
    <motion.button
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
