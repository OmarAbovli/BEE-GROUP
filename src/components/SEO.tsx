import React from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/context/LanguageContext";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    schemaData?: object;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = "/og-image.jpg",
    url = "https://beegroup-eg.com",
    type = "website",
    schemaData
}) => {
    const { language, t } = useLanguage();

    // Default values based on language
    const defaultTitle = t('nav.home') + " | Bee Group";
    const defaultDesc = language === 'ar'
        ? "مجموعة بي هي شركة رائدة في توزيع المستحضرات الصيدلانية ومنتجات الرعاية الصحية عالية الجودة في مصر والشرق الأوسط."
        : "Bee Group is a leading distributor of high-quality pharmaceutical and healthcare products in Egypt and the Middle East.";

    const finalTitle = title ? (title.includes("Bee Group") ? title : `${title} | Bee Group`) : defaultTitle;
    const finalDesc = description || defaultDesc;
    const finalKeywords = keywords || (language === 'ar'
        ? "أدوية, رعاية صحية, مجموعة بي, مصر, توزيع أدوية"
        : "pharmaceuticals, healthcare, bee group, egypt, medicine distribution");

    return (
        <Helmet>
            {/* Standard HTML Tags */}
            <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
            <title>{finalTitle}</title>
            <meta name="title" content={finalTitle} />
            <meta name="description" content={finalDesc} />
            <meta name="keywords" content={finalKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content={language === 'ar' ? 'ar_EG' : 'en_US'} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={finalTitle} />
            <meta property="twitter:description" content={finalDesc} />
            <meta property="twitter:image" content={image} />

            {/* Language Alternates */}
            <link rel="alternate" hrefLang="ar" href={`${url}?lang=ar`} />
            <link rel="alternate" hrefLang="en" href={`${url}?lang=en`} />
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Structured Data (JSON-LD) */}
            {schemaData && (
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            )}
        </Helmet>
    );
};
