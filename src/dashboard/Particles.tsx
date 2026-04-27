import { useEffect, useRef } from "react";

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const N = 50;
    const colors = ["255, 107, 26", "52, 152, 219"]; // saffron, blue
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const onEnter = () => (paused.current = true);
    const onLeave = () => (paused.current = false);
    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      if (!paused.current) {
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (const p of pts) {
        ctx.fillStyle = `rgba(${p.c}, 0.35)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${a.c}, ${0.15 * (1 - d / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 -z-10 pointer-events-none opacity-60" aria-hidden />;
}
