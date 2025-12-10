import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { HoneycombProducts } from "./HoneycombProducts";

interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string;
  categoryName: string;
}

export const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Flatten the grouped object into an array for the slider/grid
        const allProducts = Object.values(data).flat() as Product[];

        setProducts(allProducts.slice(0, 7)); // Show 7 products for a nice honeycomb cluster
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary font-semibold tracking-wider uppercase"
          >
            منتجاتنا
          </motion.span>
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mt-4 mb-6"
          >
            حلول فعالة من الطبيعة
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            نقدم مجموعة متنوعة من المنتجات الدوائية والمكملات الغذائية ومستحضرات التجميل عالية الجودة.
          </motion.p>
        </div>

        <div className="mb-20">
          <HoneycombProducts products={products} />
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button size="lg" className="group">
              عرض كل المنتجات
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
