import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Banner {
  id: string;
  title: string | null;
  title_ar: string | null;
  subtitle: string | null;
  subtitle_ar: string | null;
  image_url: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const BannersManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    subtitle: '',
    subtitle_ar: '',
    image_url: '',
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحميل البانرات', variant: 'destructive' });
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateDialog = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      title_ar: '',
      subtitle: '',
      subtitle_ar: '',
      image_url: '',
      is_active: true,
      sort_order: banners.length,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      title_ar: banner.title_ar || '',
      subtitle: banner.subtitle || '',
      subtitle_ar: banner.subtitle_ar || '',
      image_url: banner.image_url || '',
      is_active: banner.is_active ?? true,
      sort_order: banner.sort_order || 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingBanner) {
        const { error } = await supabase
          .from('hero_banners')
          .update(formData)
          .eq('id', editingBanner.id);

        if (error) throw error;
        toast({ title: 'تم التحديث', description: 'تم تحديث البانر بنجاح' });
      } else {
        const { error } = await supabase.from('hero_banners').insert(formData);
        if (error) throw error;
        toast({ title: 'تم الإضافة', description: 'تم إضافة البانر بنجاح' });
      }
      setDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البانر؟')) return;

    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف البانر', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحذف', description: 'تم حذف البانر بنجاح' });
      fetchBanners();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">البانرات</h1>
        <Button onClick={openCreateDialog}>
          <Plus size={18} className="ml-2" />
          إضافة بانر
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-card border border-border rounded-xl overflow-hidden flex">
            {banner.image_url && (
              <img 
                src={banner.image_url} 
                alt={banner.title || 'Banner'} 
                className="w-48 h-32 object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{banner.title || banner.title_ar || 'بانر بدون عنوان'}</h3>
                {banner.subtitle && <p className="text-muted-foreground text-sm">{banner.subtitle}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${banner.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {banner.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                  <span className="text-xs text-muted-foreground">ترتيب: {banner.sort_order}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(banner)}>
                  <Pencil size={14} />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(banner.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد بانرات بعد. أضف أول بانر!
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'تعديل البانر' : 'إضافة بانر جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>العنوان (إنجليزي)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Banner Title"
                />
              </div>
              <div>
                <Label>العنوان (عربي)</Label>
                <Input
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="عنوان البانر"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>العنوان الفرعي (إنجليزي)</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Subtitle"
                />
              </div>
              <div>
                <Label>العنوان الفرعي (عربي)</Label>
                <Input
                  value={formData.subtitle_ar}
                  onChange={(e) => setFormData({ ...formData, subtitle_ar: e.target.value })}
                  placeholder="العنوان الفرعي"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <Label>رابط الصورة</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الترتيب</Label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>نشط</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="animate-spin ml-2" size={18} />}
                حفظ
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BannersManager;
