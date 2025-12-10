import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Article {
  id: string;
  title: string;
  title_ar: string | null;
  content: string | null;
  content_ar: string | null;
  image_url: string | null;
  is_published: boolean | null;
  created_at: string;
}

const ArticlesManager = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    content: '',
    content_ar: '',
    image_url: '',
    is_published: false,
  });
  const { toast } = useToast();

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحميل المقالات', variant: 'destructive' });
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const openCreateDialog = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      title_ar: '',
      content: '',
      content_ar: '',
      image_url: '',
      is_published: false,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      title_ar: article.title_ar || '',
      content: article.content || '',
      content_ar: article.content_ar || '',
      image_url: article.image_url || '',
      is_published: article.is_published || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'خطأ', description: 'عنوان المقالة مطلوب', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(formData)
          .eq('id', editingArticle.id);

        if (error) throw error;
        toast({ title: 'تم التحديث', description: 'تم تحديث المقالة بنجاح' });
      } else {
        const { error } = await supabase.from('articles').insert(formData);
        if (error) throw error;
        toast({ title: 'تم الإضافة', description: 'تم إضافة المقالة بنجاح' });
      }
      setDialogOpen(false);
      fetchArticles();
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المقالة؟')) return;

    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف المقالة', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحذف', description: 'تم حذف المقالة بنجاح' });
      fetchArticles();
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">المقالات</h1>
        <Button onClick={openCreateDialog}>
          <Plus size={18} className="ml-2" />
          إضافة مقالة
        </Button>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.title} 
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{article.title}</h3>
              {article.title_ar && <p className="text-muted-foreground text-sm">{article.title_ar}</p>}
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {article.content || article.content_ar}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${article.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {article.is_published ? 'منشور' : 'مسودة'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(article.created_at).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={() => openEditDialog(article)}>
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(article.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          لا توجد مقالات بعد. أضف مقالتك الأولى!
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? 'تعديل المقالة' : 'إضافة مقالة جديدة'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>العنوان (إنجليزي)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article Title"
                />
              </div>
              <div>
                <Label>العنوان (عربي)</Label>
                <Input
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  placeholder="عنوان المقالة"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>المحتوى (إنجليزي)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Article content..."
                  rows={6}
                />
              </div>
              <div>
                <Label>المحتوى (عربي)</Label>
                <Textarea
                  value={formData.content_ar}
                  onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                  placeholder="محتوى المقالة..."
                  dir="rtl"
                  rows={6}
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

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
              />
              <Label>نشر المقالة</Label>
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

export default ArticlesManager;
