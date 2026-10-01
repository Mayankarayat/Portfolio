"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  /** Maximum rotation in degrees. */
  max?: number;
  className?: string;
}

/**
 * Pointer-driven 3D tilt for a `.rig-3d`. Writes two CSS variables per frame —
 * no React re-renders — and only on fine pointers without reduced motion.
 * Layers inside position themselves in depth with `.layer-3d` + `--z`.
 */
export function Tilt({ children, max = 8, className = "" }: TiltProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rig = rigRef.current;
    if (!stage || !rig) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let frame = 0;
    let goalX = 0;
    let goalY = 0;
    const apply = () => {
      frame = 0;
      rig.style.setProperty("--rx", `${goalX.toFixed(2)}deg`);
      rig.style.setProperty("--ry", `${goalY.toFixed(2)}deg`);
    };
    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      goalX = -y * max;
      goalY = x * max;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      goalX = 0;
      goalY = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={stageRef} className={`stage-3d ${className}`}>
      <div ref={rigRef} className="rig-3d h-full w-full">
        {children}
      </div>
    </div>
  );
}
