"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  className,
  maxOpacity = 0.3,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const memoizedColor = useMemo(() => {
    const toRGBA = (color: string) => {
      if (typeof window === "undefined") {
        return `rgba(0, 0, 0,`;
      }
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return "rgba(255, 0, 0,";
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
      return `rgba(${r}, ${g}, ${b},`;
    };
    return toRGBA(color);
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.ceil(width / (squareSize + gridGap));
      const rows = Math.ceil(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity]
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      const updatedIndices: number[] = [];
      // To optimize, we only update squares probabilistically and track which changed
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
          updatedIndices.push(i);
        }
      }
      return updatedIndices;
    },
    [flickerChance, maxOpacity]
  );

  const drawInitialGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number
    ) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j];
          ctx.fillStyle = `${memoizedColor}${opacity})`;
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr
          );
        }
      }
    },
    [memoizedColor, squareSize, gridGap]
  );

  const drawUpdatedSquares = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cols: number,
      rows: number,
      squares: Float32Array,
      updatedIndices: number[],
      dpr: number
    ) => {
      // Instead of clearing the entire canvas, we ONLY redraw the changed squares.
      // This reduces fillRect calls by >99%.
      for (const idx of updatedIndices) {
        const i = Math.floor(idx / rows);
        const j = idx % rows;
        const opacity = squares[idx];

        const x = i * (squareSize + gridGap) * dpr;
        const y = j * (squareSize + gridGap) * dpr;
        const size = squareSize * dpr;

        // Clear only the specific square
        ctx.clearRect(x, y, size, size);

        // Draw the newly updated square
        ctx.fillStyle = `${memoizedColor}${opacity})`;
        ctx.fillRect(x, y, size, size);
      }
    },
    [memoizedColor, squareSize, gridGap]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true }) ?? null;
    let animationFrameId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let gridParams: ReturnType<typeof setupCanvas> | null = null;

    if (canvas && container && ctx) {
      const updateCanvasSize = () => {
        const newWidth = width || container.clientWidth;
        const newHeight = height || container.clientHeight;
        setCanvasSize({ width: newWidth, height: newHeight });
        gridParams = setupCanvas(canvas, newWidth, newHeight);

        // Perform initial heavy draw once
        drawInitialGrid(
          ctx,
          canvas.width,
          canvas.height,
          gridParams.cols,
          gridParams.rows,
          gridParams.squares,
          gridParams.dpr
        );
      };

      updateCanvasSize();

      let lastTime = 0;
      const animate = (time: number) => {
        if (!isInView || !gridParams) return;

        // Throttle to max ~30 FPS (every ~33ms) to save CPU/GPU overhead
        const elapsed = time - lastTime;
        if (elapsed < 33) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

        const deltaTime = elapsed / 1000;
        lastTime = time;

        const updatedIndices = updateSquares(gridParams.squares, deltaTime);

        if (updatedIndices.length > 0) {
          drawUpdatedSquares(
            ctx,
            gridParams.cols,
            gridParams.rows,
            gridParams.squares,
            updatedIndices,
            gridParams.dpr
          );
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      resizeObserver = new ResizeObserver(() => {
        updateCanvasSize();
      });
      resizeObserver.observe(container);

      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting) {
            lastTime = performance.now();
          }
        },
        { threshold: 0 }
      );
      intersectionObserver.observe(canvas);

      if (isInView) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [setupCanvas, updateSquares, drawInitialGrid, drawUpdatedSquares, width, height, isInView]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      {...props}
    >
      {mounted && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none"
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
          }}
        />
      )}
    </div>
  );
}
