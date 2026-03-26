"use client";

import React from "react";
import { useTheme } from "next-themes";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { cn } from "@/lib/utils";

export function GlobalBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-slate-950" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Base gradient */}
      <div className={cn(
        "absolute inset-0 transition-colors duration-700",
        isDark 
          ? "bg-linear-to-br from-slate-950 via-slate-900 to-teal-950/40" 
          : "bg-linear-to-br from-slate-50 via-white to-emerald-50/30"
      )} />

      {/* Flickering Grid */}
      <FlickeringGrid
        className="absolute inset-0 z-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.6}
        flickerChance={0.3}
      />

      {/* Blob 1 – large blue, top-left */}
      <div
        className="blob-1 absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full dark:opacity-80 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, oklch(0.65 0.18 145 / 0.18), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Blob 2 – indigo, top-right */}
      <div
        className="blob-2 absolute -top-20 -right-32 w-[600px] h-[600px] rounded-full dark:opacity-80 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 60% 35%, oklch(0.55 0.2 165 / 0.16), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Blob 3 – violet, center */}
      <div
        className="blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full dark:opacity-80 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.6 0.15 155 / 0.09), transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      {/* Blob 4 – sky blue, bottom-left */}
      <div
        className="blob-4 absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full dark:opacity-80 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 40% 60%, oklch(0.70 0.16 180 / 0.13), transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Blob 5 – pale indigo, bottom-right */}
      <div
        className="blob-5 absolute -bottom-20 -right-40 w-[650px] h-[650px] rounded-full dark:opacity-80 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 55% 55%, oklch(0.62 0.17 135 / 0.12), transparent 68%)",
          filter: "blur(75px)",
        }}
      />

      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.6 0.18 145 / 0.4) 40%, oklch(0.55 0.2 165 / 0.4) 60%, transparent)",
        }}
      />
    </div>
  );
}
