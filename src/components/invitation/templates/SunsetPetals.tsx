"use client";

import { useEffect, useRef } from "react";

export type SunsetPetalMode = "off" | "rain" | "fill" | "drift";

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  turn: number;
  flutter: number;
}

/** The original canvas petal shower, stopped and cleaned up when it is hidden. */
export default function SunsetPetals({
  mode,
  burstKey,
}: {
  mode: SunsetPetalMode;
  burstKey: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const petals = useRef<Petal[]>([]);
  const previousBurst = useRef(0);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    if (mode === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      petals.current = [];
      context.clearRect(0, 0, element.width, element.height);
      return;
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    const resize = () => {
      const scale = Math.min(devicePixelRatio || 1, 2);
      width = Math.min(innerWidth, 480);
      height = innerHeight;
      element.width = width * scale;
      element.height = height * scale;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };
    const spawn = (burst = false) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 5.5;
      petals.current.push({
        x: burst ? width * 0.46 : Math.random() * width,
        y: burst ? height * 0.2 : -30 - Math.random() * 60,
        vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 1.6,
        vy: burst ? Math.sin(angle) * speed - 2.5 : 1.2 + Math.random() * 3,
        size: mode === "fill" ? 10 + Math.random() * 16 : 6 + Math.random() * 9,
        rotation: Math.random() * 6.28,
        turn: (Math.random() - 0.5) * 0.1,
        flutter: Math.random() * 6.28,
      });
    };
    resize();
    if (burstKey !== previousBurst.current) {
      previousBurst.current = burstKey;
      for (let i = 0; i < 90; i++) spawn(true);
    }

    const draw = (timestamp: number) => {
      frame = requestAnimationFrame(draw);
      if (timestamp - lastFrame < 1000 / 60) return;
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);
      if (mode === "fill" && petals.current.length < 950) for (let i = 0; i < 16; i++) spawn();
      if (mode === "rain" && Math.random() < 0.55) spawn();
      if (mode === "drift" && Math.random() < 0.04) spawn();

      petals.current = petals.current.filter((petal) => {
        petal.vy = Math.min(petal.vy + 0.035, mode === "fill" ? 7 : 3.4);
        petal.vx *= 0.992;
        petal.x += petal.vx + Math.sin(petal.flutter) * 0.7;
        petal.y += petal.vy;
        petal.rotation += petal.turn;
        petal.flutter += 0.05;
        if (petal.y > height + 40) return false;

        const size = petal.size;
        context.save();
        context.translate(petal.x, petal.y);
        context.rotate(petal.rotation);
        context.scale(1, 0.35 + Math.abs(Math.cos(petal.flutter)) * 0.65);
        const gradient = context.createLinearGradient(0, -size, 0, size);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#efe6d2");
        context.fillStyle = gradient;
        context.shadowColor = "rgba(0,0,0,.18)";
        context.shadowBlur = 4;
        context.beginPath();
        context.moveTo(0, -size);
        context.bezierCurveTo(size * 0.95, -size * 0.5, size * 0.8, size * 0.75, 0, size);
        context.bezierCurveTo(-size * 0.8, size * 0.75, -size * 0.95, -size * 0.5, 0, -size);
        context.fill();
        context.restore();
        return true;
      });
    };
    frame = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("resize", resize);
    };
  }, [mode, burstKey]);

  return <canvas ref={canvas} id="petals" aria-hidden="true" />;
}
