'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import defaultProjects from '@/data/projects.json';
import { getStoredData, setStoredData, clearStoredData } from '@/lib/db';

const DataContext = createContext();

// Helper to sanitize old cached strings ("تشيل" -> "شيل", "شيل أوت" -> "شيل أوت هب", "Chillout" -> "Chillout Hub", and update El Salam Plaza Mall data)
const sanitizeArabicName = (data) => {
  if (!data) return data;
  let jsonStr = JSON.stringify(data)
    .replace(/تشيل أوت هب/g, 'شيل أوت هب')
    .replace(/تشيل أوت/g, 'شيل أوت هب')
    .replace(/تشيل/g, 'شيل')
    .replace(/شيل أوت\s*هب/g, 'شيل أوت هب')
    .replace(/شيل أوت(?!\s*هب)/g, 'شيل أوت هب')
    .replace(/شيل اوت(?!\s*هب)/g, 'شيل أوت هب')
    .replace(/Chillout\s*Hub/g, 'Chillout Hub')
    .replace(/Chillout(?!\s*Hub)/g, 'Chillout Hub');
  const parsed = JSON.parse(jsonStr);
  if (Array.isArray(parsed)) {
    return parsed
      .filter((p) => p && p.id !== 'project-1788785510962' && p.name !== 'Golden Gate Hub' && p.name_ar !== 'مركز جولدن جيت')
      .map((p) => {
        let updated = { ...p };
        // Sync correct video and coverImage paths for projects to ensure browser caches reflect changes
        if (updated.id === 'sour-nady-el-obour') {
          updated.video = '/projects/sour-nady-el-obour/video.mp4';
          updated.coverImage = '/projects/sour-nady-el-obour/cover.jpg';
        } else if (updated.id === 'chillout-mostafa-kamel') {
          updated.video = '/projects/chillout-mostafa-kamel/video.mp4';
          updated.coverImage = '/projects/chillout-mostafa-kamel/cover.jpg';
        } else if (updated.id === 'chillout-marina-5') {
          updated.video = '/projects/chillout-marina-5/video.mp4';
          updated.coverImage = '/projects/chillout-marina-5/cover.png';
        } else if (updated.id === 'sour-nady-el-nady') {
          updated.video = '/projects/sour-nady-el-nady/video.mp4';
          updated.coverImage = '/projects/sour-nady-el-nady/cover.png';
        } else if (updated.id === 'chillout-10th-of-ramadan-banks') {
          updated.video = '/projects/chillout-10th-of-ramadan-banks/video.mp4';
          updated.coverImage = '/projects/chillout-10th-of-ramadan-banks/Artboard 3.jpg';
        } else if (updated.id === 'chillout-10th-of-ramadan-alrowad') {
          updated.video = '/projects/chillout-10th-of-ramadan-alrowad/video.mp4';
          updated.coverImage = '/projects/chillout-10th-of-ramadan-alrowad/Artboard 4.jpg';
        }

        if (p.id === 'chillout-suez-road-corridor' || p.id === 'el-salam-plaza-mall' || p.name_ar === 'السلام بلازا' || p.name_ar === 'مول السلام بلازا') {
          return {
            ...updated,
            id: 'el-salam-plaza-mall',
            name: 'El Salam Plaza Mall',
            name_ar: 'مول السلام بلازا',
            city: 'El Salam',
            city_ar: 'مدينة السلام',
            location: 'El Salam Main Transit Corridor, Cairo',
            location_ar: 'ممر طريق السلام الرئيسي، القاهرة',
            video: '/projects/el-salam-plaza-mall/video.mp4',
            coverImage: '/projects/el-salam-plaza-mall/cover.jpg',
            mapInfo: {
              ...(updated.mapInfo || {}),
              road: 'El Salam Transit Corridor',
              road_ar: 'ممر طريق السلام الرئيسي'
            }
          };
        }
        return updated;
      });
  }
  return parsed;
};

