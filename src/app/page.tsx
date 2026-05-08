import Navbar from "@/components/Navbar";
import ParallaxHero from "@/components/ParallaxHero";
import StatsPanel from "@/components/StatsPanel";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import AIAssistantSection from "@/components/AIAssistantSection";
import AdventureSection from "@/components/AdventureSection";
import BentoDashboard from "@/components/BentoDashboard";
import AIPlanner from "@/components/AIPlanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <ParallaxHero />
      <StatsPanel />
      <DestinationsCarousel />
      <AdventureSection />
      <AIAssistantSection />
      <BentoDashboard />
      <AIPlanner />
    </>
  );
}
