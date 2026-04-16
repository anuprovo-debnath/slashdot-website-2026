'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { createNoise3D } from 'simplex-noise';

// Assuming SYMBOL_POOL is an array of strings like ['A', 'B', 'C']
// If lib/symbols isn't available, we fallback to a default set.
const FALLBACK_SYMBOLS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%&@#".split("");

interface HeroCanvasProps {
  opacity?: number;
  symbolPool?: string[];
  maxSymbols?: number;
  primaryHue?: number | 'random'; // Allow locking to a specific brand hue
}

/**
 * CONFIGURATION
 */
const CONFIG = {
  MIN_SYMBOLS: 200,
  CULL_RATE: 50,
  FPS_DROP_THRESHOLD_MS: 35,
  SLOW_FRAME_TOLERANCE: 10,
  FONT_SIZE_MIN: 10,
  FONT_SIZE_MAX: 24,
  BASE_OPACITY_MAX: 1.0,
  BROWNIAN_JITTER: 0.01,
  OSCILLATION_RADIUS_MIN: 10,
  OSCILLATION_RADIUS_MAX: 100,
  OSCILLATION_SPEED_MIN: 0.001,
  OSCILLATION_SPEED_MAX: 0.005,
  RING_BASE_RADIUS: 160,
  RING_BREATHE_AMPLITUDE: 20,
  RING_BREATHE_SPEED: 1.2,
  RING_SIGMA: 60,
  NOISE_SCALE_ANGULAR: 1.5,
  NOISE_SPEED: 0.4,
  NOISE_INTENSITY: 0.9,
};

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
  hue: number;

  constructor(width: number, height: number, pool: string[], customHue?: number) {
    this.cx = Math.random() * width;
    this.cy = Math.random() * height;
    this.x = this.cx;
    this.y = this.cy;
    this.char = pool[Math.floor(Math.random() * pool.length)];
    this.size = Math.random() * (CONFIG.FONT_SIZE_MAX - CONFIG.FONT_SIZE_MIN) + CONFIG.FONT_SIZE_MIN;
    this.angle = Math.random() * Math.PI * 2;
    this.radius = Math.random() * (CONFIG.OSCILLATION_RADIUS_MAX - CONFIG.OSCILLATION_RADIUS_MIN) + CONFIG.OSCILLATION_RADIUS_MIN;
    this.speed = Math.random() * (CONFIG.OSCILLATION_SPEED_MAX - CONFIG.OSCILLATION_SPEED_MIN) + CONFIG.OSCILLATION_SPEED_MIN;
    this.baseOpacity = (CONFIG.BASE_OPACITY_MAX * CONFIG.FONT_SIZE_MIN) / (this.size || 1);
    this.hue = customHue !== undefined ? customHue : Math.random() * 360;
  }

  update(width: number, height: number) {
    this.angle += this.speed;
    this.cx += (Math.random() - 0.5) * CONFIG.BROWNIAN_JITTER;
    this.cy += (Math.random() - 0.5) * CONFIG.BROWNIAN_JITTER;

    // Wrap around logic
    if (this.cx < -50) this.cx = width + 50;
    if (this.cx > width + 50) this.cx = -50;
    if (this.cy < -50) this.cy = height + 50;
    if (this.cy > height + 50) this.cy = -50;

    this.x = this.cx + Math.cos(this.angle) * this.radius;
    this.y = this.cy + Math.sin(this.angle * 0.8) * this.radius;
  }

  draw(ctx: CanvasRenderingContext2D, mouseX: number, mouseY: number, noise3D: any, time: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const r = Math.sqrt(dx * dx + dy * dy);

    const theta = Math.atan2(dy, dx);
    const noiseVal = noise3D(
      Math.cos(theta) * CONFIG.NOISE_SCALE_ANGULAR,
      Math.sin(theta) * CONFIG.NOISE_SCALE_ANGULAR,
      time * CONFIG.NOISE_SPEED
    );

    const noiseBaseline = 1.0 - CONFIG.NOISE_INTENSITY;
    const normalizedNoise = ((noiseVal + 1) / 2) * CONFIG.NOISE_INTENSITY + noiseBaseline;
    const r0 = CONFIG.RING_BASE_RADIUS + Math.sin(time * CONFIG.RING_BREATHE_SPEED) * CONFIG.RING_BREATHE_AMPLITUDE;
    const gaussianOpacity = Math.exp(-Math.pow(r - r0, 2) / (2 * Math.pow(CONFIG.RING_SIGMA, 2)));

    const finalOpacity = gaussianOpacity * normalizedNoise * this.baseOpacity;

    if (finalOpacity < 0.01) return;

    ctx.font = `${this.size}px monospace`;
    ctx.globalAlpha = finalOpacity;
    ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
    ctx.fillText(this.char, this.x, this.y);
  }
}

export function HeroArt({
  opacity = 1,
  symbolPool = FALLBACK_SYMBOLS,
  maxSymbols = 600,
  primaryHue,
  className = ""
}: HeroCanvasProps & { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // UseMemo to ensure noise function is only created once
  const noise3D = useMemo(() => createNoise3D(), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let symbols: BackgroundSymbol[] = [];
    let animationFrameId: number;
    let lastTime = 0;
    let slowFramesTracker = 0;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Initialize or re-fill symbols
      if (symbols.length === 0) {
        symbols = Array.from({ length: maxSymbols }, () =>
          new BackgroundSymbol(
            rect.width,
            rect.height,
            symbolPool,
            primaryHue === 'random' ? undefined : primaryHue
          )
        );
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };

    const render = (timestamp: number) => {
      const time = timestamp * 0.001;
      const rect = canvas.getBoundingClientRect();

      // Performance Culling Logic
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

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < symbols.length; i++) {
        symbols[i].update(rect.width, rect.height);
        symbols[i].draw(ctx, mouseRef.current.x, mouseRef.current.y, noise3D, time);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Initial Trigger
    handleResize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxSymbols, symbolPool, primaryHue, noise3D]);

  return (
    <canvas
      ref={canvasRef}
      className={`relative pointer-events-none transition-opacity duration-1000 ${className}`}
      style={{
        opacity: opacity,
        width: '100%',
        height: '100%'
      }}
      aria-hidden="true"
    />
  );
}