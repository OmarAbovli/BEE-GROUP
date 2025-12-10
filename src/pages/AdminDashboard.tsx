import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, LogOut, Package, Calendar } from "lucide-react";
import { ProductForm } from "../components/admin/ProductForm";
import { EventForm } from "../components/admin/EventForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
    id: number;
    title: string;
    description: string;
    image_url: string;
    categoryName: string;
}

interface Event {
    id: number;
    title: string;
    date: string;
    cover_image: string;
}

export default function AdminDashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!user) navigate("/login");
        fetchData();
        fetchEvents();
    }, [user, navigate]);

    const fetchData = () => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => {
                const all = Object.values(data).flat() as Product[];
                setProducts(all);
            })
            .catch(console.error);
    };

    const fetchEvents = () => {
        fetch("/api/events")
            .then(res => res.json())
            .then(setEvents)
            .catch(console.error);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/products?id=${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm("Delete this event?")) return;
        await fetch(`/api/events?id=${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchEvents();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
                        <p className="text-gray-500">مرحباً, {user?.username}</p>
                    </div>
                    <Button variant="destructive" onClick={logout} className="gap-2">
                        <LogOut className="w-4 h-4" /> تسجيل الخروج
                    </Button>
                </div>

                <Tabs defaultValue="products" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg border">
                        <TabsTrigger value="products" className="px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"><Package className="w-4 h-4" /> المنتجات</TabsTrigger>
                        <TabsTrigger value="events" className="px-8 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"><Calendar className="w-4 h-4" /> الفعاليات</TabsTrigger>
                    </TabsList>

                    {/* PRODUCTS TAB */}
                    <TabsContent value="products">
                        {showProductForm || editingProduct ? (
                            <ProductForm
                                existingProduct={editingProduct || undefined}
                                onClose={() => { setShowProductForm(false); setEditingProduct(null); }}
                                onSuccess={() => { fetchData(); setShowProductForm(false); setEditingProduct(null); }}
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="p-6 border-b flex justify-between items-center bg-white">
                                    <h2 className="text-xl font-bold text-gray-900">كل المنتجات ({products.length})</h2>
                                    <Button onClick={() => setShowProductForm(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                                        <Plus className="w-4 h-4" /> إضافة منتج
                                    </Button>
                                </div>
                                <div className="divide-y bg-white">
                                    {products.map(product => (
                                        <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 bg-white">
                                            <div className="flex items-center gap-4">
                                                <img src={product.image_url} className="w-12 h-12 object-contain rounded bg-gray-100" />
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{product.title}</h3>
                                                    <p className="text-sm text-gray-500">{product.categoryName}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => setEditingProduct(product)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    {/* EVENTS TAB */}
                    <TabsContent value="events">
                        {showEventForm ? (
                            <EventForm
                                onClose={() => setShowEventForm(false)}
                                onSuccess={() => { fetchEvents(); setShowEventForm(false); }}
                            />
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="p-6 border-b flex justify-between items-center bg-white">
                                    <h2 className="text-xl font-bold text-gray-900">كل الفعاليات ({events.length})</h2>
                                    <Button onClick={() => setShowEventForm(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white">
                                        <Plus className="w-4 h-4" /> إضافة فعالية
                                    </Button>
                                </div>
                                <div className="divide-y cursor-default bg-white">
                                    {events.length === 0 && <p className="p-8 text-center text-gray-500 bg-white">لا توجد فعاليات حالياً</p>}
                                    {events.map(event => (
                                        <div key={event.id} className="p-4 flex items-center justify-between hover:bg-gray-50 bg-white">
                                            <div className="flex items-center gap-4">
                                                <img src={event.cover_image} className="w-16 h-10 object-cover rounded bg-gray-100" />
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                                                    <p className="text-sm text-gray-500">{new Date(event.date || Date.now()).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
