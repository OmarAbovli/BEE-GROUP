import { useEffect, useState } from 'react';
// import '@google/model-viewer';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Activity, ShieldCheck, Clock, AlertTriangle, Pill, Stethoscope, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ProductDetail {
    id: number;
    title: string;
    description: string;
    image_url: string;
    categoryName: string;
    ingredients: string;
    usage_instructions: string;
    indications: string;
    side_effects: string;
    age_range: string;
    is_prescription: string; // "true" | "false"
    warning: string;
    model_path?: string;
}

const TiltCard = ({ imageUrl }: { imageUrl: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-md mx-auto aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center p-8 cursor-pointer group perspective-1000"
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: "translateZ(0px)" }}
            />

            <motion.div
                style={{ transform: "translateZ(50px)" }}
                className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-2xl"
            >
                <img
                    src={imageUrl}
                    alt="Product 3D View"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                />
            </motion.div>

            {/* Floating Elements for Depth */}
            <motion.div
                style={{ transform: "translateZ(80px)" }}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-primary/20"
            >
                3D View
            </motion.div>
        </motion.div>
    );
};

const ProductDetails = () => {
    const { id } = useParams();
    const { language, t } = useLanguage();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch product", err);
                setLoading(false);
            });
    }, [id]);

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
                    <Button>{t('common.back')}</Button>
                </Link>
            </div>
        );
    }

    // Helper to get localized content
    const getLocalized = (key: keyof ProductDetail) => {
        if (language === 'en') {
            const enKey = `${key}_en` as keyof ProductDetail;
            return product[enKey] || product[key];
        }
        return product[key];
    };

    const isPrescription = product.is_prescription === 'true';

    return (
        <div className="min-h-screen bg-background text-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 mb-8">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link>
                        <ChevronRight className={`w-4 h-4 mx-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <Link to="/products" className="hover:text-primary transition-colors">{t('nav.products')}</Link>
                        <ChevronRight className={`w-4 h-4 mx-2 ${language === 'ar' ? 'rotate-180' : ''}`} />
                        <span className="text-foreground font-medium">{getLocalized('title')}</span>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                        {/* Left Column: 3D Image */}
                        <div className="relative">
                            <TiltCard imageUrl={product.image_url} />
                            <div className="text-center mt-6 text-sm text-muted-foreground animate-pulse">
                                {t('products.mouseHover')}
                            </div>
                        </div>

                        {/* Right Column: Key Info */}
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1 text-sm">
                                        {product.categoryName}
                                    </Badge>
                                    {isPrescription && (
                                        <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                                            {t('products.prescription')}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight leading-tight">
                                    {getLocalized('title')}
                                </h1>
                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {getLocalized('description')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                                        <Activity className="w-5 h-5" />
                                        <span>{t('products.ageRange')}</span>
                                    </div>
                                    <p className="text-sm opacity-90">{getLocalized('age_range')}</p>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-xl border border-border/50">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                                        <ShieldCheck className="w-5 h-5" />
                                        <span>{t('products.safety')}</span>
                                    </div>
                                    <p className="text-sm opacity-90">Health Ministry Approved</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Information Tabs */}
                    <div className="mt-24 max-w-5xl mx-auto">
                        <Tabs defaultValue="indications" className="w-full">
                            <TabsList className="w-full justify-start h-auto p-1 bg-secondary/30 rounded-2xl mb-8 flex-wrap">
                                <TabsTrigger value="indications" className="flex-1 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    <Stethoscope className="w-4 h-4 mx-2" />
                                    {t('products.indications')}
                                </TabsTrigger>
                                <TabsTrigger value="ingredients" className="flex-1 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    <Pill className="w-4 h-4 mx-2" />
                                    {t('products.ingredients')}
                                </TabsTrigger>
                                <TabsTrigger value="usage" className="flex-1 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300">
                                    <Clock className="w-4 h-4 mx-2" />
                                    {t('products.usage')}
                                </TabsTrigger>
                                <TabsTrigger value="warnings" className="flex-1 rounded-xl py-3 data-[state=active]:bg-white data-[state=active]:text-destructive data-[state=active]:bg-red-50 transition-all duration-300">
                                    <AlertTriangle className="w-4 h-4 mx-2" />
                                    {t('products.warnings')}
                                </TabsTrigger>
                            </TabsList>

                            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-border/50 shadow-sm min-h-[300px]">
                                <TabsContent value="indications" className="mt-0 space-y-4">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                                        {t('products.indications')}
                                    </h3>
                                    <p className="text-lg leading-relaxed text-foreground/80">
                                        {getLocalized('indications')}
                                    </p>
                                </TabsContent>

                                <TabsContent value="ingredients" className="mt-0">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                        {t('products.ingredients')}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {getLocalized('ingredients')?.split(',').map((ing, i) => (
                                            <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium">
                                                {ing.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="usage" className="mt-0">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                        {t('products.usage')}
                                    </h3>
                                    <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100/50">
                                        <p className="text-lg leading-relaxed text-foreground/90">
                                            {getLocalized('usage_instructions')}
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="warnings" className="mt-0 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-3 text-red-600 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            {t('products.warnings')}
                                        </h3>
                                        <p className="text-red-700/90 bg-red-50 p-4 rounded-xl border border-red-100">
                                            {getLocalized('warning')}
                                        </p>
                                    </div>
                                    {product.side_effects && (
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-orange-600"> {t('products.sideEffects')}</h3>
                                            <p className="text-orange-900/80 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                                {getLocalized('side_effects')}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </main >
            <Footer />
        </div >
    );
};

export default ProductDetails;
