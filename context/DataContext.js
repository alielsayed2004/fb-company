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
    return parsed.map((p) => {
      if (p.id === 'chillout-suez-road-corridor' || p.id === 'el-salam-plaza-mall' || p.name_ar === 'السلام بلازا' || p.name_ar === 'مول السلام بلازا') {
        return {
          ...p,
          id: 'el-salam-plaza-mall',
          name: 'El Salam Plaza Mall',
          name_ar: 'مول السلام بلازا',
          city: 'El Salam',
          city_ar: 'مدينة السلام',
          location: 'El Salam Main Transit Corridor, Cairo',
          location_ar: 'ممر طريق السلام الرئيسي، القاهرة',
          mapInfo: {
            ...(p.mapInfo || {}),
            road: 'El Salam Transit Corridor',
            road_ar: 'ممر طريق السلام الرئيسي'
          }
        };
      }
      return p;
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

export const defaultBrands = Array.from({ length: 52 }, (_, i) => ({
  id: i + 1,
  name: `Brand Partner #${i + 1}`,
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
  email: "info@fbcompany.com",
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

        if (idbBrands) setBrands(idbBrands);
        else {
          const lsBrands = localStorage.getItem('fb_brands');
          if (lsBrands) setBrands(JSON.parse(lsBrands));
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
          mapUrl: defaultContactInfo.mapUrl
        };
        setContactInfo(mergedContact);
        await setStoredData('fb_contact_info', mergedContact);
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
    setContactInfo(newContact);
    await setStoredData('fb_contact_info', newContact);
    try {
      localStorage.setItem('fb_contact_info', JSON.stringify(newContact));
    } catch (e) {}
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
