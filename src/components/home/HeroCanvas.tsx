"use client";

import React, { useEffect, useRef } from "react";
import { SYMBOL_POOL } from "@/lib/symbols";
import { createNoise3D } from "simplex-noise";

// ============================================================================
// CONFIGURATION: Tweak these variables to easily alter the Canvas aesthetics!
// ============================================================================
export const CONFIG = {
  // 1. Performance & Density
  MAX_SYMBOLS: 600,            // Starting symbol count
  MIN_SYMBOLS: 200,            // Lowest it will drop to maintain performance
  CULL_RATE: 50,               // Number of symbols removed per lag spike
  FPS_DROP_THRESHOLD_MS: 35,   // If frame processing takes longer than this (sub-30fps)
  SLOW_FRAME_TOLERANCE: 10,    // Consecutive laggy frames before culling triggers

  // 2. Base Symbol Attributes
  GLOBAL_ALPHA_LIMIT: 0.8,     // Global master opacity cap ensuring text legibility (0.0 - 1.0)
  FONT_SIZE_MIN: 10,
  FONT_SIZE_MAX: 24,
  BASE_OPACITY_MIN: 0.5,       // Minimum native opacity of a particle
  BASE_OPACITY_MAX: 1.0,       // Maximum native opacity of a particle

  // 3. Movement Physics (Brownian & Oscillation)
  BROWNIAN_JITTER: 0.01,        // Unpredictable pixel drift speed per frame
  OSCILLATION_RADIUS_MIN: 10,  // Minimum structural swing of the Lissajous orbit
  OSCILLATION_RADIUS_MAX: 100,  // Maximum structural swing of the Lissajous orbit
  OSCILLATION_SPEED_MIN: 0.001,
  OSCILLATION_SPEED_MAX: 0.005,

  // 4. Gaussian Ring Visibility (Around Mouse)
  RING_BASE_RADIUS: 160,       // Baseline resting radius of the visible ring
  RING_BREATHE_AMPLITUDE: 20,  // How violently the ring expands and retracts over time
  RING_BREATHE_SPEED: 1.2,     // Speed of the sine wave breathing cycle
  RING_SIGMA: 60,              // The 'width / blur' spread of the ring edge

  // 5. Angular Simplex Noise ("Blobs")
  NOISE_SCALE_ANGULAR: 1.5,    // How 'chunky' the blobs are (higher = more chunks)
  NOISE_SPEED: 0.4,            // How quickly the noise evolves temporally
  NOISE_INTENSITY: 0.9,        // To what extreme the noise deletes the ring (0.0 to 1.0)
};
// ============================================================================


