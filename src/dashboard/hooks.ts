import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, durationMs = 1200, decimals = 0, start = true) {
  const [value, setValue] = useState(0);
  const startedAt = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    startedAt.current = null;
    const tick = (t: number) => {
      if (startedAt.current == null) startedAt.current = t;
      const p = Math.min(1, (t - startedAt.current) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, durationMs, start]);
  return Number(value.toFixed(decimals));
}

export function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.15 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, opts);
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [opts]);
  return { ref, inView };
}

export function useTypewriter(text: string, speed = 28, run = true) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!run) { setOut(text); return; }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, run]);
  return out;
}