export const defaultBlogsEn = [
  {
    id: 1,
    category: 'Market Analysis',
    title: 'Real Estate Market Trends 2026: What to Expect for Sourced Commercial Assets?',
    date: 'May 16',
    readTime: '4 min read',
    excerpt: "How data-driven catchment analysis and municipal zoning alignment are unlocking high-yielding travel plazas along Egypt's primary highways.",
    fullContent: "The commercial real estate landscape in Egypt is undergoing a fundamental structural transformation. Driven by rapid infrastructure development, new highway network expansions (such as the Cairo-Suez and Cairo-Ismailia transit corridors), and urban satellite city expansions (New Cairo, 10th of Ramadan, Obour), commercial corners along primary vehicular travel axes are delivering record yields.\n\nAt F.B Company, our primary data collection indicates that multi-brand service plazas—combining fuel stations, convenience retail, and drive-thru F&B anchors—outperform standalone commercial units by over 40% in tenant occupancy retention."
  },
  {
    id: 2,
    category: 'Franchise Sourcing',
    title: 'How to Choose the Perfect Rental Property: Expert Sourcing Tips for Global Brands',
    date: 'May 29',
    readTime: '5 min read',
    excerpt: 'Key metrics institutional retailers evaluate before securing multi-year lease covenants in suburban expansion centers.',
    fullContent: "Selecting the ideal retail site for a global franchise brand requires much more than simply assessing street visibility. High-performing franchise operators rely on rigorous demographic catchment models, directional traffic counts, peak commuter flow timings, and site ingress/egress safety.\n\nOur franchise location sourcing division at F.B Company analyzes over 15 physical parameters before presenting a plot to corporate brand representatives."
  },
  {
    id: 3,
    category: 'Asset Management',
    title: 'Triple-Net Corporate Leases: Strategic Trends for Creating High-Yield Holdings',
    date: 'June 2',
    readTime: '6 min read',
    excerpt: 'A strategic overview of risk mitigation, inflation-hedged lease agreements, and active tenant management in commercial fuel plazas.',
    fullContent: "Triple-Net (NNN) leases have emerged as the gold standard for institutional property owners and asset management firms in Egypt. Under an NNN agreement, corporate tenants assume responsibility for property taxes, building insurance, and structural maintenance, providing asset owners with predictable, low-friction net cash flows."
  },
  {
    id: 4,
    category: 'Strategic Network',
    title: 'Mortgage & Institutional Financing: Which Structure Offers Favorable Terms in Egypt?',
    date: 'June 17',
    readTime: '4 min read',
    excerpt: 'Analyzing vehicular volume growth along the Cairo-Suez and Ismailia transit corridors and their impact on retail asset valuation.',
    fullContent: "Navigating commercial real estate financing in Egypt requires strategic alignment between equity capitalization, debt service coverage ratios, and asset lease yields. Institutional lenders increasingly favor projects backed by multi-tenant long-term corporate covenants over speculative un-leased developments."
  }
];

