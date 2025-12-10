import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  value_ar: string | null;
}

const defaultSettings = [
  { key: 'company_name', label: 'اسم الشركة', label_en: 'Company Name' },
  { key: 'company_description', label: 'وصف الشركة', label_en: 'Company Description', multiline: true },
  { key: 'phone', label: 'رقم الهاتف', label_en: 'Phone' },
  { key: 'email', label: 'البريد الإلكتروني', label_en: 'Email' },
  { key: 'address', label: 'العنوان', label_en: 'Address', multiline: true },
  { key: 'facebook_url', label: 'فيسبوك', label_en: 'Facebook URL' },
  { key: 'linkedin_url', label: 'لينكد إن', label_en: 'LinkedIn URL' },
  { key: 'twitter_url', label: 'تويتر', label_en: 'Twitter URL' },
  { key: 'vision', label: 'الرؤية', label_en: 'Vision', multiline: true },
  { key: 'mission', label: 'الرسالة', label_en: 'Mission', multiline: true },
];

const SettingsManager = () => {
  const [settings, setSettings] = useState<Record<string, { value: string; value_ar: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحميل الإعدادات', variant: 'destructive' });
    } else {
      const settingsMap: Record<string, { value: string; value_ar: string }> = {};
      data?.forEach((s) => {
        settingsMap[s.key] = { value: s.value || '', value_ar: s.value_ar || '' };
      });
      // Initialize missing settings
      defaultSettings.forEach((s) => {
        if (!settingsMap[s.key]) {
          settingsMap[s.key] = { value: '', value_ar: '' };
        }
      });
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, field: 'value' | 'value_ar', newValue: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: newValue },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, values] of Object.entries(settings)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ key, value: values.value, value_ar: values.value_ar }, { onConflict: 'key' });
        
        if (error) throw error;
      }
      toast({ title: 'تم الحفظ', description: 'تم حفظ الإعدادات بنجاح' });
    } catch (error: any) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">إعدادات الموقع</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin ml-2" size={18} /> : <Save size={18} className="ml-2" />}
          حفظ التغييرات
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {defaultSettings.map((setting) => (
          <div key={setting.key} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{setting.label_en}</Label>
              {setting.multiline ? (
                <Textarea
                  value={settings[setting.key]?.value || ''}
                  onChange={(e) => handleChange(setting.key, 'value', e.target.value)}
                  placeholder={setting.label_en}
                  rows={3}
                  className="mt-1"
                />
              ) : (
                <Input
                  value={settings[setting.key]?.value || ''}
                  onChange={(e) => handleChange(setting.key, 'value', e.target.value)}
                  placeholder={setting.label_en}
                  className="mt-1"
                />
              )}
            </div>
            <div>
              <Label>{setting.label}</Label>
              {setting.multiline ? (
                <Textarea
                  value={settings[setting.key]?.value_ar || ''}
                  onChange={(e) => handleChange(setting.key, 'value_ar', e.target.value)}
                  placeholder={setting.label}
                  rows={3}
                  dir="rtl"
                  className="mt-1"
                />
              ) : (
                <Input
                  value={settings[setting.key]?.value_ar || ''}
                  onChange={(e) => handleChange(setting.key, 'value_ar', e.target.value)}
                  placeholder={setting.label}
                  dir="rtl"
                  className="mt-1"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsManager;
