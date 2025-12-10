import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface Product {
    id: number;
    title: string;
    description: string;
    image_url: string;
    // Add optional English fields
    title_en?: string;
    description_en?: string;
}

interface ProductGroup {
    [category: string]: Product[];
}

const Products = () => {
    const [products, setProducts] = useState<ProductGroup>({});
    const [loading, setLoading] = useState(true);
    const { language, t } = useLanguage();

    useEffect(() => {
        fetch('/api/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                if (typeof data !== 'object' || data === null) {
                    throw new Error('Invalid data format');
                }
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch products', err);
                setProducts({});
                setLoading(false);
            });
    }, []);

    const getLocalized = (item: any, key: string) => {
        if (language === 'en') {
            return item[`${key}_en`] || item[key];
        }
        return item[key];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />
            <div className="pt-24 pb-12 container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12 text-primary">{t('products.title')}</h1>
                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{t('products.subtitle')}</p>

                {Object.keys(products).length === 0 ? (
                    <p className="text-center text-muted-foreground">{t('common.loading')}</p>
                ) : (
                    Object.entries(products).map(([category, items], idx) => (
                        <div key={category} className="mb-16">
                            <h2 className="text-2xl font-bold mb-6 border-r-4 border-primary pr-4 pl-4">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <Link to={`/products/${product.id}`} className="block h-full cursor-pointer">
                                            <div className="h-48 overflow-hidden bg-white p-4 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                                                <img
                                                    src={product.image_url}
                                                    alt={product.title}
                                                    className="h-full object-contain"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {getLocalized(product, 'title')}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                                    {getLocalized(product, 'description')}
                                                </p>
                                                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
                                                    {t('products.viewDetails')}
                                                </Button>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Products;
