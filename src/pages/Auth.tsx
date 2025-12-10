import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    try {
      authSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        try {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password }), // Mapping email input to username for now, or change input to username
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          toast({ title: 'تم تسجيل الدخول بنجاح', description: 'مرحباً بك في لوحة التحكم' });
          navigate('/admin');
        } catch (error: any) {
          toast({
            title: 'خطأ',
            description: error.message,
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'تنبيه',
          description: 'إنشاء حساب جديد غير متاح حالياً. يرجى الاتصال بالمسؤول.',
          variant: 'default'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 rounded-2xl">
          <div className="text-center mb-8">
            <img src="/lovable-uploads/logo.png" alt="Bee Group" className="h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </h1>
            <p className="text-muted-foreground mt-2">لوحة تحكم Bee Group</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">اسم المستخدم أو البريد الإلكتروني</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                className="mt-1"
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              {isLogin ? 'دخول' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب؟ سجل دخولك'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
