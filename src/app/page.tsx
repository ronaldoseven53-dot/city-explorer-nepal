import Navbar from "@/components/Navbar";
import ParallaxHero from "@/components/ParallaxHero";
import StatsPanel from "@/components/StatsPanel";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import AIAssistantSection from "@/components/AIAssistantSection";
import CategoriesSection from "@/components/CategoriesSection";
import BentoDashboard from "@/components/BentoDashboard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <>
      <Navbar />
      <ParallaxHero />
      <StatsPanel />
      <DestinationsCarousel />
      <CategoriesSection />
      <AIAssistantSection />
      <BentoDashboard />
      {/* Bottom padding so the last section clears the fixed nav */}
      <div className="h-20" />
      <BottomNav />
    </>
  );
}
