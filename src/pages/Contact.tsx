import { ContactForm } from "@/components/ContactForm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const Contact = () => {
    const { t, language } = useLanguage();


    return (
        <div className="min-h-screen bg-background text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <div className="container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 text-primary">{t('contact.title')}</h1>
                    <p className="text-xl text-muted-foreground">{t('contact.subtitle')}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="glass-card p-8 rounded-xl"
                        >
                            <div className="grid gap-6">
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('contact.visitUs')}</h3>
                                        <p className="text-muted-foreground">Bee Group HQ</p>
                                        <p className="text-muted-foreground">{t('footer.address')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('contact.callUs')}</h3>
                                        <p className="text-muted-foreground cursor-pointer hover:text-primary transition-colors">+20 10 06546152</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('contact.emailUs')}</h3>
                                        <p className="text-muted-foreground cursor-pointer hover:text-primary transition-colors">info@beegroub.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-primary mt-1" />
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">{t('contact.workingHours')}</h3>
                                        <p className="text-muted-foreground">{t('contact.workingDays')}</p>
                                        <p className="text-muted-foreground">{t('contact.closed')}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8 rounded-xl"
                    >
                        <ContactForm />
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
