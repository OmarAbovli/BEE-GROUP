import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean | null;
  sort_order: number | null;
}

const PartnersManager = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    sort_order: 0,
  });
  const { toast } = useToast();

  const fetchPartners = async () => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحميل الشركاء', variant: 'destructive' });
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const openCreateDialog = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      logo_url: '',
      website_url: '',
      is_active: true,
      sort_order: partners.length,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      is_active: partner.is_active ?? true,
      sort_order: partner.sort_order || 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'خطأ', description: 'اسم الشريك مطلوب', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingPartner) {
        const { error } = await supabase
          .from('partners')
          .update(formData)
          .eq('id', editingPartner.id);

        if (error) throw error;
        toast({ title: 'تم التحديث', description: 'تم تحديث الشريك بنجاح' });
      } else {
        const { error } = await supabase.from('partners').insert(formData);
        if (error) throw error;
        toast({ title: 'تم الإضافة', description: 'تم إضافة الشريك بنجاح' });
      }
      setDialogOpen(false);
      fetchPartners();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الشريك؟')) return;

    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف الشريك', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحذف', description: 'تم حذف الشريك بنجاح' });
      fetchPartners();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">الشركاء</h1>
        <Button onClick={openCreateDialog}>
          <Plus size={18} className="ml-2" />
          إضافة شريك
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-card border border-border rounded-xl p-4 text-center">
            {partner.logo_url ? (
              <img 
                src={partner.logo_url} 
                alt={partner.name} 
                className="w-20 h-20 object-contain mx-auto mb-3"
              />
            ) : (
              <div className="w-20 h-20 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  {partner.name.charAt(0)}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-foreground text-sm">{partner.name}</h3>
            <span className={`text-xs px-2 py-1 rounded inline-block mt-2 ${partner.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
              {partner.is_active ? 'نشط' : 'غير نشط'}
            </span>
            <div className="flex justify-center gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => openEditDialog(partner)}>
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(partner.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا يوجد شركاء بعد. أضف أول شريك!
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPartner ? 'تعديل الشريك' : 'إضافة شريك جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>اسم الشريك</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="اسم الشركة"
              />
            </div>

            <div>
              <Label>رابط الشعار</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>رابط الموقع (اختياري)</Label>
              <Input
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
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

export default PartnersManager;
