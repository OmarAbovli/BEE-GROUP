import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { X, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    cover_image: string;
    gallery_images?: string[];
    type: string;
    title_en?: string;
    description_en?: string;
}

interface EventTimelineProps {
    events: Event[];
}

export const EventTimeline = ({ events }: EventTimelineProps) => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const { language, t } = useLanguage();

    const getLocalized = (item: Event, key: keyof Event) => {
        if (language === 'en') {
            const enKey = `${key}_en` as keyof Event;
            return item[enKey] || item[key];
        }
        return item[key];
    };

    return (
        <div className="relative max-w-5xl mx-auto py-20 px-4">

            {/* The Golden Line */}
            <div className="absolute left-4 md:left-1/2 top-20 bottom-20 w-1 bg-gradient-to-b from-primary/20 via-primary to-primary/20 -translate-x-1/2 hidden md:block" />

            {events.map((event, index) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row gap-8 mb-24 items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                        }`}
                >
                    {/* The Honeycomb Node (Center) */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-black border-4 border-primary rounded-full z-10 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                        <div className="w-4 h-4 bg-primary rounded-full" />
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right">
                        <div className={`p-6 glass-card rounded-2xl border-l-4 md:border-l-0 md:border-r-4 border-primary hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] transition-shadow duration-300 ${index % 2 === 0 ? "md:text-left md:border-r-0 md:border-l-4" : ""
                            }`}>
                            <div className="flex items-center gap-2 text-primary mb-2 text-sm justify-end md:justify-start">
                                <span>{new Date(event.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</span>
                                <Calendar className="w-4 h-4" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{getLocalized(event, 'title')}</h3>
                            <p className="text-muted-foreground line-clamp-3 mb-4">{getLocalized(event, 'description')}</p>

                            <Button
                                variant="outline"
                                className="border-primary/50 hover:bg-primary hover:text-black transition-colors"
                                onClick={() => setSelectedEvent(event)}
                            >
                                {t('common.readMore')}
                            </Button>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="w-full md:w-1/2 pl-12 md:pl-12 md:pr-0">
                        <div
                            className="aspect-video rounded-2xl overflow-hidden cursor-pointer group relative"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                <span className="text-white font-bold text-lg drop-shadow-md">{t('common.readMore')}</span>
                            </div>
                            <img
                                src={event.cover_image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => (e.target as HTMLImageElement).src = '/honeycomb-pattern.svg'}
                            />
                        </div>
                    </div>

                </motion.div>
            ))}

            {/* Gallery Overlay */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md pointer-events-auto"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl max-h-[90vh] bg-background border border-primary/20 rounded-3xl overflow-hidden pointer-events-auto flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                <h2 className="text-2xl font-bold text-primary">{getLocalized(selectedEvent, 'title')}</h2>
                                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Cover Image First */}
                                <div className="md:col-span-2 aspect-video rounded-xl overflow-hidden shadow-lg border border-white/10">
                                    <img src={selectedEvent.cover_image} className="w-full h-full object-cover" />
                                </div>

                                {/* Info Card */}
                                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                                    <p className="text-lg leading-relaxed">{getLocalized(selectedEvent, 'description')}</p>
                                </div>

                                {/* Gallery Images */}
                                {selectedEvent.gallery_images?.map((img, idx) => (
                                    <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-md group border border-white/10">
                                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
