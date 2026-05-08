import Navbar from "@/components/Navbar";
import ParallaxHero from "@/components/ParallaxHero";
import DestinationsCarousel from "@/components/DestinationsCarousel";
import BentoDashboard from "@/components/BentoDashboard";
import AIPlanner from "@/components/AIPlanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <ParallaxHero />
      <DestinationsCarousel />
      <BentoDashboard />
      <AIPlanner />
    </>
  );
}