class BackgroundSymbol {
  cx: number;
  cy: number;
  x: number;
  y: number;
  char: string;
  size: number;
  angle: number;
  radius: number;
  speed: number;
  baseOpacity: number;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.cx = Math.random() * this.canvas.width;
    this.cy = Math.random() * this.canvas.height;
    this.x = this.cx;
    this.y = this.cy;
    this.char = SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)];

    // Abstracting to CONFIG
    this.size = Math.random() * (CONFIG.FONT_SIZE_MAX - CONFIG.FONT_SIZE_MIN) + CONFIG.FONT_SIZE_MIN;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * (CONFIG.OSCILLATION_RADIUS_MAX - CONFIG.OSCILLATION_RADIUS_MIN) + CONFIG.OSCILLATION_RADIUS_MIN;
    this.speed = Math.random() * (CONFIG.OSCILLATION_SPEED_MAX - CONFIG.OSCILLATION_SPEED_MIN) + CONFIG.OSCILLATION_SPEED_MIN;
    this.baseOpacity = Math.random() * (CONFIG.BASE_OPACITY_MAX - CONFIG.BASE_OPACITY_MIN) + CONFIG.BASE_OPACITY_MIN;
  }

  update() {
    this.angle += this.speed;

    // Abstracting to CONFIG
    this.cx += (Math.random() - 0.5) * CONFIG.BROWNIAN_JITTER;
    this.cy += (Math.random() - 0.5) * CONFIG.BROWNIAN_JITTER;

    if (this.cx < -50) this.cx = this.canvas.width + 50;
    if (this.cx > this.canvas.width + 50) this.cx = -50;
    if (this.cy < -50) this.cy = this.canvas.height + 50;
    if (this.cy > this.canvas.height + 50) this.cy = -50;

    this.x = this.cx + Math.cos(this.angle) * this.radius;
    this.y = this.cy + Math.sin(this.angle * 0.8) * this.radius;
  }

  draw(ctx: CanvasRenderingContext2D, baseColor: string, mouseX: number, mouseY: number, noise3D: any, time: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const r = Math.sqrt(dx * dx + dy * dy);

    // 1. Angular Noise Abstracted
    const theta = Math.atan2(dy, dx);
    const noiseVal = noise3D(
      Math.cos(theta) * CONFIG.NOISE_SCALE_ANGULAR,
      Math.sin(theta) * CONFIG.NOISE_SCALE_ANGULAR,
      time * CONFIG.NOISE_SPEED
    );

    // Normalization mapping from NOISE_INTENSITY
    const noiseBaseline = 1.0 - CONFIG.NOISE_INTENSITY;
    const normalizedNoise = ((noiseVal + 1) / 2) * CONFIG.NOISE_INTENSITY + noiseBaseline;

    // 2. Gaussian Ring Abstracted
    const r0 = CONFIG.RING_BASE_RADIUS + Math.sin(time * CONFIG.RING_BREATHE_SPEED) * CONFIG.RING_BREATHE_AMPLITUDE;
    const gaussianOpacity = Math.exp(-Math.pow(r - r0, 2) / (2 * Math.pow(CONFIG.RING_SIGMA, 2)));

    // 3. Composite Final Opacity
    const finalOpacity = gaussianOpacity * normalizedNoise * this.baseOpacity * CONFIG.GLOBAL_ALPHA_LIMIT;

    if (finalOpacity < 0.01) return;

    ctx.font = `${this.size}px monospace`;
    ctx.globalAlpha = finalOpacity;
    ctx.fillStyle = baseColor;
    ctx.fillText(this.char, this.x, this.y);
    ctx.globalAlpha = 1.0;
  }
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let symbols: BackgroundSymbol[] = [];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const noise3D = createNoise3D();

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      symbols = Array.from({ length: CONFIG.MAX_SYMBOLS }, () => new BackgroundSymbol(canvas));
    };

    initCanvas();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      symbols.forEach(symbol => {
        if (symbol.cx > canvas.width) symbol.cx = Math.random() * canvas.width;
        if (symbol.cy > canvas.height) symbol.cy = Math.random() * canvas.height;
      });
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", resizeHandler);
    window.addEventListener("mousemove", mouseMoveHandler);

    let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
    let lastTime = 0;
    let slowFramesTracker = 0;

    const render = (timestamp: number) => {
      const time = timestamp * 0.001;

      if (lastTime > 0) {
        const delta = timestamp - lastTime;
        if (delta > CONFIG.FPS_DROP_THRESHOLD_MS) {
          slowFramesTracker++;
          if (slowFramesTracker > CONFIG.SLOW_FRAME_TOLERANCE && symbols.length > CONFIG.MIN_SYMBOLS) {
            symbols.length -= CONFIG.CULL_RATE;
            slowFramesTracker = 0;
          }
        } else {
          slowFramesTracker = 0;
        }
      }
      lastTime = timestamp;

      // Update color dynamically every frame in case of seamless theme toggling
      const activeThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
      if (activeThemeColor) {
        primaryColor = activeThemeColor;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      symbols.forEach(symbol => {
        symbol.update();
        symbol.draw(ctx, primaryColor, mouseX, mouseY, noise3D, time);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousemove", mouseMoveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      style={{ zIndex: -10 }}
      aria-hidden="true"
    />
  );
}
