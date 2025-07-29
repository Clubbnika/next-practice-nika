"use client";

import { useEffect, useRef } from "react";

export const EmojiRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xposRef = useRef(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rawContext = canvas.getContext("2d");
    if (!rawContext) return;
    const context: CanvasRenderingContext2D = rawContext;

    const NUM_CONFETTI = 15;
    const COLORS = [
     [144, 238, 144],
      [60, 179, 113],
      [34, 139, 34],
      [0, 128, 0],
      [50, 205, 50],
    ];
    const PI_2 = 2 * Math.PI;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resizeWindow = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeWindow);
    resizeWindow();

    const range = (a: number, b: number) => (b - a) * Math.random() + a;
    const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

    const handleMouseMove = (e: MouseEvent) => {
      // Оновлюємо значення xpos в референсі
      xposRef.current = e.pageX / w;
    };

    document.addEventListener("mousemove", handleMouseMove);

    class Confetti {
      style: number[];
      rgb: string;
      r: number;
      r2: number;
      opacity: number = 0;
      dop: number = 0;
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      xmax: number = 0;
      ymax: number = 0;

      constructor() {
        this.style = COLORS[getRandomInt(0, COLORS.length)];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]},`;
        this.r = range(2, 6);
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.03 * range(0.6, 1.5);
        this.x = range(-this.r2, w - this.r2);
        this.y = range(-20, h - this.r2);
        this.xmax = w - this.r;
        this.ymax = h - this.r;
        this.vx = range(-0.5, 1.5) + 3 * xposRef.current - 1.5;
        this.vy = 0.3 * this.r + range(-0.5, 0.5);
      }

      draw() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += this.dop;
        if (this.opacity > 1) {
          this.opacity = 1;
          this.dop *= -1;
        }
        if (this.opacity < 0 || this.y > this.ymax) this.replace();
        if (!(0 < this.x && this.x < this.xmax)) {
          this.x = (this.x + this.xmax) % this.xmax;
        }
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, PI_2, false);
        context.fillStyle = `${this.rgb}${this.opacity})`;
        context.fill();
      }
    }

    const confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());

    const step = () => {
      context.clearRect(0, 0, w, h);
      for (const c of confetti) c.draw();
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resizeWindow);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 -z-10 w-screen h-screen bg-black"
    />
  );
};