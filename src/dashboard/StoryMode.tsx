import { useEffect, useState } from "react";
import { useTypewriter } from "./hooks";
import { X } from "lucide-react";

const STEPS = [
  { id: "overview", title: "India in numbers", text: "1.43 billion people. 28 states. One of the most diverse democracies on Earth — let's read its pulse." },
  { id: "demographics", title: "Religion & caste", text: "Hindus form ~80% of the population, but composition shifts dramatically across states. Education still tracks caste." },
  { id: "socioeconomic", title: "Wealth follows literacy", text: "Literacy and HDI correlate at 0.93. Yet wealth has almost no relationship with voter turnout." },
  { id: "politics", title: "Power, redistributed", text: "BJP won 240 seats in 2024 — a coalition government for the first time in a decade. Turnout dipped 1.6 points." },
  { id: "transparency", title: "Who runs?", text: "31% of candidates declared criminal cases. The median MP is 18× wealthier than the median household." },
  { id: "comparison", title: "Two Indias", text: "Compare any two states side by side — and the contrasts are staggering." },
];

export function StoryMode({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    setI(0);
  }, [active]);
  useEffect(() => {
    if (!active) return;
    const step = STEPS[i];
    document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const timer = setTimeout(() => {
      if (i < STEPS.length - 1) setI(i + 1);
      else onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [active, i, onClose]);

  const text = useTypewriter(active ? STEPS[i].text : "", 22, active);
  if (!active) return null;
  const step = STEPS[i];
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(640px,92vw)] bp-card p-5 animate-fade-up">
      <button onClick={onClose} className="absolute top-2 right-2 text-muted-foreground hover:text-saffron"><X className="w-4 h-4" /></button>
      <div className="bp-pill mb-2">Story · {i + 1} / {STEPS.length}</div>
      <h3 className="font-display text-xl mb-1">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed min-h-[3em]">{text}<span className="inline-block w-1.5 h-4 bg-saffron align-middle ml-0.5" style={{ animation: "type-caret 0.7s steps(1) infinite" }} /></p>
      <div className="mt-3 h-1 bg-muted rounded overflow-hidden">
        <div className="h-full bg-gradient-to-r from-saffron to-india-blue transition-all ease-linear" style={{ width: `${((i + 1) / STEPS.length) * 100}%`, transitionDuration: "4500ms" }} />
      </div>
    </div>
  );
}
