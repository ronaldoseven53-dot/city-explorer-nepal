import Navbar from "@/components/Navbar";
import ParallaxHero from "@/components/ParallaxHero";
import StatsPanel from "@/components/StatsPanel";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import CategoriesSection from "@/components/CategoriesSection";
import StoriesSection from "@/components/StoriesSection";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import FestivalCalendar from "@/components/FestivalCalendar";
import AIAssistantSection from "@/components/AIAssistantSection";
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
      <StoriesSection />
      <ItineraryTimeline />
      <FestivalCalendar />
      <AIAssistantSection />
      <BentoDashboard />
      {/* Bottom padding so the last section clears the fixed nav */}
      <div className="h-20" />
      <BottomNav />
    </>
  );
}
