import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Package,
    Calendar,
    Briefcase,
    FileText,
    MessageSquare,
    LogOut,
    Plus,
    Trash2,
    Edit,
    CheckCircle,
    Download,
    Layers
} from "lucide-react";
import { ProductForm } from "../components/admin/ProductForm";
import { EventForm } from "../components/admin/EventForm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardAnalytics } from "../components/admin/DashboardAnalytics";

// Interfaces
interface Product { id: number; title: string; image_url: string; categoryName: string; }
interface Event { id: number; title: string; date: string; cover_image: string; }
interface Job {
    id: number;
    title: string;
    location: string;
    type: string;
    createdAt: string;
    isActive: string;
}
interface Application {
    id: number;
    name: string;
    email: string;
    phone: string;
    cv_url: string;
    message: string;
    linkedin_url?: string;
    portfolio_url?: string;
    experience_years?: string;
    expected_salary?: string;
    graduation_year?: string;
    status: string;
    jobTitle?: string;
    createdAt: string;
}
interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Data States
    const [products, setProducts] = useState<Product[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

    // UI States
    const [showProductForm, setShowProductForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showJobForm, setShowJobForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Job Form State
    // Job Form State
    const [newJob, setNewJob] = useState({
        title: "", title_en: "", location: "Cairo", location_en: "Cairo", type: "Full-time", type_en: "Full-time",
        description: "", description_en: "", requirements: "", requirements_en: "",
        salary_range: "", salary_range_en: "", experience_level: "", experience_level_en: "",
        work_mode: "On-site", work_mode_en: "On-site", benefits: "", benefits_en: ""
    });

    useEffect(() => {
        if (!user) navigate("/login");
        fetchAll();
    }, [user, navigate]);

    const fetchAll = () => {
        const headers = { Authorization: `Bearer ${token}` };
        fetch("/api/products").then(res => res.json()).then(data => setProducts(Object.values(data).flat() as Product[]));
        fetch("/api/events").then(res => res.json()).then(setEvents);
        fetch("/api/jobs").then(res => res.json()).then(setJobs);
        fetch("/api/jobs/applications", { headers }).then(res => res.json()).then(setApplications);
        fetch("/api/messages", { headers }).then(res => res.json()).then(setMessages);
        fetch("/api/categories").then(res => res.json()).then(setCategories);
    };

    // --- Handlers ---

    // Product & Event handlers (kept simple for brevity, logic mostly same)
    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/products?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        fetchAll();
    };
    const handleDeleteEvent = async (id: number) => {
        if (!confirm("Delete?")) return;
        await fetch(`/api/events/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        fetchAll();
    };

    // Job Handlers
    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(newJob)
        });
        setShowJobForm(false);
        fetchAll();
    };
    const handleDeleteJob = async (id: number) => {
        if (!confirm("Delete job?")) return;
        await fetch(`/api/jobs/${id}`, { method: "DELETE" });
        fetchAll();
    };

    // Message Handlers
    const markMessageRead = async (id: number) => {
        await fetch(`/api/messages/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAll();
    };

    // --- Renderers ---

    const renderSidebar = () => (
        <div className="w-64 bg-card border-l min-h-screen p-4 flex flex-col gap-2">
            <div className="p-4 mb-4">
                <h2 className="text-xl font-bold text-primary">Bee Admin</h2>
            </div>
            <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("overview")}> <LayoutDashboard size={18} /> نظرة عامة </Button>
            <Button variant={activeTab === "products" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("products")}> <Package size={18} /> المنتجات </Button>
            <Button variant={activeTab === "events" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("events")}> <Calendar size={18} /> الفعاليات </Button>
            <Button variant={activeTab === "jobs" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("jobs")}> <Briefcase size={18} /> الوظائف </Button>
            <Button variant={activeTab === "applications" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("applications")}> <FileText size={18} /> طلبات التوظيف </Button>
            <Button variant={activeTab === "messages" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("messages")}> <MessageSquare size={18} /> الرسائل </Button>
            <Button variant={activeTab === "categories" ? "secondary" : "ghost"} className="justify-start gap-2" onClick={() => setActiveTab("categories")}> <Layers size={18} /> التصنيفات </Button>

            <div className="mt-auto">
                <Button variant="destructive" className="w-full gap-2" onClick={logout}> <LogOut size={18} /> تسجيل الخروج </Button>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "products":
                return showProductForm || editingProduct ? (
                    <ProductForm existingProduct={editingProduct || undefined} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} onSuccess={() => { fetchAll(); setShowProductForm(false); setEditingProduct(null); }} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">المنتجات</h2>
                            <Button onClick={() => setShowProductForm(true)} className="gap-2"><Plus size={16} /> إضافة منتج</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-card p-4 rounded-lg border flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img src={p.image_url} className="w-12 h-12 object-contain bg-white rounded" />
                                        <div>
                                            <p className="font-bold">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">{p.categoryName}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => setEditingProduct(p)}><Edit size={16} /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "events":
                return showEventForm ? (
                    <EventForm onClose={() => setShowEventForm(false)} onSuccess={() => { fetchAll(); setShowEventForm(false); }} />
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">الفعاليات</h2>
                            <Button onClick={() => setShowEventForm(true)} className="gap-2"><Plus size={16} /> إضافة فعالية</Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.map(e => (
                                <div key={e.id} className="bg-card p-4 rounded-lg border">
                                    <div className="flex items-center gap-3 mb-2">
                                        <img src={e.cover_image} className="w-16 h-16 object-cover rounded" />
                                        <div>
                                            <p className="font-bold">{e.title}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="destructive" onClick={() => handleDeleteEvent(e.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && <p className="col-span-full p-8 text-center text-muted-foreground">لا توجد فعاليات</p>}
                        </div>
                    </div>
                );

            case "jobs":
                return showJobForm ? (
                    <div className="bg-card p-6 rounded-xl border max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-4">إضافة وظيفة جديدة</h3>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="المسمى الوظيفي (عربي)" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} required />
                                <Input placeholder="Job Title (English)" value={newJob.title_en} onChange={e => setNewJob({ ...newJob, title_en: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="الوصف (عربي)" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
                                <Input placeholder="Description (English)" value={newJob.description_en} onChange={e => setNewJob({ ...newJob, description_en: e.target.value })} />
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-bold mb-3 text-sm text-muted-foreground">تفاصيل إضافية (اختياري)</h4>
                                <div className="grid grid-cols-2 gap-4 space-y-2">
                                    <Input placeholder="نطاق الراتب (مثلاً: 5000-7000)" value={newJob.salary_range} onChange={e => setNewJob({ ...newJob, salary_range: e.target.value })} />
                                    <Input placeholder="Salary Range (e.g. 5000-7000)" value={newJob.salary_range_en} onChange={e => setNewJob({ ...newJob, salary_range_en: e.target.value })} />

                                    <Input placeholder="مستوى الخبرة (مثلاً: حديث التخرج)" value={newJob.experience_level} onChange={e => setNewJob({ ...newJob, experience_level: e.target.value })} />
                                    <Input placeholder="Experience Level (e.g. Junior)" value={newJob.experience_level_en} onChange={e => setNewJob({ ...newJob, experience_level_en: e.target.value })} />

                                    <Input placeholder="نظام العمل (مثلاً: عن بعد)" value={newJob.work_mode} onChange={e => setNewJob({ ...newJob, work_mode: e.target.value })} />
                                    <Input placeholder="Work Mode (e.g. Remote)" value={newJob.work_mode_en} onChange={e => setNewJob({ ...newJob, work_mode_en: e.target.value })} />

                                    <Textarea placeholder="المميزات والبدلات (عربي)" className="col-span-1" value={newJob.benefits} onChange={e => setNewJob({ ...newJob, benefits: e.target.value })} />
                                    <Textarea placeholder="Benefits (English)" className="col-span-1" value={newJob.benefits_en} onChange={e => setNewJob({ ...newJob, benefits_en: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <Button type="button" variant="outline" onClick={() => setShowJobForm(false)}>إلغاء</Button>
                                <Button type="submit">حفظ الوظيفة</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">الوظائف</h2>
                            <Button onClick={() => setShowJobForm(true)} className="gap-2"><Plus size={16} /> إضافة وظيفة</Button>
                        </div>
                        <div className="bg-card rounded-lg border divide-y">
                            {jobs.map(job => (
                                <div key={job.id} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{job.title}</h3>
                                        <p className="text-sm text-muted-foreground">{job.location} - {job.type}</p>
                                    </div>
                                    <Button size="icon" variant="destructive" onClick={() => handleDeleteJob(job.id)}><Trash2 size={16} /></Button>
                                </div>
                            ))}
                            {jobs.length === 0 && <p className="p-8 text-center text-muted-foreground">لا توجد وظائف متاحة</p>}
                        </div>
                    </div>
                );

            case "applications":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">طلبات التوظيف</h2>
                        <div className="bg-card rounded-lg border divide-y">
                            {applications.map(app => (
                                <div key={app.id} className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{app.name}</h3>
                                                <span className={`px-2 py-0.5 text-xs rounded-full border ${app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    app.status === 'reviewed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        app.status === 'accepted' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {app.status || 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-primary font-medium">{app.jobTitle || "General Application"}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-muted-foreground block">{new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4 bg-muted/30 p-3 rounded-lg">
                                        <p>📧 {app.email}</p>
                                        <p>📱 {app.phone}</p>
                                        {app.experience_years && <p>💼 Exp: {app.experience_years}</p>}
                                        {app.expected_salary && <p>💰 Salary: {app.expected_salary}</p>}
                                        {app.linkedin_url && <a href={app.linkedin_url} target="_blank" className="text-blue-400 hover:underline">🔗 LinkedIn</a>}
                                        {app.portfolio_url && <a href={app.portfolio_url} target="_blank" className="text-purple-400 hover:underline">🎨 Portfolio</a>}
                                    </div>

                                    {app.message && (
                                        <div className="mb-4 text-sm bg-muted/10 p-3 rounded italic border-l-2 border-primary/20">
                                            "{app.message}"
                                        </div>
                                    )}

                                    <div className="flex gap-2 items-center pt-2 border-t">
                                        {app.cv_url && (
                                            <Button size="sm" variant="outline" className="gap-2" onClick={() => window.open(app.cv_url, '_blank')}>
                                                <Download size={14} /> CV
                                            </Button>
                                        )}

                                        <div className="ml-auto flex gap-1">
                                            <select
                                                className="bg-background border rounded px-2 py-1 text-sm"
                                                value={app.status || 'pending'}
                                                onChange={async (e) => {
                                                    await fetch(`/api/jobs/applications/${app.id}/status`, {
                                                        method: "PUT",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify({ status: e.target.value })
                                                    });
                                                    fetchAll();
                                                }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {applications.length === 0 && <p className="p-8 text-center text-muted-foreground">لا توجد طلبات توظيف</p>}
                        </div>
                    </div>
                );

            case "categories":
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">التصنيفات</h2>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="تصنيف جديد"
                                    id="new-category-input"
                                    className="w-48"
                                />
                                <Button onClick={async () => {
                                    const input = document.getElementById("new-category-input") as HTMLInputElement;
                                    if (!input.value) return;
                                    await fetch("/api/categories", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                        body: JSON.stringify({ name: input.value })
                                    });
                                    input.value = "";
                                    fetchAll();
                                }}>إضافة</Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="bg-card p-4 rounded-lg border flex justify-between items-center">
                                    <span className="font-medium">{cat.name}</span>
                                    <Button size="icon" variant="ghost" className="text-destructive" onClick={async () => {
                                        if (!confirm("Delete category?")) return;
                                        await fetch(`/api/categories/${cat.id}`, {
                                            method: "DELETE",
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        fetchAll();
                                    }}><Trash2 size={16} /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "messages":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">الرسائل الواردة</h2>
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`bg-card p-4 rounded-lg border ${msg.status === 'unread' ? 'border-primary' : ''}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold">{msg.subject || "No Subject"}</h3>
                                            <p className="text-sm text-muted-foreground">{msg.name} ({msg.email})</p>
                                        </div>
                                        {msg.status === 'unread' && (
                                            <Button size="sm" variant="ghost" onClick={() => markMessageRead(msg.id)} title="Mark as Read">
                                                <CheckCircle size={16} className="text-primary" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm bg-background p-3 rounded">{msg.message}</p>
                                </div>
                            ))}
                            {messages.length === 0 && <p className="p-8 text-center text-muted-foreground">لا توجد رسائل</p>}
                        </div>
                    </div>
                );

            case "overview":
            default:
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-card p-6 rounded-xl border shadow-sm">
                                <h3 className="text-muted-foreground mb-2">إجمالي المنتجات</h3>
                                <p className="text-3xl font-bold">{products.length}</p>
                            </div>
                            <div className="bg-card p-6 rounded-xl border shadow-sm">
                                <h3 className="text-muted-foreground mb-2">الوظائف المعلنة</h3>
                                <p className="text-3xl font-bold">{jobs.length}</p>
                            </div>
                            <div className="bg-card p-6 rounded-xl border shadow-sm">
                                <h3 className="text-muted-foreground mb-2">طلبات التوظيف</h3>
                                <p className="text-3xl font-bold">{applications.length}</p>
                            </div>
                            <div className="bg-card p-6 rounded-xl border shadow-sm">
                                <h3 className="text-muted-foreground mb-2">الرسائل الجديدة</h3>
                                <p className="text-3xl font-bold">{Array.isArray(messages) ? messages.filter(m => m.status === 'unread').length : 0}</p>
                            </div>
                        </div>

                        <DashboardAnalytics
                            products={products}
                            applications={applications}
                            messages={messages}
                        />
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-background" dir="rtl">
            {renderSidebar()}
            <div className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
}
