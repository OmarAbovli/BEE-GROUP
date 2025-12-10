import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFormProps {
    initialData?: any;
    existingProduct?: any;
    onClose?: () => void;
    onSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, existingProduct, onSuccess, onClose }) => {
    const dataToUse = initialData || existingProduct;

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        category_id: 1,
        ingredients: '',
        ingredients_en: '',
        usage_instructions: '',
        usage_instructions_en: '',
        indications: '',
        indications_en: '',
        side_effects: '',
        side_effects_en: '',
        age_range: '',
        age_range_en: '',
        is_prescription: 'false',
        warning: '',
        warning_en: '',
        image_url: '',
        model_path: ''
    });

    useEffect(() => {
        if (dataToUse) {
            setFormData({
                title: dataToUse.title || '',
                title_en: dataToUse.title_en || '',
                description: dataToUse.description || '',
                description_en: dataToUse.description_en || '',
                category_id: dataToUse.category_id || 1,
                ingredients: dataToUse.ingredients || '',
                ingredients_en: dataToUse.ingredients_en || '',
                usage_instructions: dataToUse.usage_instructions || '',
                usage_instructions_en: dataToUse.usage_instructions_en || '',
                indications: dataToUse.indications || '',
                indications_en: dataToUse.indications_en || '',
                side_effects: dataToUse.side_effects || '',
                side_effects_en: dataToUse.side_effects_en || '',
                age_range: dataToUse.age_range || '',
                age_range_en: dataToUse.age_range_en || '',
                is_prescription: dataToUse.is_prescription || 'false',
                warning: dataToUse.warning || '',
                warning_en: dataToUse.warning_en || '',
                image_url: dataToUse.image_url || '',
                model_path: dataToUse.model_path || ''
            });
        }
    }, [dataToUse]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'model_path') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;

                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: base64,
                        filename: `${Date.now()}-${file.name}`
                    })
                });

                const data = await res.json();
                setFormData(prev => ({ ...prev, [field]: data.url }));
            };
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const url = dataToUse
            ? `/api/products?id=${dataToUse.id}`
            : '/api/products';
        const method = dataToUse ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
                if (onClose) onClose();
            } else {
                alert('Error saving product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm" dir="rtl">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{dataToUse ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
                {onClose && <Button type="button" variant="ghost" onClick={onClose}>إغلاق</Button>}
            </div>

            <Tabs defaultValue="arabic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="arabic">العربية</TabsTrigger>
                    <TabsTrigger value="english">English</TabsTrigger>
                </TabsList>

                <TabsContent value="arabic" className="space-y-4">
                    <div className="space-y-2">
                        <Label>اسم المنتج</Label>
                        <Input name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label>الوصف</Label>
                        <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>المكونات</Label>
                        <Textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>الجرعة وطريقة الاستخدام</Label>
                        <Textarea name="usage_instructions" value={formData.usage_instructions} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>دواعي الاستعمال</Label>
                        <Textarea name="indications" value={formData.indications} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>الأعراض الجانبية</Label>
                        <Textarea name="side_effects" value={formData.side_effects} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>تحذيرات</Label>
                        <Textarea name="warning" value={formData.warning} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>الفئة العمرية</Label>
                        <Input name="age_range" value={formData.age_range} onChange={handleInputChange} />
                    </div>
                </TabsContent>

                <TabsContent value="english" className="space-y-4" dir="ltr">
                    <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input name="title_en" value={formData.title_en} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description_en" value={formData.description_en} onChange={handleInputChange} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>Ingredients</Label>
                        <Textarea name="ingredients_en" value={formData.ingredients_en} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Usage Instructions</Label>
                        <Textarea name="usage_instructions_en" value={formData.usage_instructions_en} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Indications</Label>
                        <Textarea name="indications_en" value={formData.indications_en} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Side Effects</Label>
                        <Textarea name="side_effects_en" value={formData.side_effects_en} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Warnings</Label>
                        <Textarea name="warning_en" value={formData.warning_en} onChange={handleInputChange} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label>Age Range</Label>
                        <Input name="age_range_en" value={formData.age_range_en} onChange={handleInputChange} />
                    </div>
                </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t mt-4">
                <div className="space-y-2">
                    <Label>الفئة (Category)</Label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                        <option value={1}>شراب (Syrups)</option>
                        <option value={2}>أقراص (Tablets)</option>
                        <option value={3}>دهانات (Creams & Gels)</option>
                        <option value={4}>بخاخ (Sprays)</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label>هل يحتاج روشتة؟</Label>
                    <select
                        name="is_prescription"
                        value={formData.is_prescription}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="false">لا (OTC)</option>
                        <option value="true">نعم (Rx)</option>
                    </select>
                </div>

                {/* File Uploads */}
                <div className="space-y-2">
                    <Label>صورة المنتج</Label>
                    <div className="flex items-center gap-4">
                        <div className="border p-2 rounded w-24 h-24 flex items-center justify-center bg-gray-50">
                            {formData.image_url ? (
                                <img src={formData.image_url} alt="Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center">No Image</span>
                            )}
                        </div>
                        <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')} />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>موديل 3D (.glb)</Label>
                    <div className="flex items-center gap-4">
                        <div className="border p-2 rounded w-full bg-gray-50 text-xs text-gray-500 truncate">
                            {formData.model_path || "No 3D Model Uploaded"}
                        </div>
                        <Input type="file" accept=".glb,.gltf" onChange={(e) => handleFileUpload(e, 'model_path')} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {dataToUse ? 'حفظ التعديلات' : 'إضافة المنتج'}
                </Button>
            </div>
        </form>
    );
};
