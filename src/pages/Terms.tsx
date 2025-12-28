import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Terms = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <div className="container mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold mb-8 text-primary">{t('terms.title')}</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="lead">{t('terms.lastUpdated')}</p>

                    <h3>{t('terms.sec1')}</h3>
                    <p>{t('terms.txt1')}</p>

                    <h3>{t('terms.sec2')}</h3>
                    <p>{t('terms.txt2')}</p>

                    <h3>{t('terms.sec3')}</h3>
                    <p>{t('terms.txt3')}</p>

                    <h3>{t('terms.sec4')}</h3>
                    <p>{t('terms.txt4')}</p>

                    <h3>{t('terms.sec5')}</h3>
                    <p>{t('terms.txt5')}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Terms;
