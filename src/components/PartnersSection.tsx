import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const partners = [
  {
    name: "ULTRA",
    nameAr: "ألترا",
    logo: "/placeholder.svg",
    url: "https://www.ultramedumic.com"
  },
  {
    name: "Bayer Egypt",
    nameAr: "باير مصر",
    logo: "/placeholder.svg",
    url: "https://www.facebook.com/bayer"
  },
  {
    name: "Kempetro",
    nameAr: "كيمبترو",
    logo: "/placeholder.svg",
    url: "https://www.kempetro.com"
  },
  {
    name: "Pharmarteat",
    nameAr: "فارماتيت",
    logo: "/placeholder.svg",
    url: "https://www.pharmaegypt-eng.com"
  },
];

export const PartnersSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { language, t } = useLanguage();

  return (
    <section id="partners" className="py-24 md:py-32 relative overflow-hidden bg-muted/30" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium mb-4 block">
            {language === 'ar' ? 'شركاؤنا الموثوقون' : 'Trusted Partners'}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {language === 'ar' ? (
              <>نعمل مع <span className="text-gradient">الأفضل</span></>
            ) : (
              <>Working With <span className="text-gradient">The Best</span></>
            )}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {language === 'ar'
              ? 'نتعاون مع كبرى الشركات والمصانع العالمية لتقديم أفضل المنتجات الصيدلانية'
              : 'We collaborate with leading healthcare providers and manufacturers to deliver excellence in pharmaceutical care.'
            }
          </p>
        </motion.div>

        {/* Partner logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {partners.map((partner, i) => (
              <motion.a
                key={i}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="glass p-8 rounded-2xl flex flex-col items-center justify-center w-48 h-48 hover:shadow-gold transition-all duration-300 group cursor-pointer"
              >
                <div className="text-2xl font-serif font-bold text-gradient group-hover:scale-110 transition-transform duration-300 text-center">
                  {language === 'ar' ? partner.nameAr : partner.name}
                </div>
                <div className="mt-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {language === 'ar' ? 'اضغط للزيارة' : 'Click to visit'}
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 glass-strong p-8 md:p-12 rounded-3xl"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-2">100+</div>
              <div className="text-muted-foreground">
                {language === 'ar' ? 'شريك في مجال الرعاية الصحية' : 'Healthcare Partners'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-2">50+</div>
              <div className="text-muted-foreground">
                {language === 'ar' ? 'نقطة توزيع' : 'Distribution Points'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif font-bold text-gradient mb-2">27</div>
              <div className="text-muted-foreground">
                {language === 'ar' ? 'محافظة مغطاة' : 'Governorates Covered'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
