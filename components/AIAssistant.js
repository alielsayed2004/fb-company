'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Bot, RefreshCw, MessageSquare, 
  Phone, ArrowUpRight, ExternalLink, Sparkles, Building2,
  TrendingUp, MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { usePathname } from 'next/navigation';
import projectsData from '@/data/projects.json';
import Link from 'next/link';

export default function AIAssistant() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }
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
      ? "أهلاً بك! أنا مساعد F.B الذكي.\n\nأنا هنا لمساعدتك بكل دقة في:\n• استعراض مشاريعنا ومواقعها الحالية.\n• المساحات المتاحة لتسكين العلامات التجارية.\n• عوائد الاستثمار ونظام إدارة الأصول (Triple-Net).\n• حجز استشارة أو التواصل المباشر مع الإدارة.\n\nكيف يمكنني مساعدتك اليوم؟"
      : "Welcome! I am the F.B AI Advisor.\n\nI can directly assist you with:\n• Active commercial projects & location specs.\n• Prime retail spaces for franchise brands.\n• Asset yields (ROI) & Triple-Net (NNN) structures.\n• Scheduling executive consultations or direct contact.\n\nHow may I help your investment goals today?",
    actions: [
      { label: isAr ? '🏢 استعراض المشاريع' : '🏢 View Projects', query: isAr ? 'ما هي مشاريع F.B Company الحالية؟' : 'What are F.B Company current projects?' },
      { label: isAr ? '📈 العوائد الاستثمارية' : '📈 ROI & Yields', query: isAr ? 'ما هو العائد الاستثماري المتوقع؟' : 'What is the projected ROI?' },
      { label: isAr ? '💬 واتساب مباشر' : '💬 WhatsApp Direct', link: 'https://wa.me/201117751967?text=Hello%20FB%20Company' }
    ]
  }), [isAr]);

  const [messages, setMessages] = useState([]);
  const activeMessages = useMemo(() => (messages.length > 0 ? messages : [initialWelcomeMessage]), [messages, initialWelcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  // Quick minimal chips at the bottom
  const quickPromptChips = isAr ? [
    { label: "🏢 المشاريع المتاحة", query: "ما هي مشاريعكم ومواقعها الحالية؟" },
    { label: "📈 العائد (ROI)", query: "ما هو متوسط العائد الاستثماري لأصولكم؟" },
    { label: "🏪 تأجير مساحة تجارية", query: "عايز أجر محل أو مساحة تجارية في مشاريعكم" },
    { label: "💰 الأسعار وسعر المتر", query: "ما هو نظام التسعير والإيجارات في مشاريعكم؟" },
    { label: "📍 العاشر من رمضان", query: "تفاصيل مشروع العاشر من رمضان مركز البنوك" },
    { label: "🌊 مارينا 5 الساحل", query: "تفاصيل مشروع شيل أوت مارينا 5" },
    { label: "📑 عقود Triple-Net", query: "كيف يعمل نظام عقود الإيجار Triple-Net؟" },
    { label: "🤝 شركاء النجاح (البراندات)", query: "من هم أبرز العلامات التجارية والبراندات الشريكة؟" },
    { label: "ℹ️ عن الشركة", query: "مين هي شركة F.B وما هو حجم محفظتها؟" },
    { label: "📞 التواصل والواتساب", query: "كيف يمكنني التواصل هاتفياً أو عبر واتساب؟" }
  ] : [
    { label: "🏢 Active Projects", query: "What are your current commercial projects and locations?" },
    { label: "📈 Projected ROI", query: "What is the expected ROI and yield on your assets?" },
    { label: "🏪 Lease Retail Space", query: "How can I lease a commercial space or drive-thru unit?" },
    { label: "💰 Pricing & Lease Rates", query: "How are lease rates and pricing determined?" },
    { label: "📍 10th of Ramadan Hub", query: "Details on 10th of Ramadan Banks Center project" },
    { label: "🌊 Marina 5 North Coast", query: "Details on Chillout Hub Marina 5" },
    { label: "📑 Triple-Net Leases", query: "How does the Triple-Net lease model work?" },
    { label: "🤝 Corporate Tenants", query: "Who are your primary brand partners and tenants?" },
    { label: "ℹ️ About F.B Company", query: "Tell me about F.B Company and its portfolio scale." },
    { label: "📞 Contact & WhatsApp", query: "How can I contact the directors directly on WhatsApp?" }
  ];

  // Deep Institutional Knowledge Engine
  const getInstitutionalReply = (userQuery) => {
    const q = userQuery.toLowerCase().trim();

    // 1. WhatsApp & Direct Contact
    if (q.includes('واتساب') || q.includes('whatsapp') || q.includes('واتس') || q.includes('ارقام') || q.includes('رقم') || q.includes('تليفون') || q.includes('هاتف') || q.includes('phone') || q.includes('call')) {
      const phone = contactInfo?.phone || '+20 111 775 1967';
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      return {
        text: isAr
          ? `يسعدنا تواصلك المباشر مع فريق الإدارة والاستثمار بشركة F.B Company:\n\n📞 الهاتف المباشر: ${phone}\n💬 خدمة واتساب الفورية: متاحة على مدار الساعة\n✉️ البريد الإلكتروني: ${contactInfo?.email || 'info@fbcompany.com'}\n🏢 المقر: ${contactInfo?.address_ar || 'B165، شارع د. أحمد عكاشة، عمارات البنفسج، القاهرة الجديدة'}\n\nاضغط على الزر أدناه لبدء محادثة واتساب فورية:`
          : `We welcome you to connect directly with F.B Company's executive team:\n\n📞 Phone: ${phone}\n💬 WhatsApp: 24/7 dedicated investor channel\n✉️ Email: ${contactInfo?.email || 'info@fbcompany.com'}\n🏢 Office: ${contactInfo?.address || 'B165, Dr. Ahmed Okasha St., El Banafseg Buildings, New Cairo, Egypt'}\n\nClick below to start an instant WhatsApp conversation:`,
        actions: [
          { label: isAr ? '💬 بدء محادثة واتساب' : '💬 Chat on WhatsApp', link: `https://wa.me/${cleanPhone}?text=Hello%20FB%20Company` },
          { label: isAr ? '📞 اتصال هاتفي' : '📞 Call Now', link: `tel:${phone}` }
        ]
      };
    }

    // 2. Specific Project: 10th of Ramadan Banks Center
    if (q.includes('بنوك') || q.includes('banks') || (q.includes('عاشر') && q.includes('بنوك')) || q.includes('مركز البنوك')) {
      return {
        text: isAr
          ? `📍 شيل أوت هب – العاشر من رمضان (مركز خدمات البنوك):\n\n• المساحة: 7,200 م².\n• الكثافة المرورية: +120,000 مركبة وموظف يومياً.\n• نسبة الإشغال: 100% مؤجر بالكامل.\n• أبرز العلامات: ماكدونالدز، صيدليات العزبي، بازوكا، سيلانترو، TBS، ناين تو ناين، أسواق العثيم، بابا جونز.\n• نوع الأصل: مجمع خدمات وقود وتجزئة استراتيجي في قلب المنطقة الصناعية والمصرفية.`
          : `📍 Chillout Hub – 10th of Ramadan (Banks Service Center):\n\n• Land Area: 7,200 SQM.\n• Catchment: 120,000+ daily vehicles & industrial employees.\n• Occupancy: 100% fully leased.\n• Secured Brands: McDonald's, El Ezaby Pharmacy, Bazooka, Cilantro, TBS, 929, Othaim Market, Papa John's.\n• Asset Class: Flagship multi-service fuel and commercial retail plaza.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/chillout-10th-of-ramadan-banks' },
          { label: isAr ? '💬 استفسار عن الموقع' : '💬 Inquire on WhatsApp', link: 'https://wa.me/201117751967?text=Inquiry%20about%20Banks%20Center' }
        ]
      };
    }

    // 3. Specific Project: Marina 5
    if (q.includes('مارينا') || q.includes('marina') || q.includes('ساحل') || q.includes('north coast')) {
      return {
        text: isAr
          ? `📍 شيل أوت هب – مارينا 5 (الساحل الشمالي):\n\n• الموقع: طريق إسكندرية - مطروح الساحلي (كم 105، أمام فندق روتانا مباشرة).\n• المساحة: 9,200 م².\n• التدفق الصيفي: أكثر من 300,000 زائر أسبوعياً.\n• نسبة الإشغال: 98%.\n• المستأجرون: ماكدونالدز، سبينيس (Spinneys)، برجر ريبابليك، TBS، الشاشلك، السلطان، الكفتجية، صيدلية العزبي.`
          : `📍 Chillout Hub – Marina 5 (North Coast):\n\n• Location: Alex-Matrouh Coastal Highway (KM 105, directly facing Rotana Hotel gates).\n• Land Area: 9,200 SQM.\n• Peak Volume: 300,000+ weekly summer tourists.\n• Occupancy: 98%.\n• Secured Brands: McDonald's, Spinneys, Burger Republic, TBS, Shashlik, Sultan, Al Koftageya, El Ezaby Pharmacy.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/chillout-marina-5' },
          { label: isAr ? '💬 استفسار عن مارينا' : '💬 Inquire on WhatsApp', link: 'https://wa.me/201117751967?text=Inquiry%20about%20Marina%205' }
        ]
      };
    }

    // 4. Specific Project: Mostafa Kamel Axis
    if (q.includes('مصطفى كامل') || q.includes('mostafa kamel') || (q.includes('تجمع') && q.includes('مصطفى'))) {
      return {
        text: isAr
          ? `📍 شيل أوت هب – محور مصطفى كامل (القاهرة الجديدة):\n\n• الموقع: جنوب الأكاديمية، القاهرة الجديدة.\n• المساحة: 5,400 م².\n• الكتلة السكنية المخدومة: +85,000 نسمة في محيط 1.5 كم.\n• الإشغال: 100%.\n• العلامات: كارفور (Carrefour)، بابا جونز، صيدليات العزبي، برجر ريبابليك، ناين تو ناين، سيلانترو.`
          : `📍 Chillout Hub – Mostafa Kamel Axis (New Cairo):\n\n• Location: South of Academy, Mostafa Kamel Axis, New Cairo.\n• Land Area: 5,400 SQM.\n• Catchment: 85,000+ high-income residents within 1.5 km radius.\n• Occupancy: 100%.\n• Secured Brands: Carrefour, Papa John's, El Ezaby Pharmacy, Burger Republic, 929, Cilantro.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/chillout-mostafa-kamel' },
          { label: isAr ? '💬 استفسار عن المحور' : '💬 Inquire on WhatsApp', link: 'https://wa.me/201117751967?text=Inquiry%20about%20Mostafa%20Kamel' }
        ]
      };
    }

    // 5. Specific Project: Al-Rowad Club
    if (q.includes('رواد') || q.includes('rowad') || (q.includes('عاشر') && q.includes('نادي'))) {
      return {
        text: isAr
          ? `📍 شيل أوت هب – العاشر من رمضان (نادي الرواد):\n\n• الموقع: ملاصق لنادي الرواد الرياضي، العاشر من رمضان.\n• المساحة: 4,900 م².\n• الإشغال: 100%.\n• زوار النادي ورواد المحور: +40,000 زائر أسبوعياً.\n• العلامات: بازوكا، صيدليات العزبي، أسواق العثيم، هنقرستيشن، السلطان.`
          : `📍 Chillout Hub – 10th of Ramadan (Al-Rowad Club):\n\n• Location: Adjacent to Al-Rowad Sports Club, 10th of Ramadan City.\n• Land Area: 4,900 SQM.\n• Occupancy: 100%.\n• Footfall: 40,000+ sports club members and commuters.\n• Secured Brands: Bazooka, El Ezaby Pharmacy, Othaim Market, Hunger Station, Sultan.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/chillout-10th-of-ramadan-alrowad' },
          { label: isAr ? '💬 تواصل معنا' : '💬 Inquire on WhatsApp', link: 'https://wa.me/201117751967?text=Inquiry%20about%20Al-Rowad' }
        ]
      };
    }

    // 6. Specific Project: Sour Nady El Nady / Sheraton
    if (q.includes('نادي النادي') || q.includes('el nady') || q.includes('شيراتون') || q.includes('sheraton')) {
      return {
        text: isAr
          ? `📍 سور نادي النادي (شيراتون - هليوبوليس):\n\n• الموقع: منطقة شيراتون، مصر الجديدة، القاهرة.\n• المساحة: 3,800 م².\n• الكثافة السكنية: +70,000 نسمة من السكان المحليين.\n• الإشغال: 100%.\n• العلامات: ماكدونالدز، TBS، صيدليات العزبي، برجر ريبابليك، ناين تو ناين، سيلانترو.`
          : `📍 Sour Nady El Nady (Sheraton, Heliopolis):\n\n• Location: Sheraton Area, Heliopolis, Cairo.\n• Land Area: 3,800 SQM.\n• Urban Catchment: 70,000+ high-income residents.\n• Occupancy: 100%.\n• Secured Brands: McDonald's, TBS, El Ezaby Pharmacy, Burger Republic, 929, Cilantro.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/sour-nady-el-nady' }
        ]
      };
    }

    // 7. Specific Project: Sour Nady El Obour
    if (q.includes('عبور') || q.includes('obour')) {
      return {
        text: isAr
          ? `📍 سور نادي العبور (مدينة العبور):\n\n• الموقع: محيط نادي العبور الرياضي، مدينة العبور.\n• المساحة: 4,200 م².\n• الإشغال: 96%.\n• العلامات: كارفور، بابا جونز، صيدليات العزبي، الكفتجية، بازوكا.`
          : `📍 Sour Nady El Obour (Obour City):\n\n• Location: Obour Club Perimeter, Obour City.\n• Land Area: 4,200 SQM.\n• Occupancy: 96%.\n• Secured Brands: Carrefour, Papa John's, El Ezaby Pharmacy, Al Koftageya, Bazooka.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/sour-nady-el-obour' }
        ]
      };
    }

    // 8. Specific Project: El Salam Plaza Mall
    if (q.includes('سلام') || q.includes('salam') || q.includes('بلازا') || q.includes('مول')) {
      return {
        text: isAr
          ? `📍 مول السلام بلازا (ممر طريق السلام):\n\n• الموقع: ممر طريق السلام الحيوي، القاهرة.\n• المساحة: 6,200 م² (المباني 14,500 م²).\n• الحالة: قيد الإنشاء ومرحلة التخصيص النهائي (Under Construction 2026).\n• تدفق الطريق: +180,000 سيارة يومياً.\n• العلامات المخصصة: ماكدونالدز، صيدليات العزبي، TBS، سيلانترو.`
          : `📍 El Salam Plaza Mall (Transit Corridor):\n\n• Location: El Salam Main Transit Corridor, Cairo.\n• Land Area: 6,200 SQM (14,500 SQM BUA).\n• Status: Under Construction / Allocating (Opening 2026).\n• Highway Traffic: 180,000+ daily commuter vehicles.\n• Reserved Anchors: McDonald's, El Ezaby Pharmacy, TBS, Cilantro.`,
        actions: [
          { label: isAr ? '🔍 صفحة المشروع' : '🔍 View Project Page', link: '/projects/el-salam-plaza-mall' }
        ]
      };
    }

    // 9. Pricing & Rent per Meter / الأسعار وسعر المتر
    if (q.includes('سعر') || q.includes('اسعار') || q.includes('أسعار') || q.includes('بكام') || q.includes('بكم') || q.includes('price') || q.includes('cost') || q.includes('سعر المتر') || q.includes('كم سعر')) {
      return {
        text: isAr
          ? `💰 نظام التسعير الإيجاري والاستثماري:\n\nتعتمد أسعار الإيجار والعوائد في مشاريع F.B Company على دراسة دقيقة ومخصصة لكل موقع تشمل:\n\n1. نوع النشاط والمساحة المطلوبة (درايف ثرو، واجهة رئيسية، مساحة داخلية).\n2. الكثافة المرورية للمحور (مثل محور البنوك بالعاشر، مارينا 5، أو القاهرة الجديدة).\n3. مدة العقد ونموذج الإيجار (عقود Triple-Net طويلة الأجل 9-15 سنة).\n4. نسبة المشاركة في الدخل أو القيمة الإيجارية المحددة مع زيادات سنوية تحمي من التضخم.\n\nللحصول على عرض تسعير مخصص لنشاطك، يمكنك التواصل فوراً مع إدارة التأجير:`
          : `💰 Commercial Pricing & Valuation Intelligence:\n\nLease valuations and investor returns in F.B Company assets are custom-tailored based on:\n\n1. Concept & footprint (Drive-Thru, anchor frontage, inline retail).\n2. Highway catchment & vehicular volume (e.g. 10th of Ramadan Banks Hub, Marina 5, New Cairo).\n3. Lease tenure (institutional 9 to 15-year Triple-Net agreements).\n4. Structured escalations and inflation-hedged rental models.\n\nFor a customized commercial quote for your brand:`,
        actions: [
          { label: isAr ? '💬 طلب عرض أسعار عبر واتساب' : '💬 Request Pricing on WhatsApp', link: 'https://wa.me/201117751967?text=Pricing%20and%20leasing%20inquiry' }
        ]
      };
    }

    // 10. Renting / Leasing a Retail Unit / حجز مساحة أو تأجير
    if (q.includes('أجر') || q.includes('اجر') || q.includes('تأجير') || q.includes('ايجار') || q.includes('محل') || q.includes('مساحة') || q.includes('lease') || q.includes('rent') || q.includes('unit') || q.includes('مساحات متاحة')) {
      return {
        text: isAr
          ? `🏢 توفير وتأجير المساحات التجارية لكبرى العلامات:\n\nإذا كنت تمثل علامة تجارية (سلسلة مطاعم، كافيه، صيدلية، بنك، أو هايبر ماركت) أو ترغب في استئجار موقع درايف ثرو في مشروعاتنا:\n\n1. نقوم بدراسة متطلبات المساحة (من 50 م² إلى 1,500 م²).\n2. مطابقة النشاط مع المزيج التجاري للمجمع (Tenant Synergy).\n3. إتاحة خيارات في (العاشر من رمضان، القاهرة الجديدة، الساحل الشمالي، وطريق السويس والعبور).\n4. توقيع عقود ملزمة طويلة الأجل متوافقة مع متطلبات الامتياز التجاري.\n\nتواصل مباشرة مع مدير إدارة التسكين والفرنشايز:`
          : `🏢 Commercial Retail & Drive-Thru Leasing:\n\nIf you represent a corporate brand (F&B chain, café, pharmacy, bank, or supermarket) seeking prime retail locations:\n\n1. We assess required footprints (50 SQM to 1,500 SQM).\n2. Ensure tenant synergy with our existing anchor mix.\n3. Locations available across New Cairo, 10th of Ramadan, North Coast, and Transit Corridors.\n4. Institutional long-term lease covenants.\n\nContact our Franchise Sourcing Director directly:`,
        actions: [
          { label: isAr ? '💬 واتساب مع قسم التأجير' : '💬 WhatsApp Leasing Dept', link: 'https://wa.me/201117751967?text=I%20am%20interested%20in%20leasing%20a%20commercial%20space' },
          { label: isAr ? '📋 حجز استشارة تأجير' : '📋 Book Consultation', link: '/contact' }
        ]
      };
    }

    // 11. Landowners / أرض وعايز استثمرها
    if (q.includes('أرض') || q.includes('ارض') || q.includes('قطعة') || q.includes('land') || q.includes('عندي ارض') || q.includes('مستثمر') || q.includes('تطوير')) {
      return {
        text: isAr
          ? `🤝 شراكات تطوير واستثمار الأراضي التجارية:\n\nإذا كنت تمتلك قطعة أرض على محور رئيسي، طريق سريع، أو زاوية حيوية، نقوم في F.B Company بالآتي:\n\n• إعداد دراسة الجدوى وتعداد التدفق المروري (Vehicular Traffic Audit).\n• التخطيط المعماري وتقسيم المساحات (Master Planning).\n• تسكين كبرى العلامات العالمية (ماكدونالدز، كارفور، شيل أوت، صيدليات كبرى).\n• تحويل الأرض إلى أصل مدر لعائد سنوي صافي (14.5% - 17.5%) مع إدارة تشغيلية وقانونية كاملة.\n\nيسعدنا مناقشة موقع أرضك مباشرة:`
          : `🤝 Land Development & Commercial Partnerships:\n\nIf you own a land plot along a major highway, transit axis, or urban corner, F.B Company will:\n\n• Conduct precision vehicular traffic counting & catchment audits.\n• Execute commercial master planning & retail layouts.\n• Anchor blue-chip corporate tenants (McDonald's, Carrefour, Chillout, etc.).\n• Transform raw land into an asset yielding 14.5% - 17.5% net with turnkey management.\n\nLet's discuss your land plot directly:`,
        actions: [
          { label: isAr ? '💬 مناقشة موقع الأرض واتساب' : '💬 Discuss Land on WhatsApp', link: 'https://wa.me/201117751967?text=I%20have%20a%20land%20plot%20for%20development' }
        ]
      };
    }

    // 12. About F.B Company / مين أنتم / عن الشركة
    if (q.includes('مين انت') || q.includes('مين انتم') || q.includes('عن الشركة') || q.includes('من هي') || q.includes('about') || q.includes('who are you') || q.includes('فريق') || q.includes('تاريخ') || q.includes('مين صاحب الشركة') || q.includes('علي السيد')) {
      return {
        text: isAr
          ? `🏢 عن شركة F.B Company:\n\nشركة استثمار وتطوير رائدة في السوق المصري متخصصة في قطاعين استراتيجيين:\n\n1️⃣ إدارة الأصول التجارية (Commercial Asset Management):\nإدارة المجمعات ومحطات خدمة المسافرين بعقود Triple-Net لتحقيق عوائد سنوية تتراوح بين 14.5% إلى 17.5%.\n\n2️⃣ توفير وتسكين مواقع الفرنشايز (Franchise Location Sourcing):\nتوفير المواقع الحيوية غير المعروضة في السوق (Off-Market) لكبرى السلاسل مثل ماكدونالدز، كارفور، سبينيس، والعزبي.\n\n📊 الأرقام الرئيسية:\n• +500,000 م² مساحات مدارة.\n• +200 براند شريك.\n• 100% نسبة إشغال.`
          : `🏢 About F.B Company:\n\nA premier Egyptian firm operating across two core institutional verticals:\n\n1️⃣ Commercial Asset Management:\nManaging landmark retail travel plazas and corporate complexes under Triple-Net covenants yielding 14.5% to 17.5% net.\n\n2️⃣ Franchise Location Sourcing:\nSecuring exclusive, high-traffic off-market corner sites for global franchise chains (McDonald's, Carrefour, Spinneys, El Ezaby).\n\n📊 Key Highlights:\n• 500,000+ SQM sourced footprint.\n• 200+ partner brands.\n• 100% portfolio occupancy.`,
        actions: [
          { label: isAr ? '📖 صفحة من نحن' : '📖 About Us', link: '/about' },
          { label: isAr ? '💬 تواصل مع الإدارة' : '💬 WhatsApp Direct', link: 'https://wa.me/201117751967' }
        ]
      };
    }

    // 13. All Projects Overview / قائمة المشاريع
    if (q.includes('مشاريع') || q.includes('المشاريع') || q.includes('projects') || q.includes('project') || q.includes('كام مشروع') || q.includes('عدد المشاريع')) {
      const gasVal = counters?.gas || '8+';
      return {
        text: isAr
          ? `محفظة F.B Company تضم (${gasVal}) مشاريع تجارية متكاملة تم إنجازها بنجاح:\n\n1️⃣ شيل أوت هب – العاشر من رمضان (مركز البنوك): 7,200 م²\n2️⃣ شيل أوت هب – العاشر من رمضان (نادي الرواد): 4,900 م²\n3️⃣ شيل أوت هب – محور مصطفى كامل (القاهرة الجديدة): 5,400 م²\n4️⃣ شيل أوت هب – مارينا 5 (الساحل الشمالي): 9,200 م²\n5️⃣ سور نادي النادي – شيراتون مصر الجديدة: 3,800 م²\n6️⃣ سور نادي العبور – مدينة العبور: 4,200 م²\n7️⃣ مول السلام بلازا – طريق السلام: 6,200 م²\n\n📊 إجمالي المساحات يتجاوز 500,000 م² مع إشغال 100%.`
          : `F.B Company holds (${gasVal}) landmark commercial developments across Egypt:\n\n1️⃣ Chillout Hub – 10th of Ramadan Banks Center (7,200 SQM)\n2️⃣ Chillout Hub – 10th of Ramadan Al-Rowad Club (4,900 SQM)\n3️⃣ Chillout Hub – Mostafa Kamel Axis, New Cairo (5,400 SQM)\n4️⃣ Chillout Hub – Marina 5, North Coast (9,200 SQM)\n5️⃣ Sour Nady El Nady – Sheraton Heliopolis (3,800 SQM)\n6️⃣ Sour Nady El Obour – Obour City (4,200 SQM)\n7️⃣ El Salam Plaza Mall – Transit Axis (6,200 SQM)\n\n📊 Total sourced footprint exceeds 500,000 SQM with 100% occupancy.`,
        actions: [
          { label: isAr ? '📍 استكشف المشروعات' : '📍 Explore Projects', link: '/#portfolio' },
          { label: isAr ? '💬 تواصل مع الإدارة' : '💬 Chat on WhatsApp', link: 'https://wa.me/201117751967' }
        ]
      };
    }

    // 14. ROI & Financial Performance / العائد الاستثماري
    if (q.includes('roi') || q.includes('عائد') || q.includes('أرباح') || q.includes('ارباح') || q.includes('yield') || q.includes('عوائد') || q.includes('استثماري') || q.includes('نسبة')) {
      return {
        text: isAr
          ? `📊 مؤشرات العائد الاستثماري (Financial ROI & Yields):\n\n• متوسط صافي العائد السنوي (Net Yield): يتراوح بين 14.5% إلى 17.5%.\n• مواقع الدرايف ثرو (Drive-Thru): تحقق عوائد مضاعفة بفضل العمل على مدار 24 ساعة ومعدل الدوران المرتفع.\n• عقود طويلة الأجل (Triple-Net): مدعومة بزيادات سنوية مركبة تحمي الأصل تماماً من التضخم وتقلبات العملة.\n• إشغال 100%: جميع المحلات مؤجرة لشركات ذات ملاءة مالية سيادية وعالمية.`
          : `📊 Investment Returns & Yield Intelligence:\n\n• Net Annual Yield: Averages 14.5% to 17.5% backed by institutional NNN covenants.\n• Drive-Thru Outperformance: Generates premium returns via 24/7 continuous vehicular traffic.\n• Inflation-Hedged Growth: Contractual compound escalations safeguard capital principal.\n• 100% Occupancy: Zero vacancy risk with premier sovereign & blue-chip tenants.`,
        actions: [
          { label: isAr ? '📑 إدارة الأصول' : '📑 Asset Management', link: '/asset-management' },
          { label: isAr ? '💬 استشارة استثمارية' : '💬 WhatsApp Advisory', link: 'https://wa.me/201117751967?text=ROI%20inquiry' }
        ]
      };
    }

    // 15. Brand Partners Network / البراندات
    if (q.includes('براند') || q.includes('علامات') || q.includes('brands') || q.includes('شركاء') || q.includes('tenants') || q.includes('ماكدونالدز') || q.includes('كارفور') || q.includes('سبينيس')) {
      const brandsVal = counters?.brands || '200+';
      return {
        text: isAr
          ? `تضم شبكة F.B Company أكثر من (${brandsVal}) علامة تجارية رائدة عالمياً ومحلياً، ومنها:\n\n🍔 الأغذية والمشروبات (F&B):\nماكدونالدز، برجر كينج، كوستا كوفي، بابا جونز، سيلانترو، بازوكا، TBS، الشاشلك، برجر ريبابليك، ناين تو ناين، السلطان.\n\n🛒 التجزئة والسوبرماركت:\nكارفور، سبينيس (Spinneys)، أسواق العثيم، كازيون، سيركل كيه.\n\n💊 الصيدليات:\nصيدليات العزبي، صيدليات سيف.\n\n🏦 البنوك ومحطات الوقود:\nCIB، بنك QNB، شيل أوت هب (Chillout Hub)، وتوتال إنرجيز.`
          : `F.B Company's network encompasses over (${brandsVal}) premier corporate brands, including:\n\n🍔 Global & Regional F&B:\nMcDonald's, Burger King, Costa Coffee, Papa John's, Cilantro, Bazooka, TBS, Shashlik, Burger Republic, 929, Sultan.\n\n🛒 Supermarkets & Retail:\nCarrefour, Spinneys, Othaim Market, Kazyon, Circle K.\n\n💊 Pharmacies:\nEl Ezaby Pharmacy, Seif Pharmacy.\n\n🏦 Financial & Fuel:\nCIB Bank, QNB, Chillout Hub, and TotalEnergies.`,
        actions: [
          { label: isAr ? '🤝 تسكين العلامات' : '🤝 Franchise Sourcing', link: '/franchise-sourcing' }
        ]
      };
    }

    // 16. What is Triple-Net (NNN) Leases
    if (q.includes('triple') || q.includes('nnn') || q.includes('عقد') || q.includes('تضخم')) {
      return {
        text: isAr
          ? `📑 عقود الإيجار المؤسسية (Triple-Net Lease):\n\nهو المعيار الذهبي المعتمد لدى F.B Company في إدارة الأصول التجارية:\n\n1. بدون مصاريف تشغيلية على المالك (Zero Landlord Friction): يتحمل المستأجر مصاريف الصيانة والضرائب العقارية والتأمين.\n2. عقود طويلة الأجل (9 إلى 15 سنة ملزمة).\n3. تحصين الأصل ضد التضخم عبر بنود زيادة إيجارية سنوية.\n4. تدفق نقدي دوري ثابت ومضمون للمستثمر.`
          : `📑 Triple-Net (NNN) Corporate Lease Model:\n\nF.B Company's gold standard for commercial asset management:\n\n1. Zero Landlord Operating Drag: Tenant bears maintenance, property taxes, and insurance.\n2. Long-Term Security: 9 to 15-year binding agreements.\n3. Inflation Hedging: Structured annual escalation clauses.\n4. Predictable, passive cash flow for property owners.`,
        actions: [
          { label: isAr ? 'المزيد عن إدارة الأصول' : 'Asset Management Details', link: '/asset-management' }
        ]
      };
    }

    // Default Smart Fallback
    return {
      text: isAr
        ? `أهلاً بك! بصفتي المستشار الاستثماري لـ F.B Company، يمكنني تزويدك فوراً بـ:\n\n• 🏢 تفاصيل ومواقع مشاريعنا التجارية في مصر.\n• 🏪 المساحات والمحلات المتاحة للتأجير والتسكين.\n• 📈 مؤشرات العائد الاستثماري (ROI) وعقود Triple-Net.\n• 🤝 شراكات الأراضي وتطوير المواقع الحيوية.\n• 📞 أرقام التواصل المباشر ورابط واتساب الفوري.\n\nما الذي تود الاستفسار عنه تحديداً؟`
        : `Welcome! As F.B Company's investment advisor, I can directly provide:\n\n• 🏢 Details & locations of our commercial developments.\n• 🏪 Prime retail units & drive-thru spaces for lease.\n• 📈 Projected ROI, yields & Triple-Net lease structures.\n• 🤝 Land development partnerships & traffic audits.\n• 📞 Direct contact channels & instant WhatsApp link.\n\nWhat would you like to inquire about?`,
      actions: [
        { label: isAr ? '🏢 المشاريع' : '🏢 Projects', query: isAr ? 'ما هي مشاريعكم؟' : 'What are your projects?' },
        { label: isAr ? '💬 واتساب مباشر' : '💬 WhatsApp', link: 'https://wa.me/201117751967' }
      ]
    };
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
      const reply = getInstitutionalReply(query);
      const botMsg = { sender: 'bot', text: reply.text, actions: reply.actions };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* 1. Ultra-Minimal Floating Launcher (hidden when open) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-4 sm:right-6 rtl:right-auto rtl:left-4 sm:rtl:left-6 z-40"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(true)}
              aria-label={isAr ? 'فتح المساعد الذكي' : 'Open AI Assistant'}
              className="relative group w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#071315]/95 hover:bg-[#071315] text-white rounded-full border border-white/15 hover:border-fb-green/60 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(83,183,121,0.25)] backdrop-blur-2xl transition-all flex items-center justify-center cursor-pointer"
            >
              {/* Status Indicator */}
              <span className="absolute top-0 right-0 rtl:right-auto rtl:left-0 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fb-green opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-fb-green border-2 border-[#071315]" />
              </span>

              <Bot size={22} strokeWidth={1.8} className="text-fb-green group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Minimalist & Aesthetic Advisory Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-3 sm:right-6 rtl:right-auto rtl:left-3 sm:rtl:left-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] h-[580px] max-h-[82dvh] bg-[#071315]/95 backdrop-blur-3xl border border-white/[0.08] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.7),0_0_1px_1px_rgba(255,255,255,0.06)] flex flex-col overflow-hidden text-start"
          >
            {/* Minimal Header */}
            <div className="px-5 py-4 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-full bg-fb-green/10 border border-fb-green/20 flex items-center justify-center text-fb-green">
                  <Bot size={17} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm tracking-tight">
                      {isAr ? 'مساعد F.B الذكي' : 'F.B AI Advisor'}
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-fb-green" />
                  </div>
                  <span className="text-[10px] text-white/40 block font-mono">
                    {isAr ? 'محرك استشارات الأصول الفوري' : 'Direct Asset Intelligence'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([initialWelcomeMessage])}
                  className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
                  title={isAr ? 'محادثة جديدة' : 'New Chat'}
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors cursor-pointer"
                  title={isAr ? 'إغلاق' : 'Close'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-start scrollbar-none">
              {activeMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
                >
                  {/* Bubble */}
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line text-start ${
                      msg.sender === 'user'
                        ? 'bg-fb-green text-fb-teal font-semibold rounded-tr-xs rtl:rounded-tr-2xl rtl:rounded-tl-xs shadow-sm'
                        : 'bg-white/[0.04] border border-white/[0.06] text-white/90 rounded-tl-xs rtl:rounded-tl-2xl rtl:rounded-tr-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Interactive Action Buttons attached to Bot Message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {msg.actions.map((act, aIdx) => (
                        act.link ? (
                          <Link
                            key={aIdx}
                            href={act.link}
                            target={act.link.startsWith('http') ? '_blank' : '_self'}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-fb-green hover:text-fb-teal text-fb-green border border-fb-green/30 text-[11px] font-semibold transition-all shadow-sm"
                          >
                            <span>{act.label}</span>
                            <ExternalLink size={10} />
                          </Link>
                        ) : (
                          <button
                            key={aIdx}
                            onClick={() => handleSendMessage(act.query)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white/80 hover:text-white border border-white/10 text-[11px] font-medium transition-all cursor-pointer"
                          >
                            <span>{act.label}</span>
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Minimal Typing Dot Animation */}
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white/[0.04] border border-white/[0.06] px-4 py-3 rounded-2xl rounded-tl-xs flex items-center space-x-1.5 rtl:space-x-reverse">
                    <span className="w-1.5 h-1.5 rounded-full bg-fb-green animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-fb-green animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-fb-green animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Minimal Horizontal Chips */}
            <div className="px-3 py-2 bg-black/20 border-t border-white/[0.04] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  className="px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] hover:text-white text-white/65 border border-white/[0.06] text-[11px] font-medium transition-all shrink-0 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Minimal Input Bar */}
            <div className="p-3 bg-white/[0.01] border-t border-white/[0.06]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] focus-within:border-fb-green/40 rounded-full px-3.5 py-1.5 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isAr ? 'اسأل عن أي مشروع، مساحة، أو عائد...' : 'Ask about any project, space, or ROI...'}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-fb-green hover:bg-fb-green-hover disabled:opacity-30 text-fb-teal flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  aria-label="Send"
                >
                  <Send size={13} className={isAr ? 'rotate-180' : ''} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
