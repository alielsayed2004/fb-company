'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldCheck, Radio, Scan, Crosshair, MapPin, 
  TrendingUp, Users, Percent, X, ArrowUpRight, Flame, Layers, Eye
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function EgyptScannerCard() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';

  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isAutoScanning, setIsAutoScanning] = useState(true);

  // Corridors and interactive hotspot pins
  const scanZones = [
    {
      id: 'cairo-suez',
      nameEn: 'Cairo-Suez Highway Axis',
      nameAr: 'محور طريق القاهرة - السويس السريع',
      latLong: '30.0511° N, 31.6044° E',
      dailyVehicles: '180,000+',
      dailyVehiclesAr: '+180,000 سيارة/يومياً',
      densityLevel: 'high', // 'high' (red), 'medium' (amber), 'steady' (green)
      tenants: ['Chillout Hub', 'McDonald\'s', 'Circle K', 'TotalEnergies'],
      occupancy: '100%',
      expectedYield: '14.8% Net Annual',
      expectedYieldAr: '14.8% صافي سنوي',
      typeEn: 'Multi-Service Travel Plaza',
      typeAr: 'مجمع خدمات ومحطة وقود إقليمية',
      x: 62, // % on map
      y: 46,
      corridorPath: 'M 40 50 Q 55 48 75 42',
    },
    {
      id: 'ramadan-hub',
      nameEn: '10th of Ramadan Banking & Retail Hub',
      nameAr: 'مجمع العاشر من رمضان والمركز المصرفي',
      latLong: '30.3012° N, 31.7421° E',
      dailyVehicles: '95,000+',
      dailyVehiclesAr: '+95,000 مركبة/يومياً',
      densityLevel: 'high',
      tenants: ['CIB Bank', 'QNB', 'Vodafone', 'Costa Coffee'],
      occupancy: '100%',
      expectedYield: '15.2% Net Annual',
      expectedYieldAr: '15.2% صافي سنوي',
      typeEn: 'Commercial & Banking Corner',
      typeAr: 'مركز تجاري ومصرفي رئيسي',
      x: 68,
      y: 35,
      corridorPath: 'M 45 42 Q 60 38 78 30',
    },
    {
      id: 'new-cairo',
      nameEn: 'New Cairo Banafseg Hub',
      nameAr: 'محور البنفسج والتجمع الأول - القاهرة الجديدة',
      latLong: '30.0244° N, 31.4357° E',
      dailyVehicles: '140,000+',
      dailyVehiclesAr: '+140,000 مركبة/يومياً',
      densityLevel: 'medium',
      tenants: ['Starbucks', 'Seif Pharmacies', 'Gourmet', 'TBS'],
      occupancy: '100%',
      expectedYield: '16.5% Net Annual',
      expectedYieldAr: '16.5% صافي سنوي',
      typeEn: 'Urban High-Density Strip',
      typeAr: 'ممشى تجاري حضري عالي الكثافة',
      x: 52,
      y: 54,
      corridorPath: 'M 35 58 Q 50 54 65 52',
    },
    {
      id: 'north-coast',
      nameEn: 'Alex-Matrouh Coastal Corridor (Km 105)',
      nameAr: 'طريق الإسكندرية - مطروح الساحلي (كم 105)',
      latLong: '30.8311° N, 28.9812° E',
      dailyVehicles: '300,000+ (Summer)',
      dailyVehiclesAr: '+300,000 زائر/أسبوعياً في الصيف',
      densityLevel: 'high',
      tenants: ['Chillout Hub', 'Burger King', 'TBS', 'Dunkin\''],
      occupancy: '100%',
      expectedYield: '17.2% Net Annual',
      expectedYieldAr: '17.2% صافي سنوي',
      typeEn: 'Prime Summer Destination Plaza',
      typeAr: 'مجمع خدمات وترفيه ساحلي رائد',
      x: 26,
      y: 28,
      corridorPath: 'M 10 32 Q 25 28 42 25',
    },
    {
      id: 'el-salam',
      nameEn: 'El Salam Transit Plaza',
      nameAr: 'مول السلام بلازا وممر العبور الرئيسي',
      latLong: '30.1588° N, 31.4211° E',
      dailyVehicles: '115,000+',
      dailyVehiclesAr: '+115,000 مركبة/يومياً',
      densityLevel: 'steady',
      tenants: ['Kazyon', 'Abu Auf', 'El Ezaby', 'Orange'],
      occupancy: '100%',
      expectedYield: '13.9% Net Annual',
      expectedYieldAr: '13.9% صافي سنوي',
      typeEn: 'Transit Retail Center',
      typeAr: 'مركز تجاري وخدمي حيوي',
      x: 48,
      y: 42,
      corridorPath: 'M 30 45 Q 46 42 58 40',
    }
  ];

  // Auto-cycle zones unless user clicked a pin
  useEffect(() => {
    if (!isAutoScanning) return;
    const timer = setInterval(() => {
      setActiveZoneIdx((prev) => (prev + 1) % scanZones.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoScanning, scanZones.length]);

  const activeZone = scanZones[activeZoneIdx];

  const handlePinClick = (zone, index) => {
    setIsAutoScanning(false);
    setActiveZoneIdx(index);
    setSelectedPin(zone);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#001D1E] text-fb-white border border-fb-green/30 shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between min-h-[500px] select-none group">
      
      {/* 1. Ambient Geospatial Background & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(83,179,121,0.22)_0%,rgba(0,29,30,0.98)_75%)] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(83, 179, 121, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(83, 179, 121, 0.25) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Rotating Radar Sweep Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[460px] md:h-[460px] rounded-full border border-fb-green/20 pointer-events-none">
        <div className="w-full h-full rounded-full border border-fb-green/10 flex items-center justify-center">
          <div className="w-2/3 h-2/3 rounded-full border border-fb-green/20 flex items-center justify-center">
            <div className="w-1/3 h-1/3 rounded-full border border-fb-green/30" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full animate-[spin_6s_linear_infinite] opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(83,179,121,0.6)_360deg)] pointer-events-none" />
      </div>

      {/* 2. Top HUD Bar */}
      <div className="relative z-20 flex items-center justify-between border-b border-fb-green/20 pb-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-start">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-fb-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fb-green" />
          </div>
          <div className="text-start">
            <span className="text-[11px] font-bold text-fb-green tracking-widest uppercase block leading-none">
              {isAr ? 'نظام الفحص المروري والفرص الاستثمارية' : 'AI GEOSPATIAL TRAFFIC & OPPORTUNITY RADAR'}
            </span>
            <span className="text-[9px] text-fb-bg-light/60 font-mono tracking-wider block mt-0.5">
              {isAr ? 'بيانات الكثافة المرورية وعوائد الأصول المباشرة' : 'PRECISION REAL-TIME CATCHMENT & YIELD HEATMAP'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoScanning(!isAutoScanning)}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all ${
              isAutoScanning 
                ? 'bg-fb-green/20 border-fb-green text-fb-green' 
                : 'bg-fb-teal/40 border-fb-teal/30 text-fb-bg-light/70 hover:text-fb-green'
            }`}
            title={isAr ? 'تبديل المسح التلقائي' : 'Toggle auto-rotation'}
          >
            {isAutoScanning ? (isAr ? 'مسح تلقائي: نشط' : 'AUTO: ON') : (isAr ? 'مسح يدوي' : 'MANUAL')}
          </button>
          
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-fb-teal/60 border border-fb-green/20 px-2.5 py-1 rounded-md text-[10px] font-mono text-fb-green">
            <Radio size={12} className="animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Map Canvas with Corridors & Pins */}
      <div className="relative z-20 my-4 flex-1 w-full min-h-[260px] flex items-center justify-center rounded-2xl bg-[#001415]/70 border border-fb-green/15 overflow-hidden">
        
        {/* SVG Corridor Flow Overlays */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="corridorGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#53B779" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#53B779" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#53B779" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="corridorRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4A4A" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FF4A4A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF4A4A" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="corridorAmber" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Render Active Highway Corridors */}
          {scanZones.map((zone) => (
            <path
              key={zone.id}
              d={zone.corridorPath}
              fill="none"
              stroke={
                zone.densityLevel === 'high' ? 'url(#corridorRed)' : zone.densityLevel === 'medium' ? 'url(#corridorAmber)' : 'url(#corridorGreen)'
              }
              strokeWidth={zone.id === activeZone.id ? '2' : '1'}
              strokeDasharray={zone.id === activeZone.id ? '2,2' : 'none'}
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {/* Interactive Hotspot Pins */}
        {scanZones.map((zone, idx) => {
          const isActive = idx === activeZoneIdx;
          return (
            <div
              key={zone.id}
              onClick={() => handlePinClick(zone, idx)}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group/pin p-2"
              title={isAr ? zone.nameAr : zone.nameEn}
            >
              <div className="relative flex items-center justify-center">
                {/* Glowing Wave Ring */}
                <span className={`absolute inline-flex rounded-full transition-all duration-500 ${
                  isActive ? 'w-9 h-9 opacity-80 animate-ping' : 'w-5 h-5 opacity-30 group-hover/pin:opacity-75'
                } ${
                  zone.densityLevel === 'high' ? 'bg-red-500' : zone.densityLevel === 'medium' ? 'bg-amber-400' : 'bg-fb-green'
                }`} />

                {/* Center Pin Disc */}
                <div className={`relative flex items-center justify-center rounded-full border shadow-lg transition-transform duration-300 ${
                  isActive ? 'w-6 h-6 scale-110' : 'w-4 h-4 group-hover/pin:scale-125'
                } ${
                  zone.densityLevel === 'high'
                    ? 'bg-red-500/90 border-red-300 text-white'
                    : zone.densityLevel === 'medium'
                    ? 'bg-amber-500/90 border-amber-300 text-white'
                    : 'bg-fb-green border-fb-white text-fb-teal'
                }`}>
                  <MapPin size={isActive ? 12 : 8} className="stroke-current stroke-[2.5]" />
                </div>

                {/* Floating Tag */}
                <div className={`absolute top-6 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all duration-300 pointer-events-none ${
                  isActive
                    ? 'bg-[#00282A] border border-fb-green text-fb-green opacity-100 scale-100 shadow-md'
                    : 'bg-[#001D1E]/80 border border-fb-teal/30 text-fb-bg-light/70 opacity-0 group-hover/pin:opacity-100 scale-95'
                }`}>
                  {isAr ? zone.nameAr.split(' ')[0] : zone.nameEn.split(' ')[0]}
                </div>
              </div>
            </div>
          );
        })}

        {/* Central HUD Target Lock Box for Active Zone */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 bg-[#001D1E]/95 border border-fb-green/40 backdrop-blur-md rounded-xl p-3.5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-start z-30"
          >
            <div className="space-y-1 flex-1 text-start">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-fb-green font-bold">
                  <Crosshair size={12} className="animate-spin" />
                  <span>{isAr ? 'الموقع المرصود' : 'ACTIVE ASSET'}</span>
                </span>
                <span className="text-fb-bg-light/40">•</span>
                <span className="text-fb-bg-light/70">{activeZone.latLong}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-fb-white tracking-tight">
                {isAr ? activeZone.nameAr : activeZone.nameEn}
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-[10px] text-fb-bg-light/80 pt-0.5 font-mono">
                <span className="text-fb-green font-bold flex items-center gap-1">
                  <TrendingUp size={11} />
                  {isAr ? activeZone.dailyVehiclesAr : activeZone.dailyVehicles}
                </span>
                <span className="text-fb-bg-light/50">|</span>
                <span className="text-amber-300 font-bold flex items-center gap-1">
                  <Percent size={11} />
                  {isAr ? activeZone.expectedYieldAr : activeZone.expectedYield}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPin(activeZone)}
              className="px-3.5 py-2 bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold text-[11px] rounded-lg shadow-md transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>{isAr ? 'عرض بيانات الفرصة' : 'VIEW METRICS'}</span>
              <ArrowUpRight size={13} />
            </button>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* 4. Live Telemetry Bar */}
      <div className="relative z-20 pt-2 border-t border-fb-green/20 flex flex-wrap items-center justify-between text-[10px] text-fb-bg-light/75 font-mono gap-2 text-start">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-start">
          <span className="flex items-center space-x-1.5 rtl:space-x-reverse text-fb-green font-bold">
            <Activity size={13} className="animate-pulse shrink-0" />
            <span>{isAr ? 'تحليل مباشر لـ 5 محاور طرق سريعة ومجمعات تجارية' : 'TRACKING 5 HIGHWAY TRAVEL PLAZAS & HUBS'}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[9px]">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
            <span className="text-fb-bg-light/60">{isAr ? 'كثافة حمراء' : 'High Flow'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px]">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-fb-bg-light/60">{isAr ? 'متوسطة' : 'Moderate'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px]">
            <span className="w-2 h-2 rounded-full bg-fb-green inline-block" />
            <span className="text-fb-bg-light/60">{isAr ? 'مستقرة' : 'Steady'}</span>
          </div>
        </div>
      </div>

      {/* 5. Glassmorphism Opportunity Deep-Dive Modal */}
      <AnimatePresence>
        {selectedPin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#002122] border border-fb-green/40 text-fb-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative space-y-6 text-start"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPin(null)}
                className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-2 rounded-full bg-fb-teal/50 hover:bg-fb-green hover:text-fb-teal text-fb-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="space-y-2 text-start">
                <span className="eyebrow text-fb-green font-mono text-[10px] block">{selectedPin.latLong}</span>
                <h3 className="text-xl md:text-2xl font-extrabold text-fb-white tracking-tight">
                  {isAr ? selectedPin.nameAr : selectedPin.nameEn}
                </h3>
                <p className="text-xs text-fb-bg-light/75">
                  {isAr ? selectedPin.typeAr : selectedPin.typeEn}
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#001415] border border-fb-green/20 p-4 rounded-xl text-start">
                  <span className="text-[10px] text-fb-bg-light/60 uppercase font-mono block mb-1">
                    {isAr ? 'الكثافة المرورية اليومية' : 'DAILY VEHICLES'}
                  </span>
                  <span className="text-base font-extrabold text-fb-green font-mono block">
                    {isAr ? selectedPin.dailyVehiclesAr : selectedPin.dailyVehicles}
                  </span>
                </div>

                <div className="bg-[#001415] border border-fb-green/20 p-4 rounded-xl text-start">
                  <span className="text-[10px] text-fb-bg-light/60 uppercase font-mono block mb-1">
                    {isAr ? 'صافي العائد الاستثماري' : 'EXPECTED YIELD'}
                  </span>
                  <span className="text-base font-extrabold text-amber-300 font-mono block">
                    {isAr ? selectedPin.expectedYieldAr : selectedPin.expectedYield}
                  </span>
                </div>

                <div className="bg-[#001415] border border-fb-green/20 p-4 rounded-xl text-start">
                  <span className="text-[10px] text-fb-bg-light/60 uppercase font-mono block mb-1">
                    {isAr ? 'نسبة الإشغال الإيجاري' : 'OCCUPANCY RATE'}
                  </span>
                  <span className="text-base font-extrabold text-fb-white font-mono block">
                    {selectedPin.occupancy}
                  </span>
                </div>

                <div className="bg-[#001415] border border-fb-green/20 p-4 rounded-xl text-start">
                  <span className="text-[10px] text-fb-bg-light/60 uppercase font-mono block mb-1">
                    {isAr ? 'هيكل عقود الإيجار' : 'LEASE STRUCTURE'}
                  </span>
                  <span className="text-xs font-extrabold text-fb-green block">
                    Triple-Net (NNN)
                  </span>
                </div>
              </div>

              {/* Tenants Mix */}
              <div className="space-y-2 text-start">
                <span className="text-[10px] text-fb-bg-light/60 uppercase font-mono block">
                  {isAr ? 'أبرز المستأجرين والعلامات التجارية' : 'KEY TENANT MIX'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedPin.tenants.map((tenant, i) => (
                    <span key={i} className="px-3 py-1 bg-fb-teal/50 border border-fb-green/20 rounded-lg text-xs font-semibold text-fb-white">
                      {tenant}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-fb-green/20">
                <Link
                  href={`/contact?interest=sourcing&location=${selectedPin.id}`}
                  onClick={() => setSelectedPin(null)}
                  className="flex-1 py-3 bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold text-xs rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isAr ? 'طلب استشارة استثمارية لهذا الموقع' : 'INQUIRE ABOUT THIS OPPORTUNITY'}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
