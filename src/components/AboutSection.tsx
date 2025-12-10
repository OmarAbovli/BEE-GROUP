import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Award, Users, Globe } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Patient-Centered",
    description: "Our medications are designed with patients' needs at the forefront.",
  },
  {
    icon: Award,
    title: "Quality Excellence",
    description: "Highest standards in pharmaceutical manufacturing and safety.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Professional partners with decades of pharma experience.",
  },
  {
    icon: Globe,
    title: "Global Standards",
    description: "Meeting international pharmaceutical regulations and quality.",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium mb-4 block">About Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              A Legacy of{" "}
              <span className="text-gradient">Pharmaceutical Excellence</span>
            </h2>
            
            <blockquote className="border-l-4 border-primary pl-6 my-8">
              <p className="text-xl italic text-foreground/90 font-serif">
                "Wherever the art of medicine is loved, there is also a love for humanity."
              </p>
              <cite className="text-muted-foreground mt-2 block text-sm">
                — Hippocrates
              </cite>
            </blockquote>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Bee Group Pharmaceuticals is a limited liability company founded in 
              Egypt since 2018 by a group of professional partners who had long 
              experience in pharma markets both locally and internationally.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              We are committed to delivering innovative pharmaceutical products 
              that fill market gaps and provide effective solutions for various 
              health conditions.
            </p>
          </motion.div>

          {/* Right - Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="glass p-6 rounded-2xl group hover:bg-card/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
