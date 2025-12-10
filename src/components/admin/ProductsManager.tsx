import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
  category: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
}

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    image_url: '',
    category: '',
    is_featured: false,
    is_active: true,
  });
  const { toast } = useToast();

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحميل المنتجات', variant: 'destructive' });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      image_url: '',
      category: '',
      is_featured: false,
      is_active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_ar: product.name_ar || '',
      description: product.description || '',
      description_ar: product.description_ar || '',
      image_url: product.image_url || '',
      category: product.category || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'خطأ', description: 'اسم المنتج مطلوب', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast({ title: 'تم التحديث', description: 'تم تحديث المنتج بنجاح' });
      } else {
        const { error } = await supabase.from('products').insert(formData);
        if (error) throw error;
        toast({ title: 'تم الإضافة', description: 'تم إضافة المنتج بنجاح' });
      }
      setDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف المنتج', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحذف', description: 'تم حذف المنتج بنجاح' });
      fetchProducts();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">المنتجات</h1>
        <Button onClick={openCreateDialog}>
          <Plus size={18} className="ml-2" />
          إضافة منتج
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              {product.name_ar && <p className="text-muted-foreground text-sm">{product.name_ar}</p>}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${product.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {product.is_active ? 'نشط' : 'غير نشط'}
                </span>
                {product.is_featured && (
                  <span className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-500">مميز</span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                  <Pencil size={14} className="ml-1" />
                  تعديل
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                  <Trash2 size={14} className="ml-1" />
                  حذف
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد منتجات بعد. أضف منتجك الأول!
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الاسم (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product Name"
                />
              </div>
              <div>
                <Label>الاسم (عربي)</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  placeholder="اسم المنتج"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الوصف (إنجليزي)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div>
                <Label>الوصف (عربي)</Label>
                <Textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  placeholder="وصف المنتج"
                  dir="rtl"
                  rows={3}
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

            <div>
              <Label>الفئة</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="مثال: أدوية، مكملات..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>نشط</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label>مميز</Label>
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

export default ProductsManager;
