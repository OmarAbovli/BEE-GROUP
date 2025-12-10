import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    description: string;
    image_url: string;
    categoryName: string;
}

interface FeaturedProductCarouselProps {
    products: Product[];
}

export const FeaturedProductCarousel = ({ products }: FeaturedProductCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && products.length > 0) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % products.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, products.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsPlaying(false); // Pause on manual interaction
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        setIsPlaying(false);
    };

    if (products.length === 0) return null;

    const currentProduct = products[currentIndex];

    return (
        <div className="relative w-full max-w-6xl mx-auto min-h-[600px] flex items-center justify-center py-12">
            {/* Navigation Buttons */}
            <div className="absolute inset-0 flex items-center justify-between z-20 pointer-events-none px-4 md:px-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-white/20 text-primary rounded-full w-12 h-12"
                    onClick={handlePrev}
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="pointer-events-auto bg-white/10 backdrop-blur-md hover:bg-white/20 text-primary rounded-full w-12 h-12"
                    onClick={handleNext}
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full px-8 md:px-16">

                {/* Text Content */}
                <div className="order-2 md:order-1 text-right space-y-6 z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProduct.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
                            >
                                {currentProduct.categoryName || "منتج مميز"}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-bold text-slate-800 leading-tight mb-4"
                            >
                                {currentProduct.title}
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-muted-foreground leading-relaxed max-w-md ml-auto"
                            >
                                {currentProduct.description}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pt-6 flex gap-4 justify-end"
                            >
                                <Link to={`/products/${currentProduct.id}`}>
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-8">
                                        عرض التفاصيل
                                        <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Product Image */}
                <div className="order-1 md:order-2 relative h-[400px] md:h-[500px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-[3rem] rotate-3 blur-3xl" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentProduct.id}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 1.1, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="relative z-10 w-full h-full flex items-center justify-center p-8"
                        >
                            <img
                                src={currentProduct.image_url}
                                alt={currentProduct.title}
                                className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                                onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.svg'}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>

            {/* Progress/Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 text-primary/50 hover:text-primary transition-colors">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex gap-2">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setCurrentIndex(idx); setIsPlaying(false); }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-primary/20 hover:bg-primary/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
