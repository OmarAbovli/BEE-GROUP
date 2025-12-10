import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import {
    Heart,
    Award,
    Users,
    Globe,
    Eye,
    Target,
    CheckCircle2,
    Lightbulb,
    Shield,
    TrendingUp,
    Clock
} from "lucide-react";

export default function About() {
    const { language, t } = useLanguage();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const values = [
        {
            icon: Heart,
            title: language === 'ar' ? 'التركيز على المريض' : 'Patient-Centered',
            description: language === 'ar'
                ? 'نضع احتياجات المرضى في صميم كل ما نقوم به'
                : 'Patients\' needs are at the heart of everything we do'
        },
        {
            icon: Award,
            title: language === 'ar' ? 'الجودة والتميز' : 'Quality Excellence',
            description: language === 'ar'
                ? 'أعلى معايير التصنيع الدوائي والسلامة'
                : 'Highest standards in pharmaceutical manufacturing and safety'
        },
        {
            icon: Lightbulb,
            title: language === 'ar' ? 'الابتكار' : 'Innovation',
            description: language === 'ar'
                ? 'نبتكر حلولاً دوائية لسد فجوات السوق'
                : 'Innovative pharmaceutical solutions for market gaps'
        },
        {
            icon: Shield,
            title: language === 'ar' ? 'النزاهة' : 'Integrity',
            description: language === 'ar'
                ? 'الشفافية والمصداقية في جميع تعاملاتنا'
                : 'Transparency and credibility in all our dealings'
        },
        {
            icon: Users,
            title: language === 'ar' ? 'فريق محترف' : 'Expert Team',
            description: language === 'ar'
                ? 'شركاء محترفون بخبرة عقود في المجال الدوائي'
                : 'Professional partners with decades of pharma experience'
        },
        {
            icon: Globe,
            title: language === 'ar' ? 'معايير عالمية' : 'Global Standards',
            description: language === 'ar'
                ? 'نلتزم باللوائح والمعايير الدوائية الدولية'
                : 'Meeting international pharmaceutical regulations and quality'
        },
    ];

    const timeline = [
        {
            year: '2018',
            title: language === 'ar' ? 'التأسيس' : 'Foundation',
            description: language === 'ar'
                ? 'تأسيس بي جروب للأدوية في مصر بواسطة مجموعة من الشركاء المحترفين'
                : 'Bee Group Pharmaceuticals founded in Egypt by professional partners'
        },
        {
            year: '2019',
            title: language === 'ar' ? 'التوسع' : 'Expansion',
            description: language === 'ar'
                ? 'إطلاق أول خط إنتاج وتوسيع شبكة التوزيع'
                : 'Launch of first product line and distribution network expansion'
        },
        {
            year: '2020',
            title: language === 'ar' ? 'الشراكات' : 'Partnerships',
            description: language === 'ar'
                ? 'بناء شراكات استراتيجية مع كبرى الشركات العالمية'
                : 'Strategic partnerships with leading global companies'
        },
        {
            year: '2024',
            title: language === 'ar' ? 'النمو المستمر' : 'Continuous Growth',
            description: language === 'ar'
                ? 'تغطية 27 محافظة مع أكثر من 100 شريك في مجال الرعاية الصحية'
                : 'Coverage of 27 governorates with 100+ healthcare partners'
        },
    ];

    const missionPoints = [
        language === 'ar'
            ? 'تسويق المنتجات الدوائية التي تسد فجوات السوق المحلي بنجاح'
            : 'Successfully market pharmaceutical products that fill local market gaps',
        language === 'ar'
            ? 'تقديم منتجات بسيطة وآمنة وفعالة لعلاج وإدارة الأمراض'
            : 'Deliver simple, safe & effective products to treat and manage diseases',
        language === 'ar'
            ? 'خلق بيئة عمل صحية لنمو وتطوير الموظفين'
            : 'Create a healthy work environment for employee growth and development',
    ];

    return (
        <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <span className="text-primary font-medium mb-4 block">
                            {language === 'ar' ? 'من نحن' : 'About Us'}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                            {language === 'ar' ? (
                                <>إرث من <span className="text-gradient">التميز الدوائي</span></>
                            ) : (
                                <>A Legacy of <span className="text-gradient">Pharmaceutical Excellence</span></>
                            )}
                        </h1>

                        <blockquote className="border-l-4 border-primary pl-6 my-8 text-left max-w-2xl mx-auto">
                            <p className="text-xl italic text-foreground/90 font-serif">
                                {language === 'ar'
                                    ? '"حيثما يُحب فن الطب، يوجد أيضاً حب للإنسانية"'
                                    : '"Wherever the art of medicine is loved, there is also a love for humanity."'
                                }
                            </p>
                            <cite className="text-muted-foreground mt-2 block text-sm">
                                {language === 'ar' ? '— أبقراط' : '— Hippocrates'}
                            </cite>
                        </blockquote>
                    </motion.div>
                </div>
            </section>

            {/* Company Story */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-serif font-bold mb-6">
                                {language === 'ar' ? 'قصتنا' : 'Our Story'}
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                                {language === 'ar'
                                    ? 'بي جروب للأدوية هي شركة ذات مسؤولية محدودة تأسست في مصر منذ عام 2018 على يد مجموعة من الشركاء المحترفين الذين لديهم خبرة طويلة في أسواق الأدوية محلياً ودولياً.'
                                    : 'Bee Group Pharmaceuticals is a limited liability company founded in Egypt since 2018 by a group of professional partners who had long experience in pharma markets both locally and internationally.'
                                }
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                {language === 'ar'
                                    ? 'نحن ملتزمون بتقديم منتجات دوائية مبتكرة تسد فجوات السوق وتوفر حلولاً فعالة لمختلف الحالات الصحية.'
                                    : 'We are committed to delivering innovative pharmaceutical products that fill market gaps and provide effective solutions for various health conditions.'
                                }
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="glass-strong p-8 rounded-3xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-serif font-bold text-gradient mb-2">2018</div>
                                        <div className="text-sm text-muted-foreground">
                                            {language === 'ar' ? 'سنة التأسيس' : 'Year Founded'}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-serif font-bold text-gradient mb-2">100+</div>
                                        <div className="text-sm text-muted-foreground">
                                            {language === 'ar' ? 'شريك صحي' : 'Healthcare Partners'}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-serif font-bold text-gradient mb-2">27</div>
                                        <div className="text-sm text-muted-foreground">
                                            {language === 'ar' ? 'محافظة' : 'Governorates'}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-serif font-bold text-gradient mb-2">50+</div>
                                        <div className="text-sm text-muted-foreground">
                                            {language === 'ar' ? 'نقطة توزيع' : 'Distribution Points'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-20 relative overflow-hidden">
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
                                    {language === 'ar' ? (
                                        <><span className="text-gradient">رؤيتنا</span></>
                                    ) : (
                                        <>Our <span className="text-gradient">Vision</span></>
                                    )}
                                </h3>

                                <p className="text-lg text-foreground/90 leading-relaxed">
                                    {language === 'ar'
                                        ? 'رؤيتنا هي ترسيخ اسم بي جروب للأدوية كشريك محترف مع مقدمي الرعاية الصحية، نوفر أدوية مبتكرة للتحديات الصحية التقليدية.'
                                        : 'Our vision is to establish the name of Bee Group Pharmaceuticals as a professional partner with healthcare providers, supplying innovative medications for traditional health challenges.'
                                    }
                                </p>

                                <div className="mt-8 flex items-center gap-4">
                                    <div className="h-1 flex-1 bg-gradient-gold rounded-full" />
                                    <span className="text-primary font-medium">
                                        {language === 'ar' ? 'التميز' : 'Excellence'}
                                    </span>
                                </div>
                            </div>

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
                                    {language === 'ar' ? (
                                        <><span className="text-gradient">مهمتنا</span></>
                                    ) : (
                                        <>Our <span className="text-gradient">Mission</span></>
                                    )}
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
                                    <span className="text-primary font-medium">
                                        {language === 'ar' ? 'التأثير' : 'Impact'}
                                    </span>
                                    <div className="h-1 flex-1 bg-gradient-gold rounded-full" />
                                </div>
                            </div>

                            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            {language === 'ar' ? (
                                <>قيمنا <span className="text-gradient">الأساسية</span></>
                            ) : (
                                <>Our Core <span className="text-gradient">Values</span></>
                            )}
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            {language === 'ar'
                                ? 'القيم التي توجه عملنا وتحدد هويتنا كشركة رائدة في المجال الدوائي'
                                : 'The values that guide our work and define our identity as a leading pharmaceutical company'
                            }
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass p-6 rounded-2xl group hover:bg-card/50 transition-all duration-300"
                            >
                                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            {language === 'ar' ? (
                                <>رحلتنا عبر <span className="text-gradient">الزمن</span></>
                            ) : (
                                <>Our Journey Through <span className="text-gradient">Time</span></>
                            )}
                        </h2>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative pl-8 pb-12 border-l-2 border-primary/20 last:border-l-0 last:pb-0"
                            >
                                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 bg-primary rounded-full shadow-gold" />
                                <div className="glass p-6 rounded-2xl">
                                    <div className="flex items-center gap-4 mb-3">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <span className="text-2xl font-serif font-bold text-gradient">{item.year}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
