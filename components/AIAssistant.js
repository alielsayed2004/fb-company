'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Sparkles, Bot, User, RefreshCw, ChevronRight, 
  Phone, ArrowUpRight, Building2, ShieldCheck, TrendingUp, Layers, HelpCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import Link from 'next/link';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { locale } = useLanguage();
  const { counters, contactInfo } = useData();
  const isAr = locale === 'ar';
  const messagesEndRef = useRef(null);

  const initialWelcomeMessage = useMemo(() => ({
    sender: 'bot',
    text: isAr
      ? "مرحباً بك! أنا «F.B Advisor» – المستشار الاستثماري الذكي لشركة F.B Company.\n\nيسعدني تزويدك بأدق التحليلات المؤسسية حول: عوائد الأصول التجارية (ROI)، دراسات الكثافة المرورية لمحاور السفر، عقود الإيجار المؤسسية (Triple-Net)، ومواقع تسكين سلاسل الفرنشايز العالمية في مصر. كيف يمكنني مساندة قراراتك الاستثمارية اليوم؟"
      : "Welcome! I am «F.B Advisor» – the institutional advisory engine for F.B Company.\n\nI am equipped to provide precise intelligence on commercial asset yields (ROI), highway catchment analytics, Triple-Net corporate leases, and franchise retail sourcing across Egypt. How may I assist your investment strategy today?"
  }), [isAr]);

  const [messages, setMessages] = useState([]);
  const activeMessages = useMemo(() => (messages.length > 0 ? messages : [initialWelcomeMessage]), [messages, initialWelcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const quickPromptChips = isAr ? [
    { label: "📊 العائد الاستثماري (ROI) للدرايف ثرو", query: "ما هو متوسط العائد الاستثماري لأصول الدرايف ثرو ومجمعات الوقود؟" },
    { label: "🛣️ تحليل محور القاهرة - الإسماعيلية", query: "ما هي الكثافة المرورية ومشاريعكم على طريق القاهرة - الإسماعيلية؟" },
    { label: "📑 هيكل عقود الإيجار Triple-Net", query: "كيف تعمل عقود الإيجار المؤسسية Triple-Net في حماية العوائد من التضخم؟" },
    { label: "📍 مواقع الفرنشايز والمساحات المتاحة", query: "كيف تساعدون كبرى سلاسل الفرنشايز في توفير وتسكين المواقع التجارية؟" },
    { label: "🏢 حجم المحفظة ومؤشرات الأداء", query: "ما هو حجم المحفظة العقارية ونسبة الإشغال لشركة F.B؟" }
  ] : [
    { label: "📊 ROI on Drive-Thru & Fuel Plazas", query: "What is the expected ROI on Drive-Thru assets and travel plazas?" },
    { label: "🛣️ Cairo-Ismailia Corridor Traffic", query: "Analyze vehicular traffic and your projects on the Cairo-Ismailia corridor." },
    { label: "📑 Triple-Net (NNN) Lease Models", query: "Explain how Triple-Net leases protect asset owners from inflation." },
    { label: "📍 Franchise Sourcing & Site Specs", query: "How do you source and secure prime locations for global franchise chains?" },
    { label: "🏢 Portfolio Size & Key Metrics", query: "What is F.B Company's total square footage and occupancy rate?" }
  ];

  const getInstitutionalReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. Number of Projects / عدد المشاريع وتفاصيلها
    if (q.includes('عدد المشاريع') || q.includes('كام مشروع') || q.includes('كم مشروع') || q.includes('عدد مشاريع') || q.includes('project count') || q.includes('how many projects') || q.includes('مشاريعنا') || q.includes('مشاريعكم')) {
      const gasVal = counters?.gas || '8+';
      return isAr
        ? `تمتلك وتدير شركة F.B Company محفظة تضم (${gasVal}) مشاريع تجارية كبرى تم إنجازها وهيكلتها بنجاح، ومن أبرزها:\n\n1️⃣ مجمع مركز البنوك (Banks Center) – العاشر من رمضان (7,200 م²).\n2️⃣ شيل أوت هب (Chillout Hub) مارينا 5 – الساحل الشمالي كم 105 (9,200 م²).\n3️⃣ مجمع البنفسج التجاري – القاهرة الجديدة (التجمع الأول).\n4️⃣ مول السلام بلازا – ممر طريق السلام والعبور (14,500 م²).\n5️⃣ نادي الرواد – العاشر من رمضان (4,900 م²).\n6️⃣ محطة خدمة وممشى طريق السويس الإقليمي.\n\n📊 جميع المشروعات مؤجرة بنسبة 100% لكبرى العلامات العالمية والمحلية.`
        : `F.B Company holds and manages a portfolio of (${gasVal}) landmark commercial projects structured across Egypt, including:\n\n1️⃣ Banks Service Center – 10th of Ramadan (7,200 SQM).\n2️⃣ Chillout Hub Marina 5 – North Coast Km 105 (9,200 SQM).\n3️⃣ El Banafseg Commercial Strip – New Cairo (1st Settlement).\n4️⃣ El Salam Plaza Mall – Transit Axis (14,500 SQM).\n5️⃣ Al-Rowad Club Plaza – 10th of Ramadan (4,900 SQM).\n6️⃣ Cairo-Suez Travel Plaza & Regional Corridor.\n\n📊 All properties maintain a 100% occupancy rate leased to top-tier brands.`;
    }

    // 2. How to Book a Consultation / ازاي تحجز استشارة
    if (q.includes('احجز') || q.includes('حجز') || q.includes('استشاره') || q.includes('استشارة') || q.includes('book') || q.includes('consultation') || q.includes('ازاي احجز') || q.includes('كيف احجز') || q.includes('موعد') || q.includes('مقابلة')) {
      return isAr
        ? `لحجز جلسة استشارية استثمارية أو سورسينج مع الإدارة التنفيذية لشركة F.B، يمكنك اتباع إحدى الطرق التالية:\n\n1️⃣ التقديم المباشر عبر الموقع:\nانتقل إلى صفحة «اتصل بنا» واملأ نموذج الاستشارة (الاسم، البريد، ونوع الاستفسار: إدارة أصول أو توفير مواقع فرنشايز).\n\n2️⃣ الاتصال الهاتفي المباشر:\n📞 هاتف الإدارة: 1967 775 111 20+\n\n3️⃣ عبر البريد الإلكتروني المؤسسي:\n✉️ إيميل: info@fbcompany.com\n\n🏢 المقر: B165، شارع د. أحمد عكاشة، عمارات البنفسج، القاهرة الجديدة.`
        : `To schedule an executive consultation with F.B Company directors, you can choose any of the following:\n\n1️⃣ Direct Online Form:\nVisit our «Contact Us» page and fill out the consultation request with your required asset class or franchise criteria.\n\n2️⃣ Direct Executive Phone:\n📞 Phone: +20 111 775 1967\n\n3️⃣ Institutional Email:\n✉️ Email: info@fbcompany.com\n\n🏢 HQ: B165, Dr. Ahmed Okasha St., El Banafseg Buildings, New Cairo.`;
    }

    // 3. Partner Brands Network / البراندات والعلامات التجارية الشريكة
    if (q.includes('براندات') || q.includes('براند') || q.includes('علامات') || q.includes('brands') || q.includes('شركاء') || q.includes('المستأجرين') || q.includes('tenants') || q.includes('شركائكم') || q.includes('مين البراندات')) {
      const brandsVal = counters?.brands || '200+';
      return isAr
        ? `تضم شبكة شركاء F.B Company أكثر من (${brandsVal}) علامة تجارية محلية وإقليمية وعالمية، من بينها:\n\n🍔 الأغذية والمشروبات (F&B):\nماكدونالدز، برجر كينج، كوستا كوفي، بابا جونز، سيلانترو، دانكن، الشاشلك، السلطان، TBS.\n\n🛒 التجزئة والسوبرماركت:\nسبينيس (Spinneys)، كازيون (Kazyon)، جورميه (Gourmet)، سيركل كيه (Circle K).\n\n💊 الصيدليات والخدمات الطبية:\nصيدليات العزبي، صيدليات سيف.\n\n🏦 البنوك والاتصالات:\nالبنك التجاري الدولي (CIB)، بنك QNB، فودافون، أورنج، محطات شيل أوت هب (Chillout Hub) وتوتال إنرجيز.`
        : `F.B Company's network encompasses over (${brandsVal}) corporate brand partners, including:\n\n🍔 Global & Regional F&B:\nMcDonald's, Burger King, Costa Coffee, Papa John's, Cilantro, Dunkin', Shashlik, TBS.\n\n🛒 Retail & Convenience:\nSpinneys, Kazyon, Gourmet, Circle K.\n\n💊 Health & Pharmacies:\nEl Ezaby Pharmacies, Seif Pharmacies.\n\n🏦 Banking & Telecom:\nCIB Bank, QNB, Vodafone, Orange, Chillout Hub, and TotalEnergies.`;
    }

    // 4. Locations & Geographic Spread / أماكن ومحافظات المشاريع
    if (q.includes('أماكن') || q.includes('فين') || q.includes('موقع') || q.includes('locations') || q.includes('محافظات') || q.includes('اين توجد') || q.includes('فين مشاريعكم') || q.includes('المواقع')) {
      return isAr
        ? `تتوزع مشروعات وأصول F.B Company في أهم المواقع الحيوية ومحاور النمو بمصر:\n\n📍 القاهرة الكبرى والمدن الجديدة: القاهرة الجديدة (التجمع الأول والبنفسج)، مدينة السلام، ومدينة العبور.\n📍 ممر العاشر من رمضان الصناعي والخدمي: طريق القاهرة - الإسماعيلية ومركز البنوك.\n📍 محور طريق القاهرة - السويس السريع: مجمعات ومحطات خدمة المسافرين.\n📍 الساحل الشمالي والإسكندرية: طريق إسكندرية - مطروح الساحلي (كم 105 أمام روتانا مارينا 5).`
        : `F.B Company's commercial assets and sourcing footprint span Egypt's highest-density travel corridors:\n\n📍 Greater Cairo & New Cities: New Cairo (1st Settlement & Banafseg), El Salam City, and Obour.\n📍 10th of Ramadan Axis: Cairo-Ismailia corridor and central Banking Hub.\n📍 Cairo-Suez Transit Highway: High-traffic travel plazas and retail stations.\n📍 North Coast & Alexandria: Alex-Matrouh Coastal Corridor (Km 105 at Marina 5).`;
    }

    // 5. What is Franchise Sourcing / يعني ايه توفير مواقع وفرنشايز
    if (q.includes('يعني ايه سورسينج') || q.includes('سورسينج') || q.includes('sourcing') || q.includes('فرنشايز') || q.includes('franchise') || q.includes('توفير مواقع') || q.includes('تسكين')) {
      return isAr
        ? `«توفير المواقع وتأمين الامتياز التجاري (Franchise Sourcing)»:\n\nهي خدمة استراتيجية تقدمها F.B لكبرى سلاسل الفرنشايز والشركات العالمية والمحلية، وتشمل:\n1. مسح وحساب الكثافة والتدفق المروري للموقع.\n2. التوافق الفني والبلدي واشتراطات التراجع وتراخيص النشاط.\n3. الاستحواذ على الأراضي والزوايا غير المعروضة بالسوق (Off-Market).\n4. صياغة عقود إيجار طويلة الأجل تضمن استقرار ونمو العلامة التجارية.`
        : `«Franchise Location Sourcing»:\n\nA strategic service tailored for international and national retail chains, encompassing:\n1. Precision vehicular traffic counting & catchment modeling.\n2. Municipal zoning, setback compliance, and permit feasibility audits.\n3. Acquiring exclusive off-market corner plots.\n4. Structuring institutional multi-year lease covenants.`;
    }

    // 6. What is Asset Management / يعني ايه إدارة أصول
    if (q.includes('ادارة اصول') || q.includes('إدارة الأصول') || q.includes('asset management') || q.includes('يعني ايه ادارة اصول') || q.includes('ادارة الاصول')) {
      return isAr
        ? `«إدارة الأصول العقارية (Asset Management)» لدى F.B Company تعني:\n\nتحويل الأراضي والعقارات التجارية إلى أصول استثمارية مدرة للدخل، عبر:\n• هيكلة عقود إيجار مؤسسية طويلة الأجل (Triple-Net).\n• اختيار مزيج مستأجرين قوي (Tenant Mix) يرفع قيمة العقار.\n• تحقيق عوائد صافية مستقرة تتراوح بين 14.5% إلى 17.5% سنوياً.\n• الإشراف التشغيلي والقانوني الكامل لضمان خلو المالك من أي أعباء صيانة أو متابعة يومية.`
        : `«Asset Management» at F.B Company means:\n\nTransforming commercial properties into high-yielding institutional assets by:\n• Structuring Triple-Net (NNN) long-term corporate leases.\n• Curating a synergistic tenant mix to maximize valuation.\n• Delivering stable net annual yields of 14.5% to 17.5%.\n• Providing turnkey legal and operational oversight with zero landlord friction.`;
    }

    // 7. ROI & Financial Yields
    if (q.includes('roi') || q.includes('عائد') || q.includes('أرباح') || q.includes('yield') || q.includes('عوائد') || q.includes('استثماري') || q.includes('نسبة الارباح')) {
      return isAr
        ? `تحقق محفظة الأصول التجارية المدارة بواسطة F.B Company مؤشرات عائد استثماري استثنائية:\n\n• متوسط صافي العائد السنوي (Net Yield): يتراوح بين 14.5% إلى 17.5% للأصول المؤجرة بعقود Triple-Net.\n• مواقع الدرايف ثرو (Drive-Thru): تحقق عوائد مضاعفة بفضل التدفق المستمر وارتفاع معدل دوران العملاء على مدار 24 ساعة.\n• عقود طويلة الأجل: مدعومة بزيادات سنوية تعاقدية تحمي رأس المال والأصول من التضخم وتقلبات العملة.`
        : `F.B Company's managed commercial asset portfolio delivers market-leading investment yields:\n\n• Net Annual Yield: Averages 14.5% to 17.5% backed by institutional Triple-Net (NNN) covenants.\n• Drive-Thru Assets: Generate premium cash flows driven by 24/7 continuous vehicular turnover.\n• Inflation-Hedged Covenants: Multi-year escalation clauses safeguard asset principal against market volatility.`;
    }

    // 8. Corridors & Catchment Traffic
    if (q.includes('إسماعيلية') || q.includes('ismailia') || q.includes('سويس') || q.includes('suez') || q.includes('محور') || q.includes('طريق') || q.includes('مرور') || q.includes('traffic') || q.includes('corridor') || q.includes('ساحل') || q.includes('coast')) {
      return isAr
        ? `تحليلات المحاور المرورية الرئيسية لشركة F.B:\n\n1. محور طريق القاهرة - الإسماعيلية (العاشر من رمضان):\n• تدفق مروري: +120,000 مركبة يومياً.\n• المشاريع: مجمع مركز البنوك (Banks Center 7,200 م²) ونادي الرواد.\n\n2. طريق القاهرة - السويس السريع:\n• تدفق مروري: +180,000 مسافر ومركبة يومياً.\n• الأصول: مجمعات ومحطات خدمة متكاملة.\n\n3. ممر الساحل الشمالي (كم 105):\n• ذروة صيفية: +300,000 زائر أسبوعياً أمام فندق روتانا بمارينا 5.`
        : `Key Highway Corridor Analytics by F.B Company:\n\n1. Cairo-Ismailia Transit Axis (10th of Ramadan):\n• Daily Volume: 120,000+ commuter vehicles.\n• Projects: Banks Center (7,200 SQM) & Al-Rowad Club Hub.\n\n2. Cairo-Suez Highway Corridor:\n• Daily Volume: 180,000+ transit travelers.\n• Assets: Multi-brand highway travel plazas.\n\n3. North Coast Highway (Km 105):\n• Peak Season Volume: 300,000+ weekly tourists at Chillout Hub Marina 5.`;
    }

    // 9. Triple-Net (NNN) Leases
    if (q.includes('triple') || q.includes('nnn') || q.includes('عقد') || q.includes('عقود') || q.includes('lease') || q.includes('إيجار') || q.includes('تضخم') || q.includes('قانوني')) {
      return isAr
        ? `نموذج عقود الإيجار المؤسسية (Triple-Net Lease) المعتمد لدينا:\n\n• انعدام الأعباء التشغيلية: يتحمل المستأجر المؤسسي (العلامة التجارية) مصاريف الصيانة التشغيلية، الضرائب العقارية، والتأمين.\n• استقرار التدفق النقدي: عقود ملزمة طويلة الأجل (من 9 إلى 15 سنة) مع كبرى العلامات العالمية.\n• حماية الحيازة: صياغة قانونية متوافقة مع أرقى أطر الحوكمة الاستثمارية في مصر.`
        : `Our Institutional Triple-Net (NNN) Corporate Lease Model:\n\n• Zero Operational Drag: Corporate tenants bear property taxes, building insurance, and routine maintenance.\n• Stable Cash Flows: 9 to 15-year binding agreements with sovereign-grade and blue-chip brands.\n• Capital Protection: Standardized legal frameworks compliant with institutional governance.`;
    }

    // 10. Portfolio Size & Stats
    if (q.includes('محفظة') || q.includes('مساحة') || q.includes('sqm') || q.includes('متر') || q.includes('إشغال') || q.includes('occupancy') || q.includes('حجم')) {
      const sqmVal = counters?.sqm || '500,000+';
      const occVal = counters?.occupancy || '100%';
      const brandsVal = counters?.brands || '200+';
      const gasVal = counters?.gas || '8+';
      return isAr
        ? `مؤشرات الأداء المؤسسي لشركة F.B Company:\n\n• إجمالي المساحات التجارية المدارة: ${sqmVal} متر مربع.\n• نسبة الإشغال الإيجاري: ${occVal} (مؤجرة بالكامل لكبرى السلاسل).\n• شبكة العلامات التجارية الشريكة: ${brandsVal} علامة تجارية.\n• مشاريع تجارية تم إنجازها وهيكلتها: ${gasVal} مشاريع ومجمعات كبرى.`
        : `F.B Company Institutional Portfolio Metrics:\n\n• Total Managed Sourced Footprint: ${sqmVal} SQM.\n• Tenant Occupancy Rate: ${occVal} (100% leased to prime covenants).\n• Brand Partners Network: ${brandsVal} corporate retailers.\n• Structured Commercial Plazas: ${gasVal} landmark hubs across Egypt.`;
    }

    // 11. Contact & Meeting
    if (q.includes('تواصل') || q.includes('contact') || q.includes('مقر') || q.includes('address') || q.includes('هاتف') || q.includes('phone') || q.includes('جلسة') || q.includes('meeting') || q.includes('عنوان')) {
      return isAr
        ? `يسعدنا ترتيب جلسة استشارية إستراتيجية مع خبرائنا:\n\n🏢 المقر الرئيسي:\n${contactInfo?.address_ar || 'B165، شارع د. أحمد عكاشة، عمارات البنفسج، القاهرة الجديدة'}\n\n✉️ البريد الإلكتروني: ${contactInfo?.email || 'info@fbcompany.com'}\n📞 الهاتف المباشر: ${contactInfo?.phone || '+20 111 775 1967'}\n\nيمكنك حجز استشارة مباشرة عبر صفحة «اتصل بنا».`
        : `We welcome you to schedule an executive consultation with our directors:\n\n🏢 Headquarters:\n${contactInfo?.address || 'B165, Dr. Ahmed Okasha St., El Banafseg Buildings, New Cairo, Egypt'}\n\n✉️ Email: ${contactInfo?.email || 'info@fbcompany.com'}\n📞 Phone: ${contactInfo?.phone || '+20 111 775 1967'}\n\nVisit our Contact page to submit your acquisition or leasing criteria.`;
    }

    // Default Smart Helpful Fallback
    return isAr
      ? `أهلاً بك! بصفتي المستشار الاستثماري لـ F.B Company، يمكنني إجابتك فوراً عن:\n\n• 🏢 عدد وتفاصيل مشاريعنا التجارية في مصر.\n• 📅 كيفية حجز وتنسيق جلسة استشارة مع الإدارة.\n• 🍔 قائمة البراندات العالمية والمحلية الشريكة.\n• 📍 أماكن ومحافظات أصولنا العقارية.\n• 📊 العائد الاستثماري (ROI) وعقود الـ Triple-Net.\n\nما هو سؤالك المحدد؟`
      : `Welcome! As F.B Company's advisory engine, I can directly assist you with:\n\n• 🏢 Portfolio breakdown and active commercial projects.\n• 📅 How to schedule an executive consultation.\n• 🍔 Brand partners and corporate tenant roster.\n• 📍 Geographic asset locations across Egypt.\n• 📊 Projected ROI and Triple-Net lease structures.\n\nWhat would you like to inquire about?`;
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => {
      const base = prev.length > 0 ? prev : [initialWelcomeMessage];
      return [...base, userMsg];
    });
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getInstitutionalReply(query);
      const botMsg = { sender: 'bot', text: replyText };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <>
      {/* 1. Floating Sleek Launcher Trigger (Icon Only) */}
      <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isAr ? 'فتح المستشار الذكي' : 'Open AI Advisor'}
          className="relative group w-14 h-14 bg-gradient-to-tr from-[#002B2D] to-fb-teal border border-fb-green/40 text-fb-white rounded-full shadow-[0_8px_30px_rgba(0,33,34,0.6)] hover:border-fb-green hover:shadow-[0_0_25px_rgba(83,183,121,0.5)] transition-all flex items-center justify-center"
        >
          {/* Animated Glow Pulse */}
          <span className="absolute inset-0 rounded-full bg-fb-green/20 animate-ping opacity-75 pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-center">
            <Bot size={24} strokeWidth={1.75} className="text-fb-green group-hover:scale-110 transition-transform" />
          </div>
        </motion.button>
      </div>

      {/* 2. Institutional Dark-Mode Advisory Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 md:right-6 rtl:right-auto rtl:left-4 md:rtl:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[85vh] bg-[#001D1E]/95 backdrop-blur-2xl border border-fb-green/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden text-start"
          >
            {/* Drawer Header */}
            <div className="p-4 md:p-5 bg-[#001415] border-b border-fb-green/20 flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse text-start">
                <div className="w-10 h-10 rounded-xl bg-fb-teal/60 border border-fb-green/30 flex items-center justify-center text-fb-green shadow-inner">
                  <Bot size={22} />
                </div>
                <div className="text-start">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-fb-white text-sm tracking-tight">
                      {isAr ? 'F.B المستشار الاستثماري' : 'F.B Institutional Advisor'}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-fb-green animate-pulse" />
                  </div>
                  <span className="text-[10px] text-fb-bg-light/60 font-mono tracking-wider block">
                    {isAr ? 'محرك تحليلات الأصول والفرص المباشر' : 'AI REAL ESTATE & SOURCING ENGINE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([initialWelcomeMessage])}
                  className="p-2 text-fb-bg-light/60 hover:text-fb-green hover:bg-fb-teal/40 rounded-lg transition-colors"
                  title={isAr ? 'إعادة ضبط المحادثة' : 'Reset Chat'}
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-fb-bg-light/60 hover:text-fb-white hover:bg-fb-teal/40 rounded-lg transition-colors"
                  title={isAr ? 'إغلاق' : 'Close'}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-fb-green/20 text-start">
              {activeMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line shadow-sm text-start ${
                      msg.sender === 'user'
                        ? 'bg-fb-green text-fb-teal font-semibold rounded-br-none rtl:rounded-br-2xl rtl:rounded-bl-none shadow-md'
                        : 'bg-[#002B2D] border border-fb-green/25 text-fb-bg-light/95 rounded-bl-none rtl:rounded-bl-2xl rtl:rounded-br-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#002B2D] border border-fb-green/20 p-3.5 rounded-2xl rounded-bl-none flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span className="w-2 h-2 rounded-full bg-fb-green animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-fb-green animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-fb-green animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips Carousel */}
            <div className="p-2.5 bg-[#001415]/80 border-t border-fb-green/15 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-3 py-1.5 rounded-full bg-fb-teal/50 hover:bg-fb-green hover:text-fb-teal text-fb-bg-light/90 border border-fb-green/20 text-[11px] font-semibold transition-all shrink-0 shadow-sm"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Bottom Input Area & Quick Consultation */}
            <div className="p-3 bg-[#001415] border-t border-fb-green/20 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isAr ? 'اسأل المستشار الاستثماري عن أي موقع أو عائد...' : 'Ask about yields, traffic catchments, or site sourcing...'}
                  className="flex-1 bg-[#002B2D] border border-fb-green/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-fb-white placeholder-fb-bg-light/40 focus:outline-none focus:border-fb-green transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 bg-fb-green hover:bg-fb-green-hover disabled:opacity-40 disabled:hover:bg-fb-green text-fb-teal font-bold rounded-xl shadow-md transition-all shrink-0"
                >
                  <Send size={16} className={isAr ? 'rotate-180' : ''} />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-fb-bg-light/50 px-1 font-mono">
                <span>{isAr ? 'بيانات أصول محدثة 2026' : 'UPDATED 2026 ASSET INTELLIGENCE'}</span>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-fb-green hover:underline flex items-center gap-1 font-bold"
                >
                  <span>{isAr ? 'طلب استشارة تنفيذية' : 'Book Consultation'}</span>
                  <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
