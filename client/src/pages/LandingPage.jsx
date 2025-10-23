import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Navbar />
      <HeroSection />
    </div>
  );
}