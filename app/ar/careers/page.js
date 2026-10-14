'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from '@/components/motion';
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  UploadCloud, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Building2, 
  Award, 
  X,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import HeroVideo from '@/components/HeroVideo';

const corporateEase = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: corporateEase }
  }
};

// Must match the server cap in app/api/careers/route.js (Vercel's request limit is 4.5 MB).
const MAX_CV_BYTES = 4 * 1024 * 1024;

const CAREERS_ERRORS = {
  rate_limited: { en: 'Too many submissions. Please wait a few minutes and try again.', ar: 'تم إرسال عدد كبير من الطلبات. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.' },
  missing_fields: { en: 'Please fill in your full name, email, phone and department.', ar: 'يرجى إدخال الاسم الكامل والبريد الإلكتروني ورقم الهاتف والقسم.' },
  invalid_email: { en: 'Please enter a valid email address.', ar: 'يرجى إدخال بريد إلكتروني صحيح.' },
  consent_required: { en: 'Please agree to the data usage consent.', ar: 'يرجى الموافقة على استخدام البيانات لأغراض التوظيف.' },
  file_too_large: { en: 'This file is larger than the 4 MB limit. Please upload a smaller file.', ar: 'حجم الملف يتجاوز الحد الأقصى المسموح به (4 ميجابايت). يرجى رفع ملف أصغر.' },
  file_type: { en: 'Only PDF, DOC or DOCX files are accepted.', ar: 'يُقبل فقط ملف بصيغة PDF أو DOC أو DOCX.' },
  invalid_request: { en: 'Your application could not be sent. Please try again.', ar: 'تعذّر إرسال الطلب. يرجى المحاولة مرة أخرى.' },
  delivery_failed: { en: 'Your application could not be delivered. Please try again, or email it to info@fbassets.com.', ar: 'تعذّر تسليم طلبك. يرجى المحاولة مرة أخرى أو إرساله إلى info@fbassets.com.' },
};

