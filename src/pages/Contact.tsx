import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    message: formData.message,
                    phone: "" // Optional field not in this form design
                })
            });
            toast({ title: t('common.success'), description: t('contact.messageSent') });
            setFormData({ firstName: "", lastName: "", email: "", message: "" });
        } catch (error) {
            toast({ title: t('common.error'), description: "Failed to send message", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('contact.firstName')}</label>
                                    <Input placeholder={t('contact.firstName')} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('contact.lastName')}</label>
                                    <Input placeholder={t('contact.lastName')} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('contact.email')}</label>
                                <Input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('contact.message')}</label>
                                <Textarea className="min-h-[150px]" placeholder={t('contact.message')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
                            </div>

                            <Button className="w-full text-lg" size="lg" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? t('common.loading') : t('contact.send')}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
