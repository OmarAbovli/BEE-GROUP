import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { BeeBackground } from "@/components/BeeBackground";
import { Briefcase, MapPin, Clock, Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Job {
    id: number;
    title: string;
    title_en?: string;
    location: string;
    location_en?: string;
    type: string;
    type_en?: string;
    description: string;
    description_en?: string;
    requirements: string;
    salary_range?: string;
    salary_range_en?: string;
    experience_level?: string;
    experience_level_en?: string;
    work_mode?: string;
    work_mode_en?: string;
    benefits?: string;
    benefits_en?: string;
}

const Careers = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [application, setApplication] = useState({
        name: "", email: "", phone: "", message: "", cv_file: null as File | null,
        linkedin_url: "", portfolio_url: "", experience_years: "", expected_salary: "", graduation_year: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetch("/api/jobs")
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setApplication({ ...application, cv_file: e.target.files[0] });
        }
    };

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let cv_url = "";
            if (application.cv_file) {
                const formData = new FormData();
                formData.append("file", application.cv_file);
                const uploadRes = await fetch("/api/upload-local", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                cv_url = uploadData.url;
            }

            await fetch("/api/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    job_id: selectedJob?.id,
                    name: application.name,
                    email: application.email,
                    phone: application.phone,
                    message: application.message,
                    linkedin_url: application.linkedin_url,
                    portfolio_url: application.portfolio_url,
                    experience_years: application.experience_years,
                    expected_salary: application.expected_salary,
                    graduation_year: application.graduation_year,
                    cv_url
                })
            });

            toast({ title: t('common.success'), description: t('careers.applicationSent') });
            setApplication({
                name: "", email: "", phone: "", message: "", cv_file: null,
                linkedin_url: "", portfolio_url: "", experience_years: "", expected_salary: "", graduation_year: ""
            });
            setSelectedJob(null); // Close modal
        } catch (error) {
            toast({ title: t('common.error'), description: "Failed to send application", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <SEO
                title={t('nav.careers')}
                description={language === 'ar'
                    ? "انضم إلى فريقنا المتميز في مجموعة بي للأدوية. استكشف فرص العمل الحالية وابدأ مسيرتك المهنية معنا."
                    : "Join our distinguished team at Bee Group Pharmaceuticals. Explore current job opportunities and start your career with us."}
                keywords={language === 'ar'
                    ? "وظائف أدوية مصر, وظائف طبية, انضم لمجموعة بي, مهن صحية"
                    : "egypt pharma jobs, medical careers, join bee group, healthcare professions"}
            />
            <BeeBackground />
            <div className="bg-background pt-24 pb-12 container mx-auto px-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 text-primary">{t('careers.title')}</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t('careers.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <p className="text-center">{t('common.loading')}</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {jobs.map(job => (
                            <div key={job.id} className="glass-card p-8 rounded-xl border border-primary/20 hover:border-primary transition-colors flex flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-primary/10 rounded-full">
                                        <Briefcase className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{language === 'ar' ? job.title : (job.title_en || job.title)}</h3>
                                        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1"><MapPin size={12} /> {language === 'ar' ? job.location : (job.location_en || job.location)}</span>
                                            <span className="flex items-center gap-1"><Clock size={12} /> {language === 'ar' ? job.type : (job.type_en || job.type)}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mb-4 text-muted-foreground line-clamp-3">
                                    {language === 'ar' ? job.description : (job.description_en || job.description)}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(language === 'ar' ? job.work_mode : (job.work_mode_en || job.work_mode)) &&
                                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                                            {language === 'ar' ? job.work_mode : (job.work_mode_en || job.work_mode)}
                                        </span>
                                    }
                                    {(language === 'ar' ? job.experience_level : (job.experience_level_en || job.experience_level)) &&
                                        <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-full border border-blue-500/20">
                                            {language === 'ar' ? job.experience_level : (job.experience_level_en || job.experience_level)}
                                        </span>
                                    }
                                    {(language === 'ar' ? job.salary_range : (job.salary_range_en || job.salary_range)) &&
                                        <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full border border-green-500/20">
                                            {language === 'ar' ? job.salary_range : (job.salary_range_en || job.salary_range)}
                                        </span>
                                    }
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="w-full mt-auto" variant="outline" onClick={() => setSelectedJob(job)}>{t('careers.apply')}</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl">{t('careers.applyFor')} {language === 'ar' ? job.title : (job.title_en || job.title)}</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmitApplication} className="space-y-6 py-4">
                                            {/* Section 1: Personal Info */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold border-b pb-2">Personal Information</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                                                        <Input placeholder="John Doe" value={application.name} onChange={e => setApplication({ ...application, name: e.target.value })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
                                                        <Input type="email" placeholder="john@example.com" value={application.email} onChange={e => setApplication({ ...application, email: e.target.value })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Phone Number <span className="text-red-500">*</span></label>
                                                        <Input placeholder="+20 123 456 7890" value={application.phone} onChange={e => setApplication({ ...application, phone: e.target.value })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Expected Salary</label>
                                                        <Input placeholder="e.g. 5000 EGP" value={application.expected_salary} onChange={e => setApplication({ ...application, expected_salary: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 2: Professional Details */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold border-b pb-2">Professional Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Years of Experience</label>
                                                        <Input placeholder="e.g. 3 years" value={application.experience_years} onChange={e => setApplication({ ...application, experience_years: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Graduation Year</label>
                                                        <Input placeholder="e.g. 2020" value={application.graduation_year} onChange={e => setApplication({ ...application, graduation_year: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">LinkedIn URL</label>
                                                        <Input placeholder="https://linkedin.com/in/..." value={application.linkedin_url} onChange={e => setApplication({ ...application, linkedin_url: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Portfolio URL</label>
                                                        <Input placeholder="https://behance.net/..." value={application.portfolio_url} onChange={e => setApplication({ ...application, portfolio_url: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section 3: CV & Message */}
                                            <div className="space-y-4">
                                                <h4 className="font-semibold border-b pb-2">Documents & Message</h4>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Cover Letter / Message</label>
                                                    <Textarea placeholder="Tell us why you're a good fit..." value={application.message} onChange={e => setApplication({ ...application, message: e.target.value })} />
                                                </div>
                                                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20">
                                                    <Input type="file" className="hidden" id="cv-upload" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                                    <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                                        <Upload className="w-8 h-8 text-primary/70" />
                                                        <div className="text-sm">
                                                            <span className="font-bold text-primary">Click to upload CV</span> or drag and drop
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{application.cv_file ? application.cv_file.name : "PDF, DOC, DOCX up to 10MB"}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                                                    {isSubmitting ? t('common.loading') : t('careers.send')}
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center bg-card p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-4">{t('careers.noFit')}</h3>
                    <p className="text-muted-foreground mb-6">
                        {t('careers.sendCv')} <span className="text-primary font-bold">careers@beegroup.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