export default function CareersPage() {
  const { locale, t } = useLanguage();
  const isAr = locale === 'ar';

  const [department, setDepartment] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const departments = [
    { id: 'sales', nameAr: 'المبيعات', nameEn: 'Sales' },
    { id: 'operations', nameAr: 'التشغيل', nameEn: 'Operations' },
    { id: 'staff', nameAr: 'الموظفين والإدارة', nameEn: 'Staff / Administration' },
    { id: 'other', nameAr: 'أخرى', nameEn: 'Other' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_CV_BYTES) {
        setErrorMessage(isAr ? 'حجم الملف يتجاوز الحد الأقصى المسموح به (4 ميجابايت). يرجى رفع ملف أصغر.' : 'This file is larger than the 4 MB limit. Please upload a smaller file.');
        e.target.value = '';
        return;
      }
      setCvFile(file);
      setErrorMessage('');
    }
  };

  const handleRemoveFile = () => {
    setCvFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!department) {
      setErrorMessage(isAr ? 'يرجى اختيار القسم المتقدم له' : 'Please select a department');
      return;
    }

    if (!consent) {
      setErrorMessage(isAr ? 'يرجى الموافقة على استخدام البيانات لأغراض التوظيف' : 'Please agree to the data usage consent');
      return;
    }

    setStatus('submitting');

    const form = e.target;
    const formData = new FormData();
    formData.append('fullName', form.fullName.value);
    formData.append('email', form.email.value);
    formData.append('phone', form.phone.value);
    formData.append('department', department);
    formData.append('experience', form.experience.value);
    formData.append('startDate', form.startDate.value);
    formData.append('expectedSalary', form.expectedSalary.value);
    formData.append('consent', consent ? 'true' : 'false');
    formData.append('_gotcha', form._gotcha?.value || '');

    if (cvFile) {
      formData.append('cvFile', cvFile);
    }

    try {
      const response = await fetch('/api/careers', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        form.reset();
        setCvFile(null);
        setDepartment('');
        setConsent(false);
      } else {
        const code = response.status === 413 ? 'file_too_large' : data.code;
        setErrorMessage((CAREERS_ERRORS[code] || CAREERS_ERRORS.delivery_failed)[isAr ? 'ar' : 'en']);
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(CAREERS_ERRORS.delivery_failed[isAr ? 'ar' : 'en']);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-fb-bg-light">
      
      {/* 1. FULLSCREEN HERO SECTION (PREPARED FOR BACKGROUND VIDEO) */}
      <section className="bg-fb-teal text-fb-white relative overflow-hidden flex flex-col justify-center min-h-[100dvh] h-[100dvh] min-h-screen h-screen shrink-0 px-4 sm:px-6">
        {/* Background Video */}
        <HeroVideo src="/videos/careers.mp4" poster="/videos/careers-poster.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0 scale-105" />

        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Standardized Hero Grid Overlay */}
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />

        {/* Glowing floating blur objects */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-fb-green/10 rounded-full blur-3xl pointer-events-none" 
        />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl mx-auto z-10 relative space-y-4 w-full text-start"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-fb-green text-xs font-bold tracking-wider uppercase">
            <Briefcase size={14} className="shrink-0" />
            <span>{t('careers.eyebrow')}</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-fb-white max-w-3xl leading-snug font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[2.75rem] [text-wrap:balance]"
          >
            {t('careers.title')}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-fb-bg-light/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl"
          >
            {t('careers.subtitle')}
          </motion.p>
        </motion.div>

        {/* Scroll indicator pointing down to application form */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 sm:gap-2 text-white/70 hover:text-white transition-colors cursor-pointer select-none"
          onClick={() => {
            const formSection = document.getElementById('careers-form');
            if (formSection) formSection.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-xs uppercase tracking-widest font-semibold">{isAr ? 'نموذج التقديم' : 'Application Form'}</span>
          <div className="w-5 h-9 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-fb-green"
            />
          </div>
        </motion.div>
      </section>

      {/* 2. MAIN APPLICATION SECTION */}
      <section id="careers-form" className="py-12 sm:py-20 px-4 sm:px-6 flex-grow scroll-mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR: Institutional Advantages */}
          <motion.div 
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-5"
          >
            <div className="bg-white/70 backdrop-blur-md border border-fb-teal/10 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="space-y-1.5 text-start">
                <span className="text-xs font-bold text-fb-green-text uppercase tracking-widest block">
                  {isAr ? 'بيئة عمل مؤسسية' : 'Culture & Growth'}
                </span>
                <h2 className="font-extrabold text-fb-teal text-lg sm:text-xl leading-snug">
                  {t('careers.benefitsTitle')}
                </h2>
              </div>

              <div className="space-y-4 pt-1">
                {t('careers.benefits').map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-start">
                    <div className="w-8 h-8 rounded-xl bg-fb-teal/5 text-fb-green flex items-center justify-center shrink-0 mt-0.5 border border-fb-teal/10 shadow-2xs">
                      {idx === 0 ? <Building2 size={16} /> : idx === 1 ? <Award size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs sm:text-sm font-bold text-fb-teal">{b.title}</h3>
                      <p className="text-xs sm:text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Office info snapshot */}
              <div className="pt-4 border-t border-fb-teal/10 flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-fb-teal">{isAr ? 'المقر' : 'Location'}:</span>
                <span className="font-medium text-slate-700">{isAr ? 'القاهرة الجديدة، مصر' : 'New Cairo, Egypt'}</span>
              </div>
            </div>

            {/* Quick Note Card */}
            <div className="bg-fb-teal/5 border border-fb-teal/10 rounded-2xl p-5 text-start flex items-start gap-3">
              <ShieldCheck className="text-fb-green shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-slate-700 leading-relaxed">
                {isAr 
                  ? 'جميع البيانات والسير الذاتية يتم التعامل معها بسرية تامة ومطابقتها للمعايير المهنية لـ F.B Company.' 
                  : 'All candidate profiles and resumes are treated with strict corporate confidentiality.'}
              </p>
            </div>
          </motion.div>

          {/* MAIN FORM BLOCK */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-8 bg-white border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm"
          >
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-4 space-y-5"
              >
                <div className="w-16 h-16 rounded-full bg-fb-green/15 text-fb-green mx-auto flex items-center justify-center border border-fb-green/30 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-xl sm:text-2xl font-bold text-fb-teal">{t('careers.successTitle')}</h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('careers.successDesc')}</p>
                </div>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-fb-teal text-white hover:bg-fb-teal-light text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    {t('careers.submitAnother')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored */}
                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
                
                {/* Header title inside form */}
                <div className="text-start space-y-1 border-b border-fb-teal/10 pb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-fb-teal flex items-center gap-2">
                    <Briefcase size={20} className="text-fb-green shrink-0" />
                    <span>{t('careers.formTitle')}</span>
                  </h2>
                  <p className="text-xs text-slate-600">{t('careers.formSubtitle')}</p>
                </div>

                {/* ERROR ALERT */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl p-3.5 flex items-start gap-2.5 text-start"
                    >
                      <AlertCircle className="shrink-0 mt-0.5" size={17} />
                      <span className="font-medium">{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 1. PERSONAL INFORMATION (البيانات الشخصية) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-start">
                    <span className="w-1.5 h-4 bg-fb-green rounded-full" />
                    <h3 className="text-xs sm:text-sm font-bold text-fb-teal uppercase tracking-wider">
                      {t('careers.personalInfo')}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="fullName" className="text-xs font-bold text-fb-teal flex items-center gap-1">
                        <span>{t('careers.fullName')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          required
                          placeholder={t('careers.fullNamePlaceholder')}
                          className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all placeholder:text-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="email" className="text-xs font-bold text-fb-teal flex items-center gap-1">
                        <span>{t('careers.email')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder={t('careers.emailPlaceholder')}
                        className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="phone" className="text-xs font-bold text-fb-teal flex items-center gap-1">
                        <span>{t('careers.phone')}</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        placeholder={t('careers.phonePlaceholder')}
                        className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. JOB DETAILS & DEPARTMENT (تفاصيل الوظيفة والقسم) */}
                <div className="space-y-4 pt-2 border-t border-fb-teal/10">
                  <div className="flex items-center gap-2 text-start">
                    <span className="w-1.5 h-4 bg-fb-green rounded-full" />
                    <h3 className="text-xs sm:text-sm font-bold text-fb-teal uppercase tracking-wider">
                      {t('careers.jobDetails')}
                    </h3>
                  </div>

                  {/* Department Pills / Selection */}
                  <div className="space-y-2 text-start">
                    <label className="text-xs font-bold text-fb-teal flex items-center gap-1">
                      <span>{t('careers.department')}</span>
                      <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {departments.map((dept) => {
                        const isSelected = department === (isAr ? dept.nameAr : dept.nameEn);
                        const label = isAr ? dept.nameAr : dept.nameEn;
                        return (
                          <button
                            type="button"
                            key={dept.id}
                            onClick={() => setDepartment(label)}
                            className={`p-2.5 sm:p-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center cursor-pointer select-none ${
                              isSelected
                                ? 'bg-fb-teal text-white border-fb-teal shadow-xs ring-2 ring-fb-green/40'
                                : 'bg-fb-bg-light/80 text-fb-teal border-fb-teal/15 hover:border-fb-teal/40 hover:bg-white'
                            }`}
                          >
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Experience, Start Date, Expected Salary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    {/* Years of Experience */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="experience" className="text-xs font-bold text-fb-teal">
                        {t('careers.experience')}
                      </label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        placeholder={t('careers.experiencePlaceholder')}
                        className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {/* Available Start Date */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="startDate" className="text-xs font-bold text-fb-teal">
                        {t('careers.startDate')}
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all font-medium cursor-pointer"
                      />
                    </div>

                    {/* Expected Salary */}
                    <div className="space-y-1.5 text-start">
                      <label htmlFor="expectedSalary" className="text-xs font-bold text-fb-teal">
                        {t('careers.expectedSalary')}
                      </label>
                      <input
                        type="text"
                        id="expectedSalary"
                        name="expectedSalary"
                        placeholder={t('careers.expectedSalaryPlaceholder')}
                        className="w-full bg-fb-bg-light/80 border border-fb-teal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-base text-fb-teal focus:outline-none focus:border-fb-green focus:ring-1 focus:ring-fb-green/30 transition-all placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DOCUMENTS & CV UPLOAD (رفع السيرة الذاتية والموافقة) */}
                <div className="space-y-4 pt-2 border-t border-fb-teal/10">
                  <div className="flex items-center gap-2 text-start">
                    <span className="w-1.5 h-4 bg-fb-green rounded-full" />
                    <h3 className="text-xs sm:text-sm font-bold text-fb-teal uppercase tracking-wider">
                      {t('careers.documents')}
                    </h3>
                  </div>

                  {/* CV Upload Box */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-xs font-bold text-fb-teal block">
                      {t('careers.uploadCv')}
                    </label>

                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only" 
                      id="cvFileInput"
                      aria-label={t('careers.uploadCv')}
                      tabIndex={-1}
                    />

                    {!cvFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-fb-teal/20 hover:border-fb-green rounded-2xl p-5 text-center cursor-pointer transition-all bg-fb-bg-light/40 hover:bg-fb-bg-light/90 group"
                      >
                        <span className="flex w-10 h-10 rounded-full bg-fb-teal/5 text-fb-teal group-hover:text-fb-green group-hover:bg-fb-green/10 transition-colors mx-auto flex items-center justify-center mb-2">
                          <UploadCloud size={20} />
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-fb-teal group-hover:text-fb-green transition-colors">
                          {t('careers.chooseFile')}
                        </span>
                        <span className="block text-xs text-slate-600 mt-0.5">
                          {t('careers.uploadHint')}
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-fb-green/10 border border-fb-green/30 text-start">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileCheck size={20} className="text-fb-green shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-fb-teal truncate">{cvFile.name}</p>
                            <p className="text-xs text-slate-600">{(cvFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 hover:bg-white rounded-lg text-slate-600 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                          title={t('careers.removeFile')}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2 text-start">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-fb-green focus:ring-fb-green border-fb-teal/20 cursor-pointer shrink-0 accent-fb-green"
                        required
                      />
                      <span className="text-xs text-slate-700 leading-relaxed font-medium">
                        {t('careers.consent')} <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 bg-fb-green hover:bg-fb-green-hover disabled:bg-fb-green/50 text-fb-teal font-extrabold py-3.5 sm:py-4 rounded-xl text-sm transition-all shadow-md hover:shadow-fb-green/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-fb-teal border-t-transparent rounded-full animate-spin" />
                        <span>{t('careers.submitting')}</span>
                      </span>
                    ) : (
                      <>
                        <span>{t('careers.submit')}</span>
                        <Send size={16} className="rtl:rotate-180" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
