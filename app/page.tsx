"use client";
import dynamic from "next/dynamic";
import LandingNavbar from "./components/LandingNavbar";
import HeroSection from "./components/HeroSection";
import FeaturedEvents from "./components/FeaturedEvents";
import CommunitySection from "./components/CommunitySection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/footer";

// Dynamically import ReactLenis to avoid SSR issues
const ReactLenis = dynamic(
  () => import("@studio-freight/react-lenis").then((mod) => mod.ReactLenis),
  { ssr: false }
);

export default function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div className="min-h-screen bg-white">
        <LandingNavbar />
        <HeroSection />
        <FeaturedEvents />
        <CommunitySection />
        <FAQSection />
        <Footer />
      </div>
    </ReactLenis>
  );
}

