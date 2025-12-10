import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface EventFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const EventForm = ({ onClose, onSuccess }: EventFormProps) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        title_en: "",
        description: "",
        description_en: "",
        date: "",
        type: "social",
        cover_image: "",
        gallery_images: [] as string[]
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'gallery') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setLoading(true);
        const uploadPromises = Array.from(files).map(async (file) => {
            return new Promise<string | null>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    try {
                        const base64 = reader.result as string;
                        const res = await fetch("/api/upload", {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                file: base64,
                                filename: `${Date.now()}-${file.name}`
                            })
                        });
                        const result = await res.json();
                        resolve(result.url);
                    } catch (err) {
                        console.error("Upload failed", err);
                        resolve(null);
                    }
                };
            });
        });

        const urls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];

        if (field === 'cover') {
            setFormData(prev => ({ ...prev, cover_image: urls[0] }));
        } else {
            setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...urls] }));
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-2xl mx-auto border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">إضافة فعالية جديدة</h2>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-semibold">عنوان الفعالية (عربي)</Label>
                        <Input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-semibold">Event Title (English)</Label>
                        <Input
                            value={formData.title_en}
                            onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                            className="text-left"
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">التاريخ</Label>
                    <Input
                        type="date"
                        required
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-semibold">الوصف (عربي)</Label>
                        <Textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="text-right h-32"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-900 font-semibold">Description (English)</Label>
                        <Textarea
                            value={formData.description_en}
                            onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                            className="text-left h-32"
                            dir="ltr"
                        />
                    </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">صورة الغلاف (رئيسية)</Label>
                    <div className="flex gap-4 items-center">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'cover')}
                            disabled={loading}
                        />
                        {formData.cover_image && (
                            <img src={formData.cover_image} className="w-16 h-16 rounded object-cover border" />
                        )}
                    </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2">
                    <Label className="text-gray-900 font-semibold">صور المعرض (متعددة)</Label>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'gallery')}
                            disabled={loading}
                            className="mb-2"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.gallery_images.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={url} className="w-20 h-20 rounded object-cover border" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, gallery_images: prev.gallery_images.filter((_, i) => i !== idx) }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
                    <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "حفظ الفعالية"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
