import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export const ContactForm = () => {
    const { t } = useLanguage();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    message: formData.message,
                    phone: ""
                })
            });
            toast({ title: t('common.success'), description: t('contact.messageSent') });
            setFormData({ firstName: "", lastName: "", email: "", message: "" });
        } catch (error) {
            toast({ title: t('common.error'), description: "Failed to send message", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.firstName')}</label>
                    <Input placeholder={t('contact.firstName')} value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('contact.lastName')}</label>
                    <Input placeholder={t('contact.lastName')} value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t('contact.email')}</label>
                <Input type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">{t('contact.message')}</label>
                <Textarea className="min-h-[150px]" placeholder={t('contact.message')} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} required />
            </div>

            <Button className="w-full text-lg" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('contact.send')}
            </Button>
        </form>
    );
};
