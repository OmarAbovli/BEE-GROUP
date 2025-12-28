import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { BeeBackground } from "@/components/BeeBackground";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ProductDetails = () => {
    const { id } = useParams();
    const { language, t } = useLanguage();
    const { toast } = useToast();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Product not found");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                toast({ title: t('common.error'), description: "Product not found", variant: "destructive" });
            });
    }, [id, t, toast]);

    const getLocalized = (obj: any, field: string) => {
        if (!obj) return '';
        const enField = `${field}_en`;
        return language === 'en' && obj[enField] ? obj[enField] : obj[field];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
                <Link to="/products">
                    <Button>{t('nav.products')}</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            <SEO
                title={getLocalized(product, 'title')}
                description={getLocalized(product, 'description')}
                keywords={`${getLocalized(product, 'title')}, ${language === 'ar' ? 'أدوية, مجموعة بي' : 'pharmaceuticals, Bee Group'}`}
                image={product.image_url}
                type="product"
                schemaData={{
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": getLocalized(product, 'title'),
                    "image": product.image_url,
                    "description": getLocalized(product, 'description'),
                    "brand": {
                        "@type": "Brand",
                        "name": "Bee Group"
                    },
                    "offers": {
                        "@type": "Offer",
                        "url": window.location.href,
                        "availability": "https://schema.org/InStock"
                    }
                }}
            />
            <BeeBackground />
            <div className="bg-background pt-32 pb-20 container mx-auto px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-8 rounded-2xl bg-white"
                    >
                        <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-auto max-h-[500px] object-contain mx-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                        />
                    </motion.div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-primary mb-4">{getLocalized(product, 'title')}</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {getLocalized(product, 'description')}
                            </p>
                        </div>

                        {product.ingredients && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-r-4 border-primary pr-4 pl-4">{t('product.ingredients')}</h2>
                                <p className="text-muted-foreground whitespace-pre-line bg-muted/30 p-6 rounded-xl">
                                    {getLocalized(product, 'ingredients')}
                                </p>
                            </div>
                        )}

                        <div className="pt-6">
                            <Link to="/contact">
                                <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-gold hover:shadow-gold/50 transition-all">
                                    {t('products.orderNow')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
