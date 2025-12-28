import { useLanguage } from "@/context/LanguageContext";
import { BeeBackground } from "@/components/BeeBackground";
import { SEO } from "@/components/SEO";

const Terms = () => {
    const { t, language } = useLanguage();

    return (
        <div className="min-h-screen relative">
            <SEO title={t('terms.title')} />
            <BeeBackground />
            <div className="bg-background pt-24 pb-12 container mx-auto px-6 relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <h1 className="text-4xl font-bold mb-8 text-primary">{t('terms.title')}</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="lead">{t('terms.lastUpdated')}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">{t('terms.sec1')}</h3>
                    <p className="text-muted-foreground mb-6">{t('terms.txt1')}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">{t('terms.sec2')}</h3>
                    <p className="text-muted-foreground mb-6">{t('terms.txt2')}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">{t('terms.sec3')}</h3>
                    <p className="text-muted-foreground mb-6">{t('terms.txt3')}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">{t('terms.sec4')}</h3>
                    <p className="text-muted-foreground mb-6">{t('terms.txt4')}</p>

                    <h3 className="text-2xl font-bold mt-8 mb-4">{t('terms.sec5')}</h3>
                    <p className="text-muted-foreground mb-6">{t('terms.txt5')}</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
