import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { VisionMission } from "@/components/VisionMission";
import { ProductsSection } from "@/components/ProductsSection";
import { PartnersSection } from "@/components/PartnersSection";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

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

        {/* Contact & Map Section */}
        <section className="py-20 container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">Get in Touch</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className="glass-card p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Contact Us</h3>
              <ContactForm />
            </div>

            {/* Map */}
            <div className="glass-card p-4 rounded-xl h-[500px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3427.0342786901633!2d30.991284!3d30.801672999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDQ4JzA2LjAiTiAzMMKwNTknMjguNiJF!5e0!3m2!1sen!2seg!4v1766921163218!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.75rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
