"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface TiltProps {
  children: ReactNode;
  /** Maximum rotation in degrees. */
  max?: number;
  className?: string;
}

const clamp = (v: number) => Math.min(1, Math.max(-1, v));

/**
 * Cursor-following 3D for a `.rig-3d`. The rig turns toward the pointer
 * wherever it is on the page, eased with a spring-like follow, and exposes:
 *   --rx/--ry   rotation of the rig
 *   --px/--py   pointer offset (-1…1) for per-layer parallax (`translate`)
 *   --mx/--my   pointer position over the rig (%) for the light glare
 *   --glare     1 while the pointer is over the rig
 * CSS variables only — no React re-renders. Fine pointers and full motion only;
 * idle while off-screen.
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

    let visible = false;
    let frame = 0;
    const target = { x: 0, y: 0, mx: 50, my: 35 };
    const current = { ...target };

    const tick = () => {
      frame = 0;
      const k = 0.09;
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      current.mx += (target.mx - current.mx) * k * 1.6;
      current.my += (target.my - current.my) * k * 1.6;
      rig.style.setProperty("--rx", `${(-current.y * max).toFixed(3)}deg`);
      rig.style.setProperty("--ry", `${(current.x * max).toFixed(3)}deg`);
      rig.style.setProperty("--px", current.x.toFixed(4));
      rig.style.setProperty("--py", current.y.toFixed(4));
      rig.style.setProperty("--mx", `${current.mx.toFixed(2)}%`);
      rig.style.setProperty("--my", `${current.my.toFixed(2)}%`);
      const settling =
        Math.abs(target.x - current.x) > 0.0005 ||
        Math.abs(target.y - current.y) > 0.0005 ||
        Math.abs(target.mx - current.mx) > 0.05 ||
        Math.abs(target.my - current.my) > 0.05;
      if (settling) frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (!visible || event.pointerType !== "mouse") return;
      const rect = stage.getBoundingClientRect();
      // Turn toward the cursor from anywhere on screen, strongest near the rig.
      target.x = clamp((event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth * 0.5));
      target.y = clamp((event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight * 0.5));
      target.mx = ((event.clientX - rect.left) / rect.width) * 100;
      target.my = ((event.clientY - rect.top) / rect.height) * 100;
      const inside =
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      rig.style.setProperty("--glare", inside ? "1" : "0");
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      rig.style.setProperty("--glare", "0");
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (!visible) onLeave();
    });
    io.observe(stage);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
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
