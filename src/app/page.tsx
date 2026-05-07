import Navbar from "@/components/Navbar";
import BentoDashboard from "@/components/BentoDashboard";
import AIPlanner from "@/components/AIPlanner";
import ParallaxHero from "@/components/ParallaxHero";

export default function Home() {
  return (
    <>
      <Navbar />
      <ParallaxHero />
      <BentoDashboard />
      <AIPlanner />
    </>
  );
}
