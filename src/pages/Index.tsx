import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { VisionMission } from "@/components/VisionMission";
import { ProductsSection } from "@/components/ProductsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <VisionMission />
        <ProductsSection />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
