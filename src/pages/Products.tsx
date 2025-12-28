import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoneycombProducts } from "@/components/HoneycombProducts";
import { BeeBackground } from "@/components/BeeBackground";
import { SEO } from "@/components/SEO";
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
    const [searchQuery, setSearchQuery] = useState("");
    const { language, t } = useLanguage();

    useEffect(() => {
        // Simulate a slight delay to show off the skeleton loading
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

    // --- Smart Search Logic ---
    const arToEnMap: { [key: string]: string } = {
        'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't', 'غ': 'y', 'ع': 'u', 'ه': 'i', 'خ': 'o', 'ح': 'p', 'ج': '[', 'د': ']',
        'ش': 'a', 'س': 's', 'ي': 'd', 'ب': 'f', 'ل': 'g', 'ا': 'h', 'ت': 'j', 'ن': 'k', 'م': 'l', 'ك': ';', 'ط': '\'',
        'ئ': 'z', 'ء': 'x', 'ؤ': 'c', 'ر': 'v', 'لا': 'b', 'ى': 'n', 'ة': 'm', 'و': ',', 'ز': '.', 'ظ': '/'
    };
    const enToArMap: { [key: string]: string } = Object.entries(arToEnMap).reduce((acc, [k, v]) => ({ ...acc, [v]: k }), {});

    const switchKeyboardLayout = (str: string): string => {
        return str.split('').map(char => {
            if (arToEnMap[char]) return arToEnMap[char];
            if (enToArMap[char.toLowerCase()]) return enToArMap[char.toLowerCase()];
            return char;
        }).join('');
    };

    // Normalizes strings for simpler comparison (removes diacritics, unification of alefs, etc.)
    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ي/g, 'ى');
    };

    // Filter products based on search query
    const filteredProducts = Object.entries(products).reduce((acc, [category, items]) => {
        const query = searchQuery.trim();
        if (!query) {
            acc[category] = items;
            return acc;
        }

        const normalizedQuery = normalizeText(query);
        const switchedQuery = normalizeText(switchKeyboardLayout(query));

        const filteredItems = items.filter(product => {
            const title = normalizeText(getLocalized(product, 'title') || '');
            const desc = normalizeText(getLocalized(product, 'description') || '');

            // Allow matching against:
            // 1. Exact query
            // 2. Switched keyboard layout query (e.g. user typed 'ghdj' for 'لايت')
            const matchesOriginal = title.includes(normalizedQuery) || desc.includes(normalizedQuery);
            const matchesSwitched = title.includes(switchedQuery) || desc.includes(switchedQuery);

            return matchesOriginal || matchesSwitched;
        });

        if (filteredItems.length > 0) {
            acc[category] = filteredItems;
        }
        return acc;
    }, {} as ProductGroup);

    return (
        <div className="min-h-screen relative">
            <SEO
                title={t('nav.products')}
                description={language === 'ar'
                    ? "استكشف مجموعة واسعة من المنتجات الصيدلانية والرعاية الصحية عالية الجودة من مجموعة بي."
                    : "Explore a wide range of high-quality pharmaceutical and healthcare products from Bee Group."}
            />
            <BeeBackground />
            <div className="bg-background pt-24 pb-12 container mx-auto px-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <h1 className="text-4xl font-bold text-center mb-6 text-primary">{t('products.title')}</h1>
                <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">{t('products.subtitle')}</p>

                {/* Search Bar */}
                <div className="max-w-md mx-auto mb-16 relative">
                    <Search className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
                    <Input
                        type="text"
                        placeholder={t('search.placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-10 h-12 text-lg rounded-full border-2 border-primary/20 focus:border-primary bg-background text-foreground shadow-sm hover:border-primary/50 transition-colors ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                    />
                </div>

                {loading ? (
                    <div className="space-y-16">
                        {[1, 2].map((categorySkeleton) => (
                            <div key={categorySkeleton}>
                                <Skeleton className="h-8 w-48 mb-6 rounded-lg" />
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((itemSkeleton) => (
                                        <div key={itemSkeleton} className="space-y-4">
                                            <Skeleton className="h-64 w-full rounded-xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-3/4" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    Object.keys(filteredProducts).length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-muted-foreground">
                                {searchQuery ? t('search.noResults') : t('common.loading')}
                            </p>
                        </div>
                    ) : (
                        Object.entries(filteredProducts).map(([category, items]) => (
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
                                                <div className="h-64 overflow-hidden bg-white p-6 flex items-center justify-center relative group">
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.title}
                                                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                        {getLocalized(product, 'title')}
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 h-[60px]">
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
                    )
                )}
            </div>
        </div>
    );
};

export default Products;