export const defaultBlogsAr = [
  {
    id: 1,
    category: 'تحليلات السوق',
    title: 'اتجاهات سوق العقارات التجارية 2026: ما الذي يتوقعه المستثمرون للأصول المدارة؟',
    date: '16 مايو',
    readTime: 'قراءة 4 دقائق',
    excerpt: 'كيف يساهم تحليل التدفق المروري والتوافق التنظيمي في إطلاق مجمعات خدمية عالية العائد على الطرق السريعة بمصر.',
    fullContent: 'يشهد قطاع العقارات التجارية في مصر تحولاً هيكلياً جوهرياً. فمع التوسع السريع في شبكات الطرق السريعة ونمو المدن الجديدة، تحقق الأصول والمواقع التجارية الواصلة بين المحاور الرئيسية عوائد استثمارية قياسية.'
  },
  {
    id: 2,
    category: 'توفير المواقع',
    title: 'كيف تختار الموقع التجاري المثالي: نصائح الخبراء لتسكين العلامات التجارية العالمية',
    date: '29 مايو',
    readTime: 'قراءة 5 دقائق',
    excerpt: 'المؤشرات الرئيسية التي تعتمدها كبرى شبكات التجزئة قبل توقيع عقود الإيجار طويلة الأجل في المراكز الحضرية المتنامية.',
    fullContent: 'يتطلب اختيار الموقع التجاري المثالي لعلامات الفرنشايز العالمية ما هو أكثر بكثير من مجرد الرؤية الظاهرة للمبنى. تعتمد شبكات التجزئة الكبرى على نماذج دقيقة للذكاء الجغرافي، وإحصاءات اتجاهات المرور.'
  },
  {
    id: 3,
    category: 'إدارة الأصول',
    title: 'عقود الإيجار المؤسسية (Triple-Net): إستراتيجيات تعظيم العوائد وتحصين الأصول',
    date: '2 يونيو',
    readTime: 'قراءة 6 دقائق',
    excerpt: 'نظرة إستراتيجية على إدارة المخاطر، وهيكلة عقود الإيجار المحمية من التضخم، والإشراف النشط على المستأجرين.',
    fullContent: 'أصبحت عقود الإيجار المؤسسية طويلة الأجل (Triple-Net) الخيار المعياري الذهبي لملاك العقارات وشركات إدارة الأصول في مصر.'
  },
  {
    id: 4,
    category: 'الشبكة الإستراتيجية',
    title: 'التمويل الاستثماري والمؤسسي: أحدث الهياكل والحلول المتاحة للقطاع التجاري بمصر',
    date: '17 يونيو',
    readTime: 'قراءة 4 دقائق',
    excerpt: 'تحليل نمو الحركة المرورية على محاور القاهرة - السويس والإسماعيلية وأثرها المباشر على تقييم الأصول التجارية.',
    fullContent: 'يتطلب الحصول على التمويل العقاري والتجاري المؤسسي في مصر مواءمة إستراتيجية بين رأس المال الذاتي ومعدلات تغطية الديون.'
  }
];

const brandNamesMap = {
  1: "Salé Sucré", 2: "McDonald's", 3: "Hardee's", 4: "TBS", 5: "Pizza Hut",
  6: "Domino's Pizza", 7: "Nine Two Nine (929)", 8: "Circle K", 9: "Spinneys",
  10: "Tabali", 11: "Carrefour", 12: "KFC", 13: "Master", 14: "Breadfast",
  15: "Halawany El Abd", 16: "HungerStation", 17: "Papa John's", 18: "Tseppas",
  19: "Fawzy", 20: "El Ezaby Pharmacy", 21: "Etoile", 22: "Karam El Sham",
  23: "Buffalo Burger", 24: "Bazooka", 25: "Dream 2000", 26: "Al Kofteya",
  27: "Al Borg Laboratories", 28: "Second Cup", 29: "2B", 30: "Stuffit",
  31: "Just Smash", 32: "Shashlik", 33: "Nos Dasta", 34: "Kofta", 35: "Kaizo",
  36: "Wahmy", 37: "B.Laban", 38: "Osta Rosto", 39: "Dushka Burger",
  40: "Alfa Laboratories", 41: "Basma Mandi", 42: "Exception", 43: "Fatatry",
  44: "Remas Land", 45: "Dina Farms Feteera", 46: "TechnoScan", 47: "Ormet Fahmy",
  48: "Hamsharey", 49: "Burger Republic", 50: "Bakery Khan",
  51: "Sultana Ice Cream", 52: "Max Muscle", 53: "Pizza Party", 54: "Shawerma Eiram"
};

export const defaultBrands = Array.from({ length: 54 }, (_, i) => ({
  id: i + 1,
  name: brandNamesMap[i + 1] || `Brand Partner #${i + 1}`,
  logoUrl: `/logos/${i + 1}.png`
}));

export const defaultCounters = {
  sqm: "500,000+",
  occupancy: "100%",
  brands: "200+",
  gas: "8+"
};

