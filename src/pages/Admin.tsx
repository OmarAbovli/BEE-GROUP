import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  Users,
  Image,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductsManager from '@/components/admin/ProductsManager';
import ArticlesManager from '@/components/admin/ArticlesManager';
import BannersManager from '@/components/admin/BannersManager';
import PartnersManager from '@/components/admin/PartnersManager';
import SettingsManager from '@/components/admin/SettingsManager';
import DashboardOverview from '@/components/admin/DashboardOverview';

type Tab = 'dashboard' | 'products' | 'articles' | 'banners' | 'partners' | 'settings';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    // Optional: Verify token with backend here if needed, or decode it
    // For now, simple existence check
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({ title: 'تم تسجيل الخروج' });
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard' as Tab, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'المنتجات', icon: Package },
    { id: 'articles' as Tab, label: 'المقالات', icon: FileText },
    { id: 'banners' as Tab, label: 'البانرات', icon: Image },
    { id: 'partners' as Tab, label: 'الشركاء', icon: Users },
    { id: 'settings' as Tab, label: 'الإعدادات', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManager />;
      case 'articles':
        return <ArticlesManager />;
      case 'banners':
        return <BannersManager />;
      case 'partners':
        return <PartnersManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-card rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-40 w-64 bg-card border-l border-border
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Bee Group</h1>
            <p className="text-sm text-muted-foreground">لوحة التحكم</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'}
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="mb-4 px-4">
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut size={18} className="ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
