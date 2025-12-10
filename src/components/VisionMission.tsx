import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Target, CheckCircle2 } from "lucide-react";

export const VisionMission = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const missionPoints = [
    "Successfully market pharmaceutical products that fill local market gaps",
    "Deliver simple, safe & effective products to treat and manage diseases",
    "Create a healthy work environment for employee growth and development",
  ];

  return (
    <section id="vision" className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
      {/* Background hexagon pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <polygon 
                points="25,0 50,14.4 50,43.4 25,57.7 0,43.4 0,14.4" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-strong p-8 md:p-10 rounded-3xl h-full">
              <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mb-6 shadow-gold">
                <Eye className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Our <span className="text-gradient">Vision</span>
              </h3>
              
              <p className="text-lg text-foreground/90 leading-relaxed">
                Our vision is to establish the name of Bee Group Pharmaceuticals 
                as a professional partner with healthcare providers, supplying 
                innovative medications for traditional health challenges.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-1 flex-1 bg-gradient-gold rounded-full" />
                <span className="text-primary font-medium">Excellence</span>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-strong p-8 md:p-10 rounded-3xl h-full">
              <div className="w-16 h-16 bg-gradient-gold rounded-2xl flex items-center justify-center mb-6 shadow-gold">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Our <span className="text-gradient">Mission</span>
              </h3>
              
              <ul className="space-y-4">
                {missionPoints.map((point, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/90">{point}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-primary font-medium">Impact</span>
                <div className="h-1 flex-1 bg-gradient-gold rounded-full" />
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
