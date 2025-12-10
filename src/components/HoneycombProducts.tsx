import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    description: string;
    image_url: string;
    categoryName: string;
}

interface HoneycombProductsProps {
    products: Product[];
}

export const HoneycombProducts = ({ products }: HoneycombProductsProps) => {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
        <div className="relative py-20 min-h-[800px] flex items-center justify-center bg-gradient-to-b from-transparent to-primary/5">

            {/* The Honeycomb Grid */}
            <div className="honeycomb-grid max-w-7xl mx-auto px-4 perspective-1000">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        layoutId={`card-container-${product.id}`}
                        onClick={() => setSelectedId(product.id)}
                        className="honeycomb-cell cursor-none group"
                        whileHover={{ scale: 1.05, zIndex: 20 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="w-full h-full clip-hex bg-white shadow-lg border-4 border-primary/10 group-hover:border-primary/50 transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <motion.img
                                src={product.image_url!}
                                alt={product.title}
                                layoutId={`product-image-${product.id}`}
                                className="w-32 h-32 object-contain mb-4 z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.svg'}
                            />

                            <motion.h3
                                layoutId={`product-title-${product.id}`}
                                className="font-bold text-gray-800 z-10 text-sm md:text-base px-2"
                            >
                                {product.title}
                            </motion.h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Expanded Overlay */}
            <AnimatePresence>
                {selectedId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedId(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto cursor-none"
                        />

                        {/* Expanded Card */}
                        <motion.div
                            layoutId={`card-container-${selectedId}`}
                            className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl relative pointer-events-auto cursor-none z-50 flex flex-col md:flex-row"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-800" />
                            </button>

                            {(() => {
                                const product = products.find(p => p.id === selectedId)!;
                                return (
                                    <>
                                        {/* Left (Image) */}
                                        <div className="w-full md:w-1/2 bg-gradient-to-br from-secondary/50 to-primary/10 p-10 flex items-center justify-center relative overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('/honeycomb-pattern.svg')] opacity-5" />
                                            <motion.img
                                                layoutId={`product-image-${product.id}`}
                                                src={product.image_url}
                                                alt={product.title}
                                                className="w-full h-full object-contain filter drop-shadow-xl"
                                            />
                                        </div>

                                        {/* Right (Content) */}
                                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-right">
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                                                    {product.categoryName || "منتج مميز"}
                                                </span>
                                                <motion.h2
                                                    layoutId={`product-title-${product.id}`}
                                                    className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
                                                >
                                                    {product.title}
                                                </motion.h2>
                                                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                                    {product.description}
                                                </p>

                                                <div className="flex gap-4 justify-end">
                                                    <Link to={`/products/${product.id}`}>
                                                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                                                            عرض التفاصيل الكاملة
                                                            <ArrowRight className="mr-2 w-4 h-4 rotate-180" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
