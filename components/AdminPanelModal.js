'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, KeyRound, Save, Plus, Trash2, Download, RotateCcw, Building2, Newspaper, Tag, BarChart3, CheckCircle2, Phone, Mail, MapPin, Globe, Upload, Video, Image as ImageIcon, Camera, Loader2, RefreshCw, GitBranch } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

// Automatic Client-Side Image Compression Utility
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

export default function AdminPanelModal() {
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
    saveContactInfo,
    resetToDefault,
    isAdminOpen,
    setIsAdminOpen,
    isPasscodeOpen,
    setIsPasscodeOpen
  } = useData();

  const { locale } = useLanguage();

  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'blogs', 'brands', or 'company'
  
  // States for editing
  const [editableProjects, setEditableProjects] = useState(projects);
  const [editableBlogsEn, setEditableBlogsEn] = useState(blogsEn);
  const [editableBlogsAr, setEditableBlogsAr] = useState(blogsAr);
  const [editableBrands, setEditableBrands] = useState(brands);
  const [editableCounters, setEditableCounters] = useState(counters);
  const [editableContact, setEditableContact] = useState(contactInfo);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pull freshest project data directly from the machine files
  const loadFreshDataFromDisk = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/sync');
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          setEditableProjects(data.projects);
          saveProjects(data.projects);
        }
        if (Array.isArray(data.blogsEn) && data.blogsEn.length > 0) {
          setEditableBlogsEn(data.blogsEn);
        }
        if (Array.isArray(data.blogsAr) && data.blogsAr.length > 0) {
          setEditableBlogsAr(data.blogsAr);
        }
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
      }
    } catch (e) {
      console.warn('Could not load fresh disk data:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle Passcode Unlock
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (passcode.trim() === '1862') {
      setIsPasscodeOpen(false);
      setPasscode('');
      setPasscodeError('');
      setEditableProjects([...projects]);
      setEditableBlogsEn([...blogsEn]);
      setEditableBlogsAr([...blogsAr]);
      setEditableBrands([...brands]);
      setEditableCounters({ ...counters });
      setEditableContact({ ...contactInfo });
      setIsAdminOpen(true);
      loadFreshDataFromDisk();
    } else {
      setPasscodeError(locale === 'ar' ? 'رمز الدخول غير صحيح! حاول مرة أخرى.' : 'Incorrect passcode! Please try again.');
    }
  };

  // Projects Handlers
  const handleProjectChange = (idx, field, value) => {
    const updated = [...editableProjects];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableProjects(updated);
  };

  const handleMetricChange = (idx, metricField, value) => {
    const updated = [...editableProjects];
    updated[idx] = {
      ...updated[idx],
      metrics: { ...updated[idx].metrics, [metricField]: value }
    };
    setEditableProjects(updated);
  };

  // File Upload Handlers for Projects with Compression
  const handleVideoFileUpload = (idx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      handleProjectChange(idx, 'video', e.target.result);
    };
  };

  const handleCoverImageFileUpload = async (idx, file) => {
    if (!file) return;
    const compressed = await compressImage(file, 1200, 0.75);
    if (compressed) {
      handleProjectChange(idx, 'coverImage', compressed);
    }
  };

  // Smart Compressed Multi-Image Gallery Upload Handler
  const handleGalleryImagesUpload = async (idx, files) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    const compressedList = [];
    for (const file of fileArray) {
      const compressed = await compressImage(file, 1200, 0.75);
      if (compressed) {
        compressedList.push(compressed);
      }
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

  // Helper functions to manage individual brands inside a project
  const handleAddBrandToProject = (projIdx, brandName) => {
    if (!brandName || !brandName.trim()) return;
    const updated = [...editableProjects];
    const currentBrands = Array.isArray(updated[projIdx].brands) ? updated[projIdx].brands : [];
    const trimmed = brandName.trim();
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

  // File Upload Handler for Brands with Compression
  const handleBrandLogoFileUpload = async (idx, file) => {
    if (!file) return;
    const compressed = await compressImage(file, 600, 0.85);
    if (compressed) {
      handleBrandChange(idx, 'logoUrl', compressed);
    }
  };

  const handleAddProject = () => {
    const newProj = {
      id: `project-${Date.now()}`,
      name: "New Commercial Project",
      name_ar: "مشروع تجاري جديد",
      status: "Operational",
      city: "New Cairo",
      city_ar: "القاهرة الجديدة",
      location: "Prime Commercial Axis",
      location_ar: "المحور التجاري الرئيسي",
      coverColor: "from-teal-800 to-teal-950",
      overview: "Overview description for the new commercial project...",
      overview_ar: "وصف ونظرة عامة للمشروع التجاري الجديد...",
      video: "/videos/hero-bg.mp4",
      coverImage: "/company/logo.png",
      gallery: [],
      brands: ["McDonald's", "Carrefour"],
      metrics: {
        landArea: "5,000 SQM",
        gla: "3,500 SQM",
        numBrands: 4,
        occupancyRate: "100%",
        openingYear: "2026"
      },
      mapInfo: {
        road: "Main Highway",
        road_ar: "الطريق الرئيسي",
        catchment: "100,000+ Vehicles/day",
        catchment_ar: "100,000+ مركبة يومياً",
        peakHours: "4:00 PM - 11:00 PM",
        peakHours_ar: "4:00 مساءً - 11:00 مساءً"
      },
      coordinates: { x: 50, y: 30 }
    };
    setEditableProjects([newProj, ...editableProjects]);
  };

  const handleDeleteProject = (idx) => {
    if (confirm(locale === 'ar' ? 'هل أنت تأكد من حذف هذا المشروع؟' : 'Are you sure you want to delete this project?')) {
      const updated = editableProjects.filter((_, i) => i !== idx);
      setEditableProjects(updated);
    }
  };

  // Blogs Handlers
  const handleBlogChangeEn = (idx, field, value) => {
    const updated = [...editableBlogsEn];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableBlogsEn(updated);
  };

  const handleBlogChangeAr = (idx, field, value) => {
    const updated = [...editableBlogsAr];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableBlogsAr(updated);
  };

  const handleAddBlog = () => {
    const newId = Date.now();
    const newEn = {
      id: newId,
      category: "Industry News",
      title: "New Article Title 2026",
      date: "July 22",
      readTime: "4 min read",
      excerpt: "Short excerpt summary of the new article...",
      fullContent: "Full article body content goes here..."
    };
    const newAr = {
      id: newId,
      category: "أخبار القطاع",
      title: "عنوان المقال الجديد 2026",
      date: "22 يوليو",
      readTime: "قراءة 4 دقائق",
      excerpt: "ملخص قصير للمقال الجديد...",
      fullContent: "المحتوى الكامل للمقال الجديد يكتب هنا..."
    };
    setEditableBlogsEn([newEn, ...editableBlogsEn]);
    setEditableBlogsAr([newAr, ...editableBlogsAr]);
  };

  const handleDeleteBlog = (idx) => {
    if (confirm(locale === 'ar' ? 'هل أنت تأكد من حذف هذا المقال؟' : 'Are you sure you want to delete this article?')) {
      setEditableBlogsEn(editableBlogsEn.filter((_, i) => i !== idx));
      setEditableBlogsAr(editableBlogsAr.filter((_, i) => i !== idx));
    }
  };

  // Brands Handlers
  const handleBrandChange = (idx, field, value) => {
    const updated = [...editableBrands];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditableBrands(updated);
  };

  const handleAddBrand = () => {
    const newBrand = {
      id: Date.now(),
      name: `Brand Partner #${editableBrands.length + 1}`,
      logoUrl: `/logos/1.png`
    };
    setEditableBrands([newBrand, ...editableBrands]);
  };

  const handleDeleteBrand = (idx) => {
    if (confirm(locale === 'ar' ? 'هل أنت تأكد من حذف هذا البراند؟' : 'Are you sure you want to remove this brand?')) {
      setEditableBrands(editableBrands.filter((_, i) => i !== idx));
    }
  };

  // Save All Changes directly to machine files and sync to GitHub
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccessMsg('');
    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: editableProjects,
          blogsEn: editableBlogsEn,
          blogsAr: editableBlogsAr,
          brands: editableBrands,
          counters: editableCounters,
          contactInfo: editableContact
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.projects && Array.isArray(data.projects)) {
          setEditableProjects(data.projects);
          saveProjects(data.projects);
        } else {
          saveProjects(editableProjects);
        }
        saveBlogs(editableBlogsEn, editableBlogsAr);
        saveBrands(editableBrands);
        saveCounters(editableCounters);
        saveContactInfo(editableContact);

        if (data.git && data.git.synced) {
          setSaveSuccessMsg(
            locale === 'ar'
              ? '✅ تم حفظ التعديلات في ملفات المشروع ورفعها وتحديثها على GitHub فوراً بنجاح!'
              : '✅ Changes saved to project files & pushed to GitHub main successfully!'
          );
        } else {
          setSaveSuccessMsg(
            locale === 'ar'
              ? '✅ تم حفظ التعديلات والملفات في الجهاز بنجاح!'
              : '✅ Changes saved to machine project files successfully!'
          );
        }
      } else {
        // Fallback local save if server error
        saveProjects(editableProjects);
        saveBlogs(editableBlogsEn, editableBlogsAr);
        saveBrands(editableBrands);
        saveCounters(editableCounters);
        saveContactInfo(editableContact);
        setSaveSuccessMsg(locale === 'ar' ? 'تم الحفظ محلياً بنجاح!' : 'Saved locally!');
      }
    } catch (err) {
      console.error('Save error:', err);
      // Fallback local save
      saveProjects(editableProjects);
      saveBlogs(editableBlogsEn, editableBlogsAr);
      saveBrands(editableBrands);
      saveCounters(editableCounters);
      saveContactInfo(editableContact);
      setSaveSuccessMsg(locale === 'ar' ? 'تم حفظ التعديلات في المتصفح!' : 'Saved in browser!');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccessMsg(''), 5000);
    }
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const backupObj = {
      projects: editableProjects,
      blogsEn: editableBlogsEn,
      blogsAr: editableBlogsAr,
      brands: editableBrands,
      counters: editableCounters,
      contactInfo: editableContact
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "fb_company_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* 1. PASSCODE PROMPT MODAL */}
      <AnimatePresence>
        {isPasscodeOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasscodeOpen(false)}
              className="fixed inset-0 bg-[#001415]/80 backdrop-blur-xl transition-all"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-[#002123]/95 text-fb-white p-7 sm:p-9 rounded-[2rem] max-w-sm w-full shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 border border-fb-green/30 text-center space-y-6 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsPasscodeOpen(false);
                  setPasscode('');
                  setPasscodeError('');
                }}
                className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-full text-fb-bg-light/50 hover:text-fb-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Security Icon Badge */}
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-fb-green/20 to-fb-teal border border-fb-green/40 flex items-center justify-center text-fb-green shadow-[0_0_30px_rgba(83,183,121,0.2)]">
                <KeyRound size={30} strokeWidth={1.75} className="relative z-10" />
                <span className="absolute inset-0 rounded-2xl bg-fb-green/10 animate-ping opacity-50 pointer-events-none" />
              </div>

              {/* Title & Subtitle (No plaintext password exposed) */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-fb-white tracking-tight">
                  {locale === 'ar' ? 'لوحة التحكم والمحتوى' : 'Admin Portal Access'}
                </h3>
                <p className="text-xs text-fb-bg-light/70 font-light">
                  {locale === 'ar' ? 'أدخل رمز الأمان المعتمد للمتابعة' : 'Enter authorized security PIN to proceed'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handlePasscodeSubmit} className="space-y-4 pt-1">
                <div className="relative">
                  <input
                    type="password"
                    maxLength={8}
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (passcodeError) setPasscodeError('');
                    }}
                    placeholder="••••"
                    className="w-full bg-[#001718] border border-fb-green/30 focus:border-fb-green rounded-2xl px-4 py-3.5 text-center text-2xl font-mono text-fb-white tracking-[0.4em] placeholder:tracking-normal placeholder:text-fb-bg-light/30 focus:outline-none focus:ring-2 focus:ring-fb-green/20 transition-all"
                    autoFocus
                  />
                </div>

                {passcodeError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-xs text-rose-400 font-semibold bg-rose-500/10 py-1.5 px-3 rounded-lg border border-rose-500/20"
                  >
                    {passcodeError}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-fb-green/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {locale === 'ar' ? 'تأكيد الدخول' : 'Unlock Dashboard'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. MAIN ADMIN CMS DASHBOARD OVERLAY */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-fb-black/80 backdrop-blur-lg"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-fb-white text-fb-teal rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl z-10 border border-fb-teal/20 flex flex-col overflow-hidden my-auto"
            >
              {/* Header Bar */}
              <div className="bg-fb-teal text-fb-white p-5 px-8 flex items-center justify-between border-b border-fb-bg-light/10 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-fb-green/20 text-fb-green rounded-xl border border-fb-green/30">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg text-fb-white">
                      {locale === 'ar' ? 'مركز إدارة المحتوى والمشاريع | F.B Control Center' : 'F.B Corporate Content Manager'}
                    </h2>
                    <p className="text-xs text-fb-bg-light/70">
                      {locale === 'ar' ? 'تعديل وتحديث المشاريع، رفع الفيديوهات والصور، وإدارة البراندات' : 'Upload station videos, smart photo galleries, & manage content'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={loadFreshDataFromDisk}
                    disabled={isRefreshing || isSaving}
                    title={locale === 'ar' ? 'سحب البيانات فوراً من ملفات الجهاز' : 'Pull fresh data from machine files'}
                    className="flex items-center space-x-2 bg-fb-white/10 hover:bg-fb-white/20 disabled:opacity-50 text-fb-white font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all border border-fb-white/15"
                  >
                    <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                    <span>{locale === 'ar' ? 'سحب من ملفات الجهاز' : 'Sync from Files'}</span>
                  </button>

                  <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="flex items-center space-x-2 bg-fb-green hover:bg-fb-green-hover disabled:opacity-75 text-fb-teal font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{locale === 'ar' ? 'جاري الحفظ والرفع لـ GitHub...' : 'Saving & Pushing to GitHub...'}</span>
                      </>
                    ) : (
                      <>
                        <GitBranch size={16} />
                        <span>{locale === 'ar' ? 'حفظ وتحديث GitHub فوراً' : 'Save & Push GitHub'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsAdminOpen(false)}
                    className="p-2.5 rounded-xl bg-fb-white/10 text-fb-white hover:bg-fb-white/20 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Status Alert Bar */}
              {saveSuccessMsg && (
                <div className="bg-fb-green/20 text-fb-teal border-b border-fb-green/30 p-3 px-8 text-xs font-extrabold flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-fb-green" />
                    <span>{saveSuccessMsg}</span>
                  </span>
                </div>
              )}

              {/* Action Ribbon & Tabs */}
              <div className="bg-fb-bg-light/60 p-4 px-8 border-b border-fb-teal/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 bg-fb-white p-1 rounded-2xl border border-fb-teal/10">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                      activeTab === 'projects'
                        ? 'bg-fb-teal text-fb-white shadow-sm'
                        : 'text-fb-teal/70 hover:text-fb-teal'
                    }`}
                  >
                    <Building2 size={15} />
                    <span>{locale === 'ar' ? 'المشاريع والصور' : 'Projects & Gallery'} ({editableProjects.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('blogs')}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                      activeTab === 'blogs'
                        ? 'bg-fb-teal text-fb-white shadow-sm'
                        : 'text-fb-teal/70 hover:text-fb-teal'
                    }`}
                  >
                    <Newspaper size={15} />
                    <span>{locale === 'ar' ? 'المدونة للأخبار' : 'Blogs'} ({editableBlogsEn.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('brands')}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                      activeTab === 'brands'
                        ? 'bg-fb-teal text-fb-white shadow-sm'
                        : 'text-fb-teal/70 hover:text-fb-teal'
                    }`}
                  >
                    <Tag size={15} />
                    <span>{locale === 'ar' ? 'البراندات' : 'Brands'} ({editableBrands.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('company')}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors ${
                      activeTab === 'company'
                        ? 'bg-fb-teal text-fb-white shadow-sm'
                        : 'text-fb-teal/70 hover:text-fb-teal'
                    }`}
                  >
                    <BarChart3 size={15} />
                    <span>{locale === 'ar' ? 'الأرقام والتواصل' : 'Company Data'}</span>
                  </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center space-x-3">
                  {activeTab === 'projects' && (
                    <button
                      onClick={handleAddProject}
                      className="flex items-center space-x-1.5 bg-fb-teal text-fb-white hover:bg-fb-teal/90 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Plus size={16} />
                      <span>{locale === 'ar' ? 'إضافة مشروع' : 'Add Project'}</span>
                    </button>
                  )}

                  {activeTab === 'blogs' && (
                    <button
                      onClick={handleAddBlog}
                      className="flex items-center space-x-1.5 bg-fb-teal text-fb-white hover:bg-fb-teal/90 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Plus size={16} />
                      <span>{locale === 'ar' ? 'إضافة مقال' : 'Add Article'}</span>
                    </button>
                  )}

                  {activeTab === 'brands' && (
                    <button
                      onClick={handleAddBrand}
                      className="flex items-center space-x-1.5 bg-fb-teal text-fb-white hover:bg-fb-teal/90 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    >
                      <Plus size={16} />
                      <span>{locale === 'ar' ? 'إضافة براند' : 'Add Brand'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleExportJSON}
                    className="flex items-center space-x-1.5 bg-fb-white text-fb-teal border border-fb-teal/20 hover:bg-fb-bg-light px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
                    title="Export backup file"
                  >
                    <Download size={15} />
                    <span>{locale === 'ar' ? 'تحميل نسختي' : 'Export Data'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(locale === 'ar' ? 'إعادة تعيين كافة البيانات للوضع الافتراضي الأصلي؟' : 'Reset all data back to original default?')) {
                        resetToDefault();
                        setEditableProjects(defaultProjects);
                        setEditableBlogsEn(defaultBlogsEn);
                        setEditableBlogsAr(defaultBlogsAr);
                        setEditableBrands(defaultBrands);
                      }
                    }}
                    className="flex items-center space-x-1.5 text-red-600 hover:bg-red-50 p-2 rounded-xl text-xs font-bold transition-colors"
                    title="Reset default data"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>

              {/* Main Content Form Body */}
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 font-lama">
                
                {/* TAB 1: PROJECTS */}
                {activeTab === 'projects' && (
                  <div className="space-y-8">
                    {editableProjects.map((proj, idx) => (
                      <div
                        key={proj.id || idx}
                        className="bg-fb-bg-light/30 border border-fb-teal/10 rounded-2xl p-6 space-y-6 shadow-xs relative"
                      >
                        <div className="flex items-center justify-between border-b border-fb-teal/10 pb-4">
                          <span className="bg-fb-teal text-fb-white text-xs font-extrabold px-3 py-1 rounded-lg font-mono">
                            #{idx + 1} ID: {proj.id}
                          </span>
                          <button
                            onClick={() => handleDeleteProject(idx)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>{locale === 'ar' ? 'حذف المشروع' : 'Delete'}</span>
                          </button>
                        </div>

                        {/* Form Inputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-bold text-fb-teal">
                          <div>
                            <label className="block mb-1">Project Name (English)</label>
                            <input
                              type="text"
                              value={proj.name || ''}
                              onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">اسم المشروع (بالعربية)</label>
                            <input
                              type="text"
                              value={proj.name_ar || ''}
                              onChange={(e) => handleProjectChange(idx, 'name_ar', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">City (English)</label>
                            <input
                              type="text"
                              value={proj.city || ''}
                              onChange={(e) => handleProjectChange(idx, 'city', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">المدينة (بالعربية)</label>
                            <input
                              type="text"
                              value={proj.city_ar || ''}
                              onChange={(e) => handleProjectChange(idx, 'city_ar', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          {/* VIDEO UPLOAD FIELD */}
                          <div className="bg-fb-white p-4 rounded-2xl border border-fb-teal/20 space-y-2">
                            <label className="block text-fb-teal font-extrabold flex items-center gap-1.5">
                              <Video size={16} className="text-fb-green" />
                              <span>{locale === 'ar' ? 'فيديو المحطة (Station Video)' : 'Station Video File'}</span>
                            </label>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={proj.video || ''}
                                onChange={(e) => handleProjectChange(idx, 'video', e.target.value)}
                                placeholder="/videos/Main Banks Service Corridor.mp4"
                                className="flex-1 bg-fb-bg-light/50 border border-fb-teal/15 rounded-xl p-2 text-xs text-fb-teal font-mono font-normal"
                              />
                              <label className="cursor-pointer bg-fb-teal text-fb-white hover:bg-fb-teal/90 px-3 py-2 rounded-xl text-[11px] font-bold shrink-0 flex items-center space-x-1 transition-colors">
                                <Upload size={14} />
                                <span>{locale === 'ar' ? 'رفع فيديو' : 'Upload'}</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => handleVideoFileUpload(idx, e.target.files[0])}
                                />
                              </label>
                            </div>
                            {proj.video && (
                              <p className="text-[10px] text-fb-green font-mono truncate">
                                ✓ Video loaded: {proj.video.substring(0, 45)}...
                              </p>
                            )}
                          </div>

                          {/* COVER IMAGE UPLOAD FIELD */}
                          <div className="bg-fb-white p-4 rounded-2xl border border-fb-teal/20 space-y-2">
                            <label className="block text-fb-teal font-extrabold flex items-center gap-1.5">
                              <ImageIcon size={16} className="text-fb-green" />
                              <span>{locale === 'ar' ? 'صورة الغلاف للمحطة (Cover Photo)' : 'Cover Image Photo'}</span>
                            </label>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={proj.coverImage || ''}
                                onChange={(e) => handleProjectChange(idx, 'coverImage', e.target.value)}
                                placeholder="/projects/artboard3.jpg"
                                className="flex-1 bg-fb-bg-light/50 border border-fb-teal/15 rounded-xl p-2 text-xs text-fb-teal font-mono font-normal"
                              />
                              <label className="cursor-pointer bg-fb-teal text-fb-white hover:bg-fb-teal/90 px-3 py-2 rounded-xl text-[11px] font-bold shrink-0 flex items-center space-x-1 transition-colors">
                                <Upload size={14} />
                                <span>{locale === 'ar' ? 'رفع صورة' : 'Upload'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleCoverImageFileUpload(idx, e.target.files[0])}
                                />
                              </label>
                            </div>

                            {/* Image Preview */}
                            {proj.coverImage && (
                              <div className="h-16 w-full rounded-xl bg-fb-teal/10 overflow-hidden mt-1 border border-fb-teal/10">
                                <img src={proj.coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                              </div>
                            )}
                          </div>

                          {/* SMART MULTI-IMAGE GALLERY SECTION */}
                          <div className="md:col-span-2 bg-fb-white p-5 rounded-2xl border border-fb-teal/20 space-y-3">
                            <div className="flex items-center justify-between border-b border-fb-teal/10 pb-3">
                              <label className="text-fb-teal font-extrabold flex items-center gap-2">
                                <Camera size={18} className="text-fb-green" />
                                <span>{locale === 'ar' ? 'معرض صور المشروع (Project Gallery Images)' : 'Smart Project Gallery Images'}</span>
                                <span className="text-[10px] text-fb-green font-mono bg-fb-green/10 px-2 py-0.5 rounded">
                                  {proj.gallery ? proj.gallery.length : 0} {locale === 'ar' ? 'صور' : 'Photos'}
                                </span>
                              </label>

                              <label className="cursor-pointer bg-fb-green hover:bg-fb-green-hover text-fb-teal px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-colors shadow-sm">
                                <Upload size={15} />
                                <span>{locale === 'ar' ? 'رفع عدة صور لمعرض المشروع' : 'Upload Gallery Photos'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={(e) => handleGalleryImagesUpload(idx, e.target.files)}
                                />
                              </label>
                            </div>

                            {/* Gallery Thumbnails List */}
                            {proj.gallery && proj.gallery.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                                {proj.gallery.map((imgSrc, imgIdx) => (
                                  <div key={imgIdx} className="relative group h-24 rounded-xl overflow-hidden border border-fb-teal/15 bg-fb-teal/5">
                                    <img src={imgSrc} alt={`Gallery ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                      onClick={() => handleRemoveGalleryImage(idx, imgIdx)}
                                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity shadow-sm"
                                      title="Remove Photo"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-fb-black/50 italic pt-1">
                                {locale === 'ar' ? 'لم يتم إضافة صور خاصة بالمعرض بعد. ارفع أي عدد من الصور (1، 2، 3، 4، أو أكثر) وسيتكيف التصميم تلقائياً مع عددها.' : 'No custom gallery photos uploaded yet. Upload any number of photos (1, 2, 3, 4, or more) and the layout adjusts dynamically.'}
                              </p>
                            )}
                          </div>

                          {/* PROJECT METRICS FIELDS */}
                          <div>
                            <label className="block mb-1 font-extrabold text-fb-teal">
                              {locale === 'ar' ? 'سنة الإكتمال والتشغيل (Year Completed)' : 'Year Completed'}
                            </label>
                            <input
                              type="text"
                              value={proj.metrics?.openingYear || ''}
                              onChange={(e) => handleMetricChange(idx, 'openingYear', e.target.value)}
                              placeholder="e.g. 2023"
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal focus:outline-none focus:border-fb-green"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-extrabold text-fb-teal">
                              {locale === 'ar' ? 'نسبة الإشغال الحالي (Current Occupancy)' : 'Current Occupancy Rate'}
                            </label>
                            <input
                              type="text"
                              value={proj.metrics?.occupancyRate || ''}
                              onChange={(e) => handleMetricChange(idx, 'occupancyRate', e.target.value)}
                              placeholder="e.g. 100%"
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal focus:outline-none focus:border-fb-green"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-extrabold text-fb-teal">
                              {locale === 'ar' ? 'مساحة أصل الأرض (Land Area)' : 'Land Footprint Area'}
                            </label>
                            <input
                              type="text"
                              value={proj.metrics?.landArea || ''}
                              onChange={(e) => handleMetricChange(idx, 'landArea', e.target.value)}
                              placeholder="e.g. 7,200 SQM"
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal focus:outline-none focus:border-fb-green"
                            />
                          </div>

                          <div>
                            <label className="block mb-1 font-extrabold text-fb-teal">
                              {locale === 'ar' ? 'حالة التشغيل (Project Status)' : 'Project Status'}
                            </label>
                            <select
                              value={proj.status || 'Operational'}
                              onChange={(e) => handleProjectChange(idx, 'status', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal focus:outline-none focus:border-fb-green"
                            >
                              <option value="Operational">{locale === 'ar' ? 'تشغيل تشغيلي ممتاز (Operational)' : 'Operational'}</option>
                              <option value="Under Construction">{locale === 'ar' ? 'تحت الإنشاء والإنشاءات (Under Construction)' : 'Under Construction'}</option>
                              <option value="Finalizing Sourcing">{locale === 'ar' ? 'قيد التخصيص والترخيص (Finalizing Sourcing)' : 'Finalizing Sourcing'}</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-1">Overview Description (English)</label>
                            <textarea
                              rows={2}
                              value={proj.overview || ''}
                              onChange={(e) => handleProjectChange(idx, 'overview', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block mb-1">نظرة عامة والوصف (بالعربية)</label>
                            <textarea
                              rows={2}
                              value={proj.overview_ar || ''}
                              onChange={(e) => handleProjectChange(idx, 'overview_ar', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          {/* RICH INTERACTIVE BRANDS & LOGOS EDITOR */}
                          <div className="md:col-span-2 bg-fb-white p-5 rounded-2xl border border-fb-teal/20 space-y-4">
                            <div className="flex items-center justify-between border-b border-fb-teal/10 pb-3">
                              <label className="text-fb-teal font-extrabold flex items-center gap-2">
                                <Tag size={18} className="text-fb-green" />
                                <span>{locale === 'ar' ? 'العلامات التجارية واللوجوهات داخل المشروع' : 'Secured Brands & Logos in Project'}</span>
                                <span className="text-[10px] text-fb-green font-mono bg-fb-green/10 px-2 py-0.5 rounded">
                                  {proj.brands ? proj.brands.length : 0} {locale === 'ar' ? 'براندات' : 'Brands'}
                                </span>
                              </label>
                            </div>

                            {/* Active Brand Badges */}
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(proj.brands) && proj.brands.map((bName, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="inline-flex items-center gap-1.5 bg-fb-bg-light/80 border border-fb-teal/20 text-fb-teal font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs"
                                >
                                  <span>{bName}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBrandFromProject(idx, bIdx)}
                                    className="text-red-600 hover:bg-red-100 p-0.5 rounded-full transition-colors"
                                    title="حذف هذا البراند"
                                  >
                                    <X size={13} />
                                  </button>
                                </span>
                              ))}
                            </div>

                            {/* Add New Brand Input & Quick Preset Buttons */}
                            <div className="space-y-2 pt-2 border-t border-fb-teal/10">
                              <span className="text-[11px] font-bold text-fb-teal/70 block">
                                {locale === 'ar' ? 'إضافة براند جديد للمشروع:' : 'Add Brand to Project:'}
                              </span>
                              
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <input
                                  type="text"
                                  id={`new-brand-input-${idx}`}
                                  placeholder={locale === 'ar' ? 'اكتب اسم البراند بالإنجليزية (مثلاً: Starbucks)' : 'Type brand name (e.g. Starbucks)'}
                                  className="flex-1 bg-fb-bg-light/50 border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal focus:outline-none focus:border-fb-green"
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
                                    const inputEl = document.getElementById(`new-brand-input-${idx}`);
                                    if (inputEl && inputEl.value) {
                                      handleAddBrandToProject(idx, inputEl.value);
                                      inputEl.value = '';
                                    }
                                  }}
                                  className="bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-4 py-2.5 rounded-xl text-xs shrink-0 transition-colors shadow-xs"
                                >
                                  {locale === 'ar' ? '+ إضافة براند' : '+ Add Brand'}
                                </button>
                              </div>

                              {/* Quick Add Presets */}
                              <div className="pt-2">
                                <span className="text-[10px] text-fb-teal/60 font-semibold block mb-1">
                                  {locale === 'ar' ? 'إضافة سريعة لعلامات تجارية شهيرة:' : 'Quick Add Popular Brands:'}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    "McDonald's", "Carrefour", "El Ezaby Pharmacy", "Spinneys", "TBS", "Cilantro",
                                    "Papa John's", "Bazooka", "Nine Two Nine", "Othaim Market", "Al Koftageya", "Sultan", "Burger Republic"
                                  ].map((pBrand) => (
                                    <button
                                      key={pBrand}
                                      type="button"
                                      onClick={() => handleAddBrandToProject(idx, pBrand)}
                                      className="text-[10px] bg-fb-teal/5 hover:bg-fb-green/20 hover:text-fb-teal text-fb-teal/80 border border-fb-teal/10 px-2.5 py-1 rounded-lg transition-colors font-medium"
                                    >
                                      + {pBrand}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 2: BLOGS */}
                {activeTab === 'blogs' && (
                  <div className="space-y-8">
                    {editableBlogsEn.map((blog, idx) => (
                      <div
                        key={blog.id || idx}
                        className="bg-fb-bg-light/30 border border-fb-teal/10 rounded-2xl p-6 space-y-6 shadow-xs relative"
                      >
                        <div className="flex items-center justify-between border-b border-fb-teal/10 pb-4">
                          <span className="bg-fb-teal text-fb-white text-xs font-extrabold px-3 py-1 rounded-lg font-mono">
                            #{idx + 1} Article ID: {blog.id}
                          </span>
                          <button
                            onClick={() => handleDeleteBlog(idx)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                          >
                            <Trash2 size={16} />
                            <span>{locale === 'ar' ? 'حذف المقال' : 'Delete'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-fb-teal">
                          <div>
                            <label className="block mb-1">Article Title (English)</label>
                            <input
                              type="text"
                              value={blog.title || ''}
                              onChange={(e) => handleBlogChangeEn(idx, 'title', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">عنوان المقال (بالعربية)</label>
                            <input
                              type="text"
                              value={editableBlogsAr[idx]?.title || ''}
                              onChange={(e) => handleBlogChangeAr(idx, 'title', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Category (English)</label>
                            <input
                              type="text"
                              value={blog.category || ''}
                              onChange={(e) => handleBlogChangeEn(idx, 'category', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">التصنيف (بالعربية)</label>
                            <input
                              type="text"
                              value={editableBlogsAr[idx]?.category || ''}
                              onChange={(e) => handleBlogChangeAr(idx, 'category', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          <div>
                            <label className="block mb-1">Date String</label>
                            <input
                              type="text"
                              value={blog.date || ''}
                              onChange={(e) => handleBlogChangeEn(idx, 'date', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                            />
                          </div>
                          <div>
                            <label className="block mb-1">التاريخ بالعربية</label>
                            <input
                              type="text"
                              value={editableBlogsAr[idx]?.date || ''}
                              onChange={(e) => handleBlogChangeAr(idx, 'date', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-1">Excerpt Summary (English)</label>
                            <textarea
                              rows={2}
                              value={blog.excerpt || ''}
                              onChange={(e) => handleBlogChangeEn(idx, 'excerpt', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block mb-1">الملخص القصير (بالعربية)</label>
                            <textarea
                              rows={2}
                              value={editableBlogsAr[idx]?.excerpt || ''}
                              onChange={(e) => handleBlogChangeAr(idx, 'excerpt', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block mb-1">Full Article Body (English)</label>
                            <textarea
                              rows={4}
                              value={blog.fullContent || ''}
                              onChange={(e) => handleBlogChangeEn(idx, 'fullContent', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block mb-1">محتوى المقال الكامل (بالعربية)</label>
                            <textarea
                              rows={4}
                              value={editableBlogsAr[idx]?.fullContent || ''}
                              onChange={(e) => handleBlogChangeAr(idx, 'fullContent', e.target.value)}
                              className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: BRANDS */}
                {activeTab === 'brands' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {editableBrands.map((brand, idx) => (
                        <div
                          key={brand.id || idx}
                          className="bg-fb-bg-light/40 border border-fb-teal/10 rounded-2xl p-4 space-y-3 relative flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between border-b border-fb-teal/10 pb-2">
                            <span className="text-[10px] font-mono font-bold text-fb-teal/60">Brand #{idx + 1}</span>
                            <button
                              onClick={() => handleDeleteBrand(idx)}
                              className="text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                              title="Delete Brand"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10px] font-bold text-fb-teal mb-0.5">Brand Name</label>
                              <input
                                type="text"
                                value={brand.name || ''}
                                onChange={(e) => handleBrandChange(idx, 'name', e.target.value)}
                                className="w-full bg-fb-white border border-fb-teal/20 rounded-lg p-2 text-xs text-fb-teal font-normal"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-fb-teal mb-0.5">Logo Image / Upload</label>
                              <div className="flex items-center space-x-1.5">
                                <input
                                  type="text"
                                  value={brand.logoUrl || ''}
                                  onChange={(e) => handleBrandChange(idx, 'logoUrl', e.target.value)}
                                  className="flex-1 bg-fb-white border border-fb-teal/20 rounded-lg p-2 text-xs text-fb-teal font-normal font-mono"
                                />
                                <label className="cursor-pointer bg-fb-teal text-fb-white hover:bg-fb-teal/90 p-2 rounded-lg text-xs shrink-0 transition-colors">
                                  <Upload size={14} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleBrandLogoFileUpload(idx, e.target.files[0])}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          {/* Image Preview */}
                          <div className="h-12 bg-fb-teal/80 rounded-lg flex items-center justify-center p-2 mt-2">
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              onError={(e) => e.target.style.display = 'none'}
                              className="max-h-full max-w-full object-contain brightness-0 invert opacity-90"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: COMPANY METRICS & CONTACT INFO */}
                {activeTab === 'company' && (
                  <div className="space-y-8">
                    {/* Counters Section */}
                    <div className="bg-fb-bg-light/40 border border-fb-teal/10 rounded-2xl p-6 space-y-4">
                      <h3 className="font-extrabold text-sm text-fb-teal border-b border-fb-teal/10 pb-3 flex items-center space-x-2">
                        <BarChart3 size={18} className="text-fb-green mr-1 ml-1" />
                        <span>{locale === 'ar' ? 'عدادات وإنجازات الشركة (Executive Counters)' : 'Company Key Achievements & Counters'}</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-fb-teal">
                        <div>
                          <label className="block mb-1">SQM Managed (المساحات المدارة)</label>
                          <input
                            type="text"
                            value={editableCounters.sqm || ''}
                            onChange={(e) => setEditableCounters({ ...editableCounters, sqm: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Occupancy Rate (معدل الإشغال)</label>
                          <input
                            type="text"
                            value={editableCounters.occupancy || ''}
                            onChange={(e) => setEditableCounters({ ...editableCounters, occupancy: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Global Brands (العلامات العالمية)</label>
                          <input
                            type="text"
                            value={editableCounters.brands || ''}
                            onChange={(e) => setEditableCounters({ ...editableCounters, brands: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Gas Plazas (محطات الوقود)</label>
                          <input
                            type="text"
                            value={editableCounters.gas || ''}
                            onChange={(e) => setEditableCounters({ ...editableCounters, gas: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Info & Social Links */}
                    <div className="bg-fb-bg-light/40 border border-fb-teal/10 rounded-2xl p-6 space-y-4">
                      <h3 className="font-extrabold text-sm text-fb-teal border-b border-fb-teal/10 pb-3 flex items-center space-x-2">
                        <Phone size={18} className="text-fb-green mr-1 ml-1" />
                        <span>{locale === 'ar' ? 'معلومات التواصل والروابط (Corporate Contact & Social)' : 'Company Contact & Social Links'}</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-fb-teal">
                        <div>
                          <label className="block mb-1">Corporate Email</label>
                          <input
                            type="text"
                            value={editableContact.email || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, email: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Corporate Phone</label>
                          <input
                            type="text"
                            value={editableContact.phone || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, phone: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">HQ Address (English)</label>
                          <input
                            type="text"
                            value={editableContact.address || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, address: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">عنوان المقر الرئيسي (بالعربية)</label>
                          <input
                            type="text"
                            value={editableContact.address_ar || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, address_ar: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Facebook URL</label>
                          <input
                            type="text"
                            value={editableContact.facebook || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, facebook: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">LinkedIn URL</label>
                          <input
                            type="text"
                            value={editableContact.linkedin || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, linkedin: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">Instagram URL</label>
                          <input
                            type="text"
                            value={editableContact.instagram || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, instagram: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                          />
                        </div>

                        <div>
                          <label className="block mb-1">TikTok URL</label>
                          <input
                            type="text"
                            value={editableContact.tiktok || ''}
                            onChange={(e) => setEditableContact({ ...editableContact, tiktok: e.target.value })}
                            className="w-full bg-fb-white border border-fb-teal/20 rounded-xl p-2.5 text-xs text-fb-teal font-normal font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
