import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Package, FileText, Image, Users } from 'lucide-react';

interface Stats {
  products: number;
  articles: number;
  banners: number;
  partners: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<Stats>({ products: 0, articles: 0, banners: 0, partners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [products, articles, banners, partners] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('hero_banners').select('id', { count: 'exact', head: true }),
        supabase.from('partners').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: products.count || 0,
        articles: articles.count || 0,
        banners: banners.count || 0,
        partners: partners.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'المنتجات', value: stats.products, icon: Package, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'المقالات', value: stats.articles, icon: FileText, color: 'bg-green-500/10 text-green-500' },
    { label: 'البانرات', value: stats.banners, icon: Image, color: 'bg-purple-500/10 text-purple-500' },
    { label: 'الشركاء', value: stats.partners, icon: Users, color: 'bg-amber-500/10 text-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">مرحباً بك في لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">دليل سريع</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>• <strong>المنتجات:</strong> أضف وعدّل منتجات الشركة</p>
          <p>• <strong>المقالات:</strong> أنشر مقالات ومحتوى جديد</p>
          <p>• <strong>البانرات:</strong> تحكم في صور الصفحة الرئيسية</p>
          <p>• <strong>الشركاء:</strong> أضف شعارات الشركاء</p>
          <p>• <strong>الإعدادات:</strong> عدّل معلومات الموقع</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
