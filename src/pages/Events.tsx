import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventTimeline } from "@/components/EventTimeline";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language, t } = useLanguage();

    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Page Header */}
            <div className="relative pt-32 pb-20 text-center">
                <div className="absolute top-0 inset-x-0 h-96 bg-primary/5 blur-3xl -z-10" />
                <h1 className="text-4xl md:text-7xl font-bold mb-6 text-primary drop-shadow-sm">{t('events.title')}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                    {t('events.subtitle')}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <EventTimeline events={events} />
            )}

            <Footer />
        </div>
    );
}
