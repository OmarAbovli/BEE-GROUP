import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";

const FAQ = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <div className="container mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold mb-8 text-center text-primary">{t('faq.title')}</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    {t('faq.subtitle')}
                </p>

                <div className="max-w-3xl mx-auto space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-start">{t('faq.q1')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.a1')}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger className="text-start">{t('faq.q2')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.a2')}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger className="text-start">{t('faq.q3')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.a3')}
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-4">
                            <AccordionTrigger className="text-start">{t('faq.q4')}</AccordionTrigger>
                            <AccordionContent>
                                {t('faq.a4')}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FAQ;