export const defaultContactInfo = {
  address: "B165, Dr. Ahmed Okasha St., El Banafseg Buildings, New Cairo, Egypt",
  address_ar: "B165، شارع د. أحمد عكاشة، عمارات البنفسج، القاهرة الجديدة",
  email: "info@fbassets.com",
  phone: "+20 111 775 1967",
  mapUrl: "https://www.google.com/maps/place/FB+For+Assets+Management/@30.0343159,31.4653286,20.59z/data=!4m6!3m5!1s0x14583d006250c8a5:0x150a24e30755449!8m2!3d30.0344348!4d31.4654409!16s%2Fg%2F11lf4xhkxt?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D",
  facebook: "https://www.facebook.com/profile.php?id=61563734981427",
  instagram: "https://www.instagram.com/fb_company1/",
  linkedin: "https://www.linkedin.com/company/f-b-company1/about/?viewAsMember=true",
  tiktok: "https://www.tiktok.com/@fbcompany1",
  x: "https://x.com/FB_Company1"
};

export function DataProvider({ children }) {
  const [projects, setProjects] = useState(sanitizeArabicName(defaultProjects));
  const [blogsEn, setBlogsEn] = useState(defaultBlogsEn);
  const [blogsAr, setBlogsAr] = useState(defaultBlogsAr);
  const [brands, setBrands] = useState(defaultBrands);
  const [counters, setCounters] = useState(defaultCounters);
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const idbProjects = await getStoredData('fb_projects');
        const idbBlogsEn = await getStoredData('fb_blogs_en');
        const idbBlogsAr = await getStoredData('fb_blogs_ar');
        const idbBrands = await getStoredData('fb_brands');
        const idbCounters = await getStoredData('fb_counters');
        const idbContact = await getStoredData('fb_contact_info');

        if (idbProjects) {
          const cleanProjects = sanitizeArabicName(idbProjects);
          setProjects(cleanProjects);
          await setStoredData('fb_projects', cleanProjects);
        } else {
          const lsProjects = localStorage.getItem('fb_projects');
          if (lsProjects) {
            const cleanProjects = sanitizeArabicName(JSON.parse(lsProjects));
            setProjects(cleanProjects);
            localStorage.setItem('fb_projects', JSON.stringify(cleanProjects));
          } else {
            setProjects(sanitizeArabicName(defaultProjects));
          }
        }

        if (idbBlogsEn) setBlogsEn(idbBlogsEn);
        else {
          const lsBlogsEn = localStorage.getItem('fb_blogs_en');
          if (lsBlogsEn) setBlogsEn(JSON.parse(lsBlogsEn));
        }

        if (idbBlogsAr) setBlogsAr(idbBlogsAr);
        else {
          const lsBlogsAr = localStorage.getItem('fb_blogs_ar');
          if (lsBlogsAr) setBlogsAr(JSON.parse(lsBlogsAr));
        }

        let loadedBrands = idbBrands;
        if (!loadedBrands) {
          const lsBrands = localStorage.getItem('fb_brands');
          if (lsBrands) {
            try { loadedBrands = JSON.parse(lsBrands); } catch (e) {}
          }
        }
        if (Array.isArray(loadedBrands)) {
          setBrands(loadedBrands);
        } else {
          setBrands(defaultBrands);
        }

        if (idbCounters) {
          const updatedCounters = {
            ...idbCounters,
            sqm: (idbCounters.sqm === '50,000+' || idbCounters.sqm === '50,000' || idbCounters.sqm === '+50,000' || idbCounters.sqm === '50000' || idbCounters.sqm === '+50000' || !idbCounters.sqm) ? '500,000+' : idbCounters.sqm,
            brands: (idbCounters.brands === '60+' || idbCounters.brands === '+60' || !idbCounters.brands) ? '200+' : idbCounters.brands
          };
          setCounters(updatedCounters);
          await setStoredData('fb_counters', updatedCounters);
        } else {
          const lsCounters = localStorage.getItem('fb_counters');
          if (lsCounters) {
            const parsed = JSON.parse(lsCounters);
            const updatedCounters = {
              ...parsed,
              sqm: (parsed.sqm === '50,000+' || parsed.sqm === '50,000' || parsed.sqm === '+50,000' || parsed.sqm === '50000' || parsed.sqm === '+50000' || !parsed.sqm) ? '500,000+' : parsed.sqm,
              brands: (parsed.brands === '60+' || parsed.brands === '+60' || !parsed.brands) ? '200+' : parsed.brands
            };
            setCounters(updatedCounters);
            localStorage.setItem('fb_counters', JSON.stringify(updatedCounters));
          } else {
            setCounters(defaultCounters);
          }
        }

        const storedContact = idbContact || (localStorage.getItem('fb_contact_info') ? JSON.parse(localStorage.getItem('fb_contact_info')) : null);
        const mergedContact = {
          ...defaultContactInfo,
          ...(storedContact || {}),
          email: (!storedContact?.email || storedContact.email === 'info@fbcompany.com') ? 'info@fbassets.com' : storedContact.email,
          mapUrl: defaultContactInfo.mapUrl
        };
        setContactInfo(mergedContact);
        await setStoredData('fb_contact_info', mergedContact);
        try { localStorage.setItem('fb_contact_info', JSON.stringify(mergedContact)); } catch (e) {}

        // Always keep client in sync with the server data if admin secret available
        try {
          const adminSecret = typeof window !== 'undefined' ? sessionStorage.getItem('fb_admin_api_secret') : null;
          const syncRes = await fetch('/api/admin/sync', {
            headers: adminSecret ? { 'x-admin-secret': adminSecret } : {}
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData && syncData.success) {
              if (Array.isArray(syncData.projects) && syncData.projects.length > 0) {
                const cleanSyncProjects = sanitizeArabicName(syncData.projects);
                setProjects(cleanSyncProjects);
                await setStoredData('fb_projects', cleanSyncProjects);
                try { localStorage.setItem('fb_projects', JSON.stringify(cleanSyncProjects)); } catch (e) {}
              }
              if (Array.isArray(syncData.brands) && syncData.brands.length > 0) {
                setBrands(syncData.brands);
                await setStoredData('fb_brands', syncData.brands);
                try { localStorage.setItem('fb_brands', JSON.stringify(syncData.brands)); } catch (e) {}
              }
              if (Array.isArray(syncData.blogsEn)) {
                setBlogsEn(syncData.blogsEn);
                await setStoredData('fb_blogs_en', syncData.blogsEn);
              }
              if (Array.isArray(syncData.blogsAr)) {
                setBlogsAr(syncData.blogsAr);
                await setStoredData('fb_blogs_ar', syncData.blogsAr);
              }
              if (syncData.counters) {
                setCounters(syncData.counters);
                await setStoredData('fb_counters', syncData.counters);
              }
              if (syncData.contactInfo) {
                const cleanContact = {
                  ...syncData.contactInfo,
                  email: (!syncData.contactInfo.email || syncData.contactInfo.email === 'info@fbcompany.com') ? 'info@fbassets.com' : syncData.contactInfo.email
                };
                setContactInfo(cleanContact);
                await setStoredData('fb_contact_info', cleanContact);
                try { localStorage.setItem('fb_contact_info', JSON.stringify(cleanContact)); } catch (e) {}
              }
            }
          }
        } catch (syncErr) {
          // Sync api offline or client-only fallback
        }
      } catch (e) {
        console.error('Failed to load storage data', e);
      } finally {
        setIsDataLoaded(true);
      }
    }
    loadData();
  }, []);

  const saveProjects = async (newProjects) => {
    const cleanProjects = sanitizeArabicName(newProjects);
    setProjects(cleanProjects);
    await setStoredData('fb_projects', cleanProjects);
    try {
      localStorage.setItem('fb_projects', JSON.stringify(cleanProjects));
    } catch (e) {
      console.warn('localStorage quota limit reached, stored in IndexedDB seamlessly.', e);
    }
  };

  const saveBlogs = async (newBlogsEn, newBlogsAr) => {
    setBlogsEn(newBlogsEn);
    setBlogsAr(newBlogsAr);
    await setStoredData('fb_blogs_en', newBlogsEn);
    await setStoredData('fb_blogs_ar', newBlogsAr);
    try {
      localStorage.setItem('fb_blogs_en', JSON.stringify(newBlogsEn));
      localStorage.setItem('fb_blogs_ar', JSON.stringify(newBlogsAr));
    } catch (e) {}
  };

  const saveBrands = async (newBrands) => {
    setBrands(newBrands);
    await setStoredData('fb_brands', newBrands);
    try {
      localStorage.setItem('fb_brands', JSON.stringify(newBrands));
    } catch (e) {}
  };

  const saveCounters = async (newCounters) => {
    setCounters(newCounters);
    await setStoredData('fb_counters', newCounters);
    try {
      localStorage.setItem('fb_counters', JSON.stringify(newCounters));
    } catch (e) {}
  };

  const saveContactInfo = async (newContact) => {
    const cleanContact = {
      ...newContact,
      email: (!newContact.email || newContact.email === 'info@fbcompany.com') ? 'info@fbassets.com' : newContact.email
    };
    setContactInfo(cleanContact);
    await setStoredData('fb_contact_info', cleanContact);
    try {
      localStorage.setItem('fb_contact_info', JSON.stringify(cleanContact));
    } catch (e) {}
  };

  const refreshFromServer = async () => {
    try {
      const adminSecret = typeof window !== 'undefined' ? sessionStorage.getItem('fb_admin_api_secret') : null;
      const syncRes = await fetch('/api/admin/sync', {
        headers: adminSecret ? { 'x-admin-secret': adminSecret } : {}
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData && syncData.success) {
          if (Array.isArray(syncData.projects) && syncData.projects.length > 0) {
            const cleanSyncProjects = sanitizeArabicName(syncData.projects);
            setProjects(cleanSyncProjects);
            await setStoredData('fb_projects', cleanSyncProjects);
            try { localStorage.setItem('fb_projects', JSON.stringify(cleanSyncProjects)); } catch (e) {}
          }
          if (Array.isArray(syncData.brands)) {
            setBrands(syncData.brands);
            await setStoredData('fb_brands', syncData.brands);
            try { localStorage.setItem('fb_brands', JSON.stringify(syncData.brands)); } catch (e) {}
          }
          if (Array.isArray(syncData.blogsEn)) {
            setBlogsEn(syncData.blogsEn);
            await setStoredData('fb_blogs_en', syncData.blogsEn);
          }
          if (Array.isArray(syncData.blogsAr)) {
            setBlogsAr(syncData.blogsAr);
            await setStoredData('fb_blogs_ar', syncData.blogsAr);
          }
          if (syncData.counters) {
            setCounters(syncData.counters);
            await setStoredData('fb_counters', syncData.counters);
          }
          if (syncData.contactInfo) {
            const cleanContact = {
              ...syncData.contactInfo,
              email: (!syncData.contactInfo.email || syncData.contactInfo.email === 'info@fbcompany.com') ? 'info@fbassets.com' : syncData.contactInfo.email
            };
            setContactInfo(cleanContact);
            await setStoredData('fb_contact_info', cleanContact);
            try { localStorage.setItem('fb_contact_info', JSON.stringify(cleanContact)); } catch (e) {}
          }
          return { success: true, data: syncData };
        }
      }
      return { success: false, message: 'Server returned error or invalid data' };
    } catch (err) {
      console.error('refreshFromServer error:', err);
      return { success: false, message: err.message };
    }
  };

  const resetToDefault = async () => {
    const cleanDefaultProjects = sanitizeArabicName(defaultProjects);
    setProjects(cleanDefaultProjects);
    setBlogsEn(defaultBlogsEn);
    setBlogsAr(defaultBlogsAr);
    setBrands(defaultBrands);
    setCounters(defaultCounters);
    setContactInfo(defaultContactInfo);
    await clearStoredData();
    localStorage.removeItem('fb_projects');
    localStorage.removeItem('fb_blogs_en');
    localStorage.removeItem('fb_blogs_ar');
    localStorage.removeItem('fb_brands');
    localStorage.removeItem('fb_counters');
    localStorage.removeItem('fb_contact_info');
  };

  return (
    <DataContext.Provider
      value={{
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
        refreshFromServer,
        resetToDefault,
        isAdminOpen,
        setIsAdminOpen,
        isPasscodeOpen,
        setIsPasscodeOpen,
        isDataLoaded
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
