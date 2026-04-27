import { useEffect, useState } from "react";
import { Navbar } from "@/dashboard/Navbar";
import { FilterSidebar } from "@/dashboard/Sidebar";
import { Particles } from "@/dashboard/Particles";
import { CommandPalette } from "@/dashboard/CommandPalette";
import { StoryMode } from "@/dashboard/StoryMode";
import { Overview } from "@/dashboard/sections/Overview";
import { Demographics } from "@/dashboard/sections/Demographics";
import { SocioEconomic } from "@/dashboard/sections/SocioEconomic";
import { Politics } from "@/dashboard/sections/Politics";
import { Transparency } from "@/dashboard/sections/Transparency";
import { Comparison } from "@/dashboard/sections/Comparison";
import { MobileBottomNav } from "@/dashboard/MobileBottomNav";
import { FilterSummary } from "@/dashboard/FilterSummary";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const Index = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [story, setStory] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen w-full pb-16 md:pb-0">
      <Particles />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} onPlayStory={() => setStory(true)} />
      <FilterSummary />
      <div className="container mx-auto px-3 md:px-6 py-4 md:py-6 flex gap-4 md:gap-6 items-start">
        <FilterSidebar />
        <main className="flex-1 min-w-0 space-y-10 md:space-y-16 animate-fade-in">
          <h1 className="sr-only">For the People — India Socio-Political Intelligence Dashboard</h1>
          <Overview />
          <Demographics />
          <SocioEconomic />
          <Politics />
          <Transparency />
          <Comparison />
          <footer className="py-10 text-center text-xs text-muted-foreground">
            For the People · Illustrative dataset based on Census 2011, ECI &amp; ADR India · India's Socio-Political Intelligence Platform.
          </footer>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <StoryMode active={story} onClose={() => setStory(false)} />
      <MobileBottomNav onOpenFilters={() => setMobileFilters(true)} />
      <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
        <SheetContent side="bottom" className="p-0 max-h-[85vh] overflow-y-auto rounded-t-2xl border-0 bg-transparent">
          <FilterSidebar embedded />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;
