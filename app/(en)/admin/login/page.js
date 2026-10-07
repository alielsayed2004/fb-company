'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Eye, EyeOff, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError(locale === 'ar' ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.adminSecret) {
          sessionStorage.setItem('fb_admin_api_secret', data.adminSecret);
        }
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || (locale === 'ar' ? 'كلمة المرور غير صحيحة' : 'Invalid password'));
      }
    } catch (err) {
      setError(locale === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم' : 'Failed to connect to authentication server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fb-bg-light text-fb-teal flex items-center justify-center p-4 relative overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decorative glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-fb-teal/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-fb-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-fb-teal/10 rounded-3xl p-8 shadow-xl relative z-10">
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-green shadow-xs">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-fb-teal">
              {locale === 'ar' ? 'لوحة التحكم الإدارية المستقلة' : 'Executive Admin Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              F.B Company for Asset Management & Franchises
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              {locale === 'ar' ? 'كلمة المرور الإدارية' : 'Admin Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                autoFocus
                className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-2xl px-5 py-4 text-center text-xl tracking-[0.2em] font-mono text-fb-teal placeholder-slate-400 focus:outline-none focus:border-fb-green focus:bg-white transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-fb-teal transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-600 mt-2 text-center font-bold">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fb-teal text-fb-green hover:bg-fb-teal-light disabled:opacity-50 font-black py-4 px-6 rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            <span>{locale === 'ar' ? 'تسجيل الدخول الآمن' : 'Authenticate & Enter'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-fb-teal/10 flex items-center justify-between text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-fb-green flex items-center gap-1.5 transition-colors">
            <ArrowLeft size={14} className={locale === 'ar' ? 'rotate-180' : ''} />
            <span>{locale === 'ar' ? 'العودة للموقع الرئيسي' : 'Return to Website'}</span>
          </Link>
          <button
            type="button"
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="hover:text-fb-teal font-bold transition-colors cursor-pointer"
          >
            {locale === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>
    </div>
  );
}
