'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, KeyRound, Save, Plus, Trash2, RotateCcw, Building2,
  Newspaper, Tag, BarChart3, CheckCircle2, Phone, Mail, MapPin,
  Globe, Upload, Video, Image as ImageIcon, Camera, Loader2,
  RefreshCw, GitBranch, ArrowLeft, Eye, ExternalLink, LogOut,
  Search, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

// Client-Side Image Compression
const compressImage = (file, maxWidth = 1200, quality = 0.75) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve(null);
  });
};

export default function AdminPage() {
  const {
    projects,
    blogsEn,
    blogsAr,
    brands,
    counters,
    contactInfo,
    saveProjects,
    saveBlogs,
    saveBrands,
    saveCounters,
    saveContactInfo
  } = useData();

  const { locale, setLocale } = useLanguage();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'blogs', 'brands', 'company'
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Editable Copies
  const [editableProjects, setEditableProjects] = useState([]);
  const [editableBlogsEn, setEditableBlogsEn] = useState([]);
  const [editableBlogsAr, setEditableBlogsAr] = useState([]);
  const [editableBrands, setEditableBrands] = useState([]);
  const [editableCounters, setEditableCounters] = useState({});
  const [editableContact, setEditableContact] = useState({});

  // Sync / Action Status
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // On initial mount: check persistent session
  useEffect(() => {
    const session = sessionStorage.getItem('fb_admin_authorized');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Synchronize local editable state with DataContext
  useEffect(() => {
    if (projects && projects.length > 0 && editableProjects.length === 0) {
      setEditableProjects(projects);
    }
    if (blogsEn && blogsEn.length > 0 && editableBlogsEn.length === 0) {
      setEditableBlogsEn(blogsEn);
    }
    if (blogsAr && blogsAr.length > 0 && editableBlogsAr.length === 0) {
      setEditableBlogsAr(blogsAr);
    }
    if (brands && brands.length > 0 && editableBrands.length === 0) {
      setEditableBrands(brands);
    }
    if (counters && Object.keys(editableCounters).length === 0) {
      setEditableCounters(counters);
    }
    if (contactInfo && Object.keys(editableContact).length === 0) {
      setEditableContact(contactInfo);
    }
  }, [projects, blogsEn, blogsAr, brands, counters, contactInfo]);

  // Handle Login with PIN
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === '1862') {
      setIsAuthenticated(true);
      sessionStorage.setItem('fb_admin_authorized', 'true');
      setPinError('');
      setPinInput('');
      loadFreshDataFromDisk();
    } else {
      setPinError(locale === 'ar' ? 'رمز الدخول غير صحيح! الرجاء إدخال 1862' : 'Incorrect PIN! Please enter 1862');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('fb_admin_authorized');
    setIsAuthenticated(false);
  };

  // Pull fresh data from disk/server
  const loadFreshDataFromDisk = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/sync');
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          // Exclude any accidentally deleted projects
          const filtered = data.projects.filter(p => p.id !== 'project-1788785510962' && p.name !== 'Golden Gate Hub');
          setEditableProjects(filtered);
          saveProjects(filtered);
        }
        if (Array.isArray(data.blogsEn) && data.blogsEn.length > 0) setEditableBlogsEn(data.blogsEn);
        if (Array.isArray(data.blogsAr) && data.blogsAr.length > 0) setEditableBlogsAr(data.blogsAr);
        if (Array.isArray(data.brands) && data.brands.length > 0) {
          setEditableBrands(data.brands);
          saveBrands(data.brands);
        }
        if (data.counters) {
          setEditableCounters(data.counters);
          saveCounters(data.counters);
        }
        if (data.contactInfo) {
          setEditableContact(data.contactInfo);
          saveContactInfo(data.contactInfo);
        }
        setStatusMessage({
          type: 'success',
          text: locale === 'ar' ? 'تم جلب أحدث البيانات بنجاح من ملفات السيرفر!' : 'Loaded latest data successfully from server files!'
        });
      }
    } catch (e) {
      console.warn('Could not load fresh disk data:', e);
      setStatusMessage({
        type: 'error',
        text: locale === 'ar' ? 'تعذر جلب البيانات من السيرفر' : 'Failed to load data from server'
      });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    }
  };

  // Save All Changes & Push to GitHub
  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMessage({
      type: 'info',
      text: locale === 'ar' ? 'جاري الحفظ والمزامنة المباشرة مع ملفات الجهاز و GitHub...' : 'Saving and syncing directly to files and GitHub...'
    });

    try {
      // 1. Save to Client Storage (IndexedDB & LocalStorage)
      saveProjects(editableProjects);
      saveBlogs(editableBlogsEn, editableBlogsAr);
      saveBrands(editableBrands);
      saveCounters(editableCounters);
      saveContactInfo(editableContact);

      // 2. Sync to Server Disk Files & Git Push
      const payload = {
        projects: editableProjects,
        blogsEn: editableBlogsEn,
        blogsAr: editableBlogsAr,
        brands: editableBrands,
        counters: editableCounters,
        contactInfo: editableContact
      };

      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        setStatusMessage({
          type: 'success',
          text: locale === 'ar'
            ? '✅ تم حفظ جميع التعديلات بنجاح في ملفات المشروع ورُفعت إلى GitHub تلقائياً!'
            : '✅ All changes saved to project files & pushed to GitHub successfully!'
        });
      } else {
        setStatusMessage({
          type: 'warning',
          text: locale === 'ar'
            ? `⚠️ تم الحفظ محلياً ولكن حدث تنبيه في المزامنة: ${result.message}`
            : `⚠️ Saved locally, sync note: ${result.message}`
        });
      }
    } catch (err) {
      console.error('Save error:', err);
      setStatusMessage({
        type: 'error',
        text: locale === 'ar' ? 'حدث خطأ أثناء الاتصال بالسيرفر' : 'Network error saving changes'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 6000);
    }
  };

  // Project Management Handlers
  const handleProjectChange = (idx, field, value) => {
    const updated = [...editableProjects];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableProjects(updated);
  };

  const handleMetricChange = (idx, metricField, value) => {
    const updated = [...editableProjects];
    updated[idx] = {
      ...updated[idx],
      metrics: { ...(updated[idx].metrics || {}), [metricField]: value }
    };
    setEditableProjects(updated);
  };

  const handleAddProject = () => {
    const newId = `project-${Date.now()}`;
    const newProj = {
      id: newId,
      name: "New Commercial Project",
      name_ar: "مشروع تجاري جديد",
      status: "Operational",
      city: "New Cairo",
      city_ar: "القاهرة الجديدة",
      location: "Prime Commercial Axis",
      location_ar: "المحور التجاري الرئيسي",
      coverColor: "from-teal-800 to-teal-950",
      overview: "Prime commercial and franchise hub developed by F.B Company.",
      overview_ar: "مشروع تجاري واستثماري متميز بإدارة وتشغيل شركة F.B.",
      video: "/videos/hero-bg.mp4",
      coverImage: "/company/logo.png",
      gallery: [],
      brands: ["McDonald's", "TBS"],
      metrics: {
        landArea: "5,000 SQM",
        gla: "3,500 SQM",
        numBrands: 2,
        occupancyRate: "100%",
        openingYear: "2026"
      },
      mapInfo: {
        road: "Main Ring Road",
        road_ar: "الطريق الدائري الرئيسي",
        catchment: "100,000+ Vehicles/day",
        catchment_ar: "100,000+ مركبة يومياً",
        peakHours: "4:00 PM - 11:00 PM",
        peakHours_ar: "4:00 مساءً - 11:00 مساءً"
      },
      coordinates: { x: 50, y: 30 }
    };

    const updated = [newProj, ...editableProjects];
    setEditableProjects(updated);
    setExpandedProjectId(newId);
    setStatusMessage({
      type: 'info',
      text: locale === 'ar' ? 'تمت إضافة مشروع جديد! اضغط حفظ ومزامنة بعد الانتهاء من التعديل.' : 'New project added! Click Save & Sync when ready.'
    });
  };

  // Immediate, Bulletproof Project Deletion
  const handleDeleteProject = async (idx) => {
    const targetProj = editableProjects[idx];
    if (!targetProj) return;

    const projName = locale === 'ar' ? (targetProj.name_ar || targetProj.name) : targetProj.name;
    const confirmMsg = locale === 'ar'
      ? `هل أنت متأكد تماماً من حذف مشروع "${projName}" نهائياً من الموقع والملفات؟`
      : `Are you sure you want to permanently delete "${projName}"?`;

    if (!confirm(confirmMsg)) return;

    // 1. Remove from React state
    const updated = editableProjects.filter((_, i) => i !== idx);
    setEditableProjects(updated);

    // 2. Wipe from local client storage immediately
    saveProjects(updated);

    // 3. Immediately tell server to wipe file from data/projects/*.json and push to git
    setStatusMessage({
      type: 'info',
      text: locale === 'ar' ? `جاري حذف مشروع "${projName}" من السيرفر والـ GitHub نهائياً...` : `Deleting "${projName}" permanently from server & GitHub...`
    });

    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: updated,
          blogsEn: editableBlogsEn,
          blogsAr: editableBlogsAr,
          brands: editableBrands,
          counters: editableCounters,
          contactInfo: editableContact
        })
      });
      const data = await res.json();
      if (data && data.success) {
        setStatusMessage({
          type: 'success',
          text: locale === 'ar' ? `✅ تم حذف مشروع "${projName}" بنجاح ولم يعد موجوداً!` : `✅ Project "${projName}" deleted successfully!`
        });
      }
    } catch (e) {
      console.error('Delete sync failed:', e);
      setStatusMessage({
        type: 'warning',
        text: locale === 'ar' ? `تم الحذف محلياً، وسيتم تحديث السيرفر عند الضغط على حفظ ومزامنة.` : `Deleted locally, click Save & Sync to finish.`
      });
    }

    setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
  };

  // Image & Video File Upload Handlers
  const handleCoverUpload = async (idx, file) => {
    if (!file) return;
    const compressed = await compressImage(file, 1200, 0.75);
    if (compressed) {
      handleProjectChange(idx, 'coverImage', compressed);
    }
  };

  const handleGalleryUpload = async (idx, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const compressedList = [];
    for (const file of fileArray) {
      const compressed = await compressImage(file, 1200, 0.75);
      if (compressed) compressedList.push(compressed);
    }
    if (compressedList.length > 0) {
      const updated = [...editableProjects];
      const currentGallery = updated[idx].gallery || [];
      updated[idx] = {
        ...updated[idx],
        gallery: [...currentGallery, ...compressedList]
      };
      setEditableProjects(updated);
    }
  };

  const handleRemoveGalleryImage = (projIdx, imgIdx) => {
    const updated = [...editableProjects];
    const currentGallery = updated[projIdx].gallery || [];
    updated[projIdx] = {
      ...updated[projIdx],
      gallery: currentGallery.filter((_, i) => i !== imgIdx)
    };
    setEditableProjects(updated);
  };

  const handleAddBrandToProject = (projIdx, brandName) => {
    if (!brandName || !brandName.trim()) return;
    const trimmed = brandName.trim();
    const updated = [...editableProjects];
    const currentBrands = Array.isArray(updated[projIdx].brands) ? updated[projIdx].brands : [];
    if (!currentBrands.includes(trimmed)) {
      const newBrands = [...currentBrands, trimmed];
      updated[projIdx] = {
        ...updated[projIdx],
        brands: newBrands,
        metrics: {
          ...(updated[projIdx].metrics || {}),
          numBrands: newBrands.length
        }
      };
      setEditableProjects(updated);
    }
  };

  const handleRemoveBrandFromProject = (projIdx, brandIdx) => {
    const updated = [...editableProjects];
    const currentBrands = Array.isArray(updated[projIdx].brands) ? updated[projIdx].brands : [];
    const newBrands = currentBrands.filter((_, i) => i !== brandIdx);
    updated[projIdx] = {
      ...updated[projIdx],
      brands: newBrands,
      metrics: {
        ...(updated[projIdx].metrics || {}),
        numBrands: newBrands.length
      }
    };
    setEditableProjects(updated);
  };

  // Filtered projects for search
  const filteredProjects = editableProjects.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q))
    );
  });

  // ==========================================
  // VIEW 1: AUTHENTICATION SCREEN (PIN: 1862)
  // ==========================================
  if (!isAuthenticated) {
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
              <div className="text-2xl font-black tracking-tight text-fb-teal">
                {locale === 'ar' ? 'لوحة التحكم الإدارية المستقلة' : 'Executive Admin Dashboard'}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                F.B Company for Asset Management & Franchises
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {locale === 'ar' ? 'رمز الدخول الأمني (Security PIN)' : 'Security PIN'}
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError('');
                  }}
                  placeholder="••••"
                  autoFocus
                  maxLength={10}
                  className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-2xl px-5 py-4 text-center text-2xl tracking-[0.4em] font-mono text-fb-teal placeholder-slate-400 focus:outline-none focus:border-fb-green focus:bg-white transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-fb-teal transition-colors p-1"
                >
                  <Eye size={18} />
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-red-600 mt-2 text-center font-bold">
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-fb-teal text-fb-green hover:bg-fb-teal-light font-black py-4 px-6 rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Lock size={16} />
              <span>{locale === 'ar' ? 'تسجيل الدخول الآمن' : 'Authenticate & Enter'}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-fb-teal/10 flex items-center justify-between text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-fb-green flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={14} className={locale === 'ar' ? 'rotate-180' : ''} />
              <span>{locale === 'ar' ? 'العودة للموقع الرئيسي' : 'Return to Website'}</span>
            </Link>
            <button
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

  // ==========================================
  // VIEW 2: FULL EXECUTIVE DASHBOARD INTERFACE (LIGHT BRAND THEME)
  // ==========================================
  return (
    <div className="min-h-screen bg-fb-bg-light text-fb-black flex flex-col font-lama" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* TOP EXECUTIVE BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-fb-teal/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-fb-teal flex items-center justify-center text-fb-green font-black text-lg border border-fb-green/30 shadow-xs">
            FB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-fb-teal">
                {locale === 'ar' ? 'لوحة الإدارة الشاملة' : 'Executive Control Center'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                LIVE DISK SYNC
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              F.B for Asset Management & Franchise Location Sourcing
            </p>
          </div>
        </div>

        {/* Right: Quick Global Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Refresh from disk */}
          <button
            onClick={loadFreshDataFromDisk}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-fb-teal text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-fb-teal/15 shadow-xs"
            title={locale === 'ar' ? 'إعادة تحميل من ملفات السيرفر' : 'Reload from disk files'}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-fb-green' : 'text-fb-teal'} />
            <span>{locale === 'ar' ? 'تحديث من السيرفر' : 'Fetch Disk'}</span>
          </button>

          {/* Master Save & Push to GitHub */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-fb-green text-fb-teal hover:brightness-105 active:scale-95 text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-fb-green/20"
          >
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <GitBranch size={15} />}
            <span>{isSaving ? (locale === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (locale === 'ar' ? 'حفظ ومزامنة فورية مع GitHub' : 'Save & Push to GitHub')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-fb-teal text-xs font-bold border border-fb-teal/15 shadow-xs transition-colors cursor-pointer"
          >
            {locale === 'ar' ? 'English' : 'عربي'}
          </button>

          {/* Return to website */}
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-fb-teal border border-fb-teal/15 shadow-xs transition-colors"
            title={locale === 'ar' ? 'معاينة الموقع الرئيسي' : 'View Live Site'}
          >
            <ExternalLink size={16} />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 shadow-xs transition-colors cursor-pointer"
            title={locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* STATUS BANNER */}
      <AnimatePresence>
        {statusMessage.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`px-6 py-3 text-xs font-bold flex items-center justify-between border-b ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : statusMessage.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-teal-50 text-fb-teal border-fb-teal/20'
            }`}
          >
            <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
              {statusMessage.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-amber-600" />}
              <span>{statusMessage.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD BODY CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-fb-teal/10 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-fb-teal text-fb-green shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-fb-teal border border-fb-teal/10 shadow-xs'
            }`}
          >
            <Building2 size={16} />
            <span>{locale === 'ar' ? 'المشاريع والأصول' : 'Projects & Assets'}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${activeTab === 'projects' ? 'bg-black/20 text-fb-green' : 'bg-fb-teal/5 text-fb-teal'}`}>
              {editableProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-fb-teal text-fb-green shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-fb-teal border border-fb-teal/10 shadow-xs'
            }`}
          >
            <Tag size={16} />
            <span>{locale === 'ar' ? 'العلامات التجارية والشركاء' : 'Brands & Covenants'}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${activeTab === 'brands' ? 'bg-black/20 text-fb-green' : 'bg-fb-teal/5 text-fb-teal'}`}>
              {editableBrands.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-fb-teal text-fb-green shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-fb-teal border border-fb-teal/10 shadow-xs'
            }`}
          >
            <Newspaper size={16} />
            <span>{locale === 'ar' ? 'المقالات والأخبار' : 'Articles & Press'}</span>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'company'
                ? 'bg-fb-teal text-fb-green shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-fb-teal border border-fb-teal/10 shadow-xs'
            }`}
          >
            <BarChart3 size={16} />
            <span>{locale === 'ar' ? 'بيانات الشركة والأرقام' : 'Company & Counters'}</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT                               */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-fb-teal/10 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === 'ar' ? 'بحث عن مشروع بالاسم أو المعرف...' : 'Search projects by name or ID...'}
                  className="w-full bg-fb-bg-light/60 border border-fb-teal/15 rounded-xl pl-10 pr-4 py-2 text-xs text-fb-teal placeholder-slate-400 focus:outline-none focus:border-fb-green focus:bg-white transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2.5 rounded-xl bg-fb-teal text-fb-green hover:bg-fb-teal-light text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus size={16} />
                  <span>{locale === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
                </button>
              </div>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {filteredProjects.map((proj, idx) => {
                const isExpanded = expandedProjectId === proj.id;
                const pTitle = locale === 'ar' ? (proj.name_ar || proj.name) : proj.name;
                const pCity = locale === 'ar' ? (proj.city_ar || proj.city) : proj.city;

                return (
                  <div
                    key={proj.id || idx}
                    className="bg-white border border-fb-teal/10 rounded-2xl overflow-hidden shadow-xs hover:border-fb-teal/25 transition-all duration-200"
                  >
                    {/* Project Header Row */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-white hover:bg-slate-50/70 transition-colors">
                      <div
                        onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                        className="flex items-center gap-4 cursor-pointer flex-1 min-w-[240px]"
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-fb-bg-light border border-fb-teal/10 overflow-hidden shrink-0 relative">
                          {proj.coverImage ? (
                            <img src={proj.coverImage} alt={proj.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Building2 size={20} />
                            </div>
                          )}
                        </div>

                        {/* Title & Meta */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-fb-teal hover:text-fb-green transition-colors">
                              {pTitle}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-fb-teal/5 text-fb-teal border border-fb-teal/15 font-bold">
                              {proj.status || 'Operational'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                            📍 {pCity} • ID: <span className="font-mono text-slate-400">{proj.id}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Direct Delete Project */}
                        <button
                          onClick={() => handleDeleteProject(idx)}
                          className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title={locale === 'ar' ? 'حذف المشروع نهائياً' : 'Delete project permanently'}
                        >
                          <Trash2 size={14} />
                          <span>{locale === 'ar' ? 'حذف' : 'Delete'}</span>
                        </button>

                        {/* Toggle Expand / Edit */}
                        <button
                          onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-fb-bg-light hover:bg-slate-200 text-fb-teal text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-fb-teal/10"
                        >
                          <span>{isExpanded ? (locale === 'ar' ? 'إغلاق' : 'Close') : (locale === 'ar' ? 'تعديل' : 'Edit')}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Project Form */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-fb-teal/10 p-6 bg-slate-50/50 space-y-6"
                        >
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-fb-teal">
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Project Name (English)</label>
                              <input
                                type="text"
                                value={proj.name || ''}
                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">اسم المشروع (عربي)</label>
                              <input
                                type="text"
                                value={proj.name_ar || ''}
                                onChange={(e) => handleProjectChange(idx, 'name_ar', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green text-right shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">City (English)</label>
                              <input
                                type="text"
                                value={proj.city || ''}
                                onChange={(e) => handleProjectChange(idx, 'city', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">المدينة (عربي)</label>
                              <input
                                type="text"
                                value={proj.city_ar || ''}
                                onChange={(e) => handleProjectChange(idx, 'city_ar', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green text-right shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Location (English)</label>
                              <input
                                type="text"
                                value={proj.location || ''}
                                onChange={(e) => handleProjectChange(idx, 'location', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">الموقع بالتفصيل (عربي)</label>
                              <input
                                type="text"
                                value={proj.location_ar || ''}
                                onChange={(e) => handleProjectChange(idx, 'location_ar', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal focus:outline-none focus:border-fb-green text-right shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-fb-teal">
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Land Area (مساحة الأرض)</label>
                              <input
                                type="text"
                                value={proj.metrics?.landArea || ''}
                                onChange={(e) => handleMetricChange(idx, 'landArea', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Num of Brands (عدد البراندات)</label>
                              <input
                                type="text"
                                value={proj.metrics?.numBrands || ''}
                                onChange={(e) => handleMetricChange(idx, 'numBrands', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Occupancy Rate (نسبة الإشغال)</label>
                              <input
                                type="text"
                                value={proj.metrics?.occupancyRate || '100%'}
                                onChange={(e) => handleMetricChange(idx, 'occupancyRate', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal shadow-xs"
                              />
                            </div>
                            <div>
                              <label className="block mb-1.5 text-slate-600 font-extrabold">Opening Year (سنة الافتتاح)</label>
                              <input
                                type="text"
                                value={proj.metrics?.openingYear || ''}
                                onChange={(e) => handleMetricChange(idx, 'openingYear', e.target.value)}
                                className="w-full bg-white border border-fb-teal/20 rounded-xl p-3 text-xs text-fb-teal shadow-xs"
                              />
                            </div>
                          </div>

                          {/* Media: Video & Cover Image */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-fb-teal">
                            {/* Video */}
                            <div className="space-y-2 bg-white p-4 rounded-xl border border-fb-teal/10 shadow-xs">
                              <label className="flex items-center gap-1.5 text-fb-teal font-extrabold">
                                <Video size={14} className="text-fb-green" />
                                <span>Hero Video File or URL</span>
                              </label>
                              <input
                                type="text"
                                value={proj.video || ''}
                                onChange={(e) => handleProjectChange(idx, 'video', e.target.value)}
                                placeholder="/projects/chillout-10th-of-ramadan-banks/video.mp4"
                                className="w-full bg-fb-bg-light/60 border border-fb-teal/15 rounded-xl p-2.5 text-xs text-fb-teal font-mono"
                              />
                            </div>

                            {/* Cover Image */}
                            <div className="space-y-2 bg-white p-4 rounded-xl border border-fb-teal/10 shadow-xs">
                              <label className="flex items-center gap-1.5 text-fb-teal font-extrabold">
                                <ImageIcon size={14} className="text-fb-green" />
                                <span>Cover Image URL or Upload</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={proj.coverImage || ''}
                                  onChange={(e) => handleProjectChange(idx, 'coverImage', e.target.value)}
                                  placeholder="/projects/.../cover.jpg"
                                  className="w-full bg-fb-bg-light/60 border border-fb-teal/15 rounded-xl p-2.5 text-xs text-fb-teal font-mono"
                                />
                                <label className="shrink-0 bg-fb-teal hover:bg-fb-teal-light text-fb-green px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-xs">
                                  <Upload size={14} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleCoverUpload(idx, e.target.files[0])}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Gallery Images */}
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-fb-teal/10 shadow-xs">
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-1.5 text-xs font-extrabold text-fb-teal">
                                <Camera size={14} className="text-fb-green" />
                                <span>Gallery Images ({proj.gallery?.length || 0})</span>
                              </label>
                              <label className="bg-fb-teal text-fb-green hover:bg-fb-teal-light px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-xs">
                                <Plus size={14} />
                                <span>Add Gallery Photos</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleGalleryUpload(idx, e.target.files)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Gallery Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                              {(proj.gallery || []).map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative group aspect-square rounded-xl bg-fb-bg-light border border-fb-teal/15 overflow-hidden">
                                  <img src={imgUrl} alt={`gallery-${imgIdx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(idx, imgIdx)}
                                    className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs"
                                    title="Remove photo"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Brands / Covenants Active */}
                          <div className="space-y-3 bg-white p-4 rounded-xl border border-fb-teal/10 shadow-xs">
                            <label className="block text-xs font-extrabold text-fb-teal">
                              Active Brands / Covenants ({proj.brands?.length || 0})
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {(proj.brands || []).map((b, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="bg-fb-bg-light text-fb-teal border border-fb-teal/15 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                                >
                                  <span>{b}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBrandFromProject(idx, bIdx)}
                                    className="text-slate-400 hover:text-red-600 cursor-pointer"
                                  >
                                    ✕
                                  </button>
                                </span>
                              ))}
                            </div>
                            <div className="flex gap-2 max-w-sm">
                              <input
                                type="text"
                                placeholder="Add brand name..."
                                id={`new-brand-input-${idx}`}
                                className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-xl px-3 py-2 text-xs text-fb-teal"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddBrandToProject(idx, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`new-brand-input-${idx}`);
                                  if (input) {
                                    handleAddBrandToProject(idx, input.value);
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 bg-fb-teal hover:bg-fb-teal-light text-fb-green rounded-xl text-xs font-black cursor-pointer shadow-xs"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BRANDS & COVENANTS                                */}
        {/* ======================================================== */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-fb-teal/10 shadow-xs">
              <div className="text-sm font-extrabold text-fb-teal">
                {locale === 'ar' ? 'العلامات التجارية الشريكة (Marquee & Partners)' : 'Partner Brands (Marquee & Partners)'}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {editableBrands.map((brand, bIdx) => (
                <div key={bIdx} className="bg-white border border-fb-teal/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative group shadow-xs hover:shadow-sm transition-shadow">
                  <div className="w-16 h-16 rounded-xl bg-fb-bg-light/80 border border-fb-teal/10 p-2 flex items-center justify-center mb-2">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Tag size={20} className="text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-fb-teal line-clamp-1">{brand.name}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-1">{brand.category || 'Retail'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: BLOGS & PRESS                                     */}
        {/* ======================================================== */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-fb-teal/10 shadow-xs">
              <div className="text-sm font-extrabold text-fb-teal mb-1">
                {locale === 'ar' ? 'المقالات والتقارير الصحفية' : 'News, Articles & Research'}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {locale === 'ar' ? 'إجمالي المقالات المنشورة: ' : 'Total Published Articles: '}
                {editableBlogsEn.length} (English) / {editableBlogsAr.length} (العربية)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableBlogsEn.map((blog, idx) => (
                <div key={idx} className="bg-white border border-fb-teal/10 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{blog.date}</span>
                    <span className="px-2 py-0.5 rounded-md bg-fb-teal/5 text-fb-teal border border-fb-teal/15 font-bold">{blog.category}</span>
                  </div>
                  <div className="text-xs font-bold text-fb-teal">{blog.title}</div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: COMPANY INFO & COUNTERS                           */}
        {/* ======================================================== */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            {/* Impact Counters */}
            <div className="bg-white p-6 rounded-2xl border border-fb-teal/10 space-y-4 shadow-xs">
              <div className="text-sm font-extrabold text-fb-teal flex items-center gap-2">
                <BarChart3 size={16} className="text-fb-green" />
                <span>{locale === 'ar' ? 'أرقام وإحصائيات النجاح (Impact Numbers)' : 'Impact Numbers'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(editableCounters).map(([key, val]) => (
                  <div key={key} className="bg-fb-bg-light/60 p-4 rounded-xl border border-fb-teal/10 shadow-xs">
                    <label className="block text-[11px] font-mono text-slate-600 uppercase mb-1 font-bold">{key}</label>
                    <input
                      type="text"
                      value={val || ''}
                      onChange={(e) => setEditableCounters({ ...editableCounters, [key]: e.target.value })}
                      className="w-full bg-transparent border-b border-fb-teal/20 py-1 text-sm font-black text-fb-teal focus:outline-none focus:border-fb-green"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white p-6 rounded-2xl border border-fb-teal/10 space-y-4 shadow-xs">
              <div className="text-sm font-extrabold text-fb-teal flex items-center gap-2">
                <Phone size={16} className="text-fb-green" />
                <span>{locale === 'ar' ? 'بيانات التواصل والمقر' : 'Headquarters & Contact Details'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-fb-teal">
                <div>
                  <label className="block text-slate-600 mb-1">Email</label>
                  <input
                    type="text"
                    value={editableContact.email || ''}
                    onChange={(e) => setEditableContact({ ...editableContact, email: e.target.value })}
                    className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-xl p-3 text-fb-teal"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editableContact.phone || ''}
                    onChange={(e) => setEditableContact({ ...editableContact, phone: e.target.value })}
                    className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-xl p-3 text-fb-teal font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-600 mb-1">Address (العنوان)</label>
                  <input
                    type="text"
                    value={editableContact.address_ar || editableContact.address || ''}
                    onChange={(e) => setEditableContact({ ...editableContact, address_ar: e.target.value })}
                    className="w-full bg-fb-bg-light/60 border border-fb-teal/20 rounded-xl p-3 text-fb-teal"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
