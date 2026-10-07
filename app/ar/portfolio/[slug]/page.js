import Link from 'next/link';
import Image from 'next/image';
import projects from '@/data/projects.json';

const slugMap = {
  'chillout-10th-of-ramadan-banks': '10th-of-ramadan-chillout-station',
  'chillout-mostafa-kamel': 'mostafa-kamel-axis-new-cairo',
  'chillout-marina-5': 'marina-5-north-coast',
  'chillout-10th-of-ramadan-alrowad': 'al-rowad-club-10th-of-ramadan',
  'sour-nady-el-nady': 'sour-nady-el-nady-sheraton',
  'sour-nady-el-obour': 'sour-nady-el-obour',
  'el-salam-plaza-mall': 'el-salam-plaza-mall'
};

const reverseSlugMap = Object.entries(slugMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export default function PortfolioLocationPageAr({ params }) {
  const { slug } = params;
  const id = reverseSlugMap[slug] || slug;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return <div className="pt-32 pb-24 text-center">غير موجود</div>;
  }

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(project.location_ar || project.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": project.name_ar,
    "description": project.overview_ar,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": project.location_ar,
      "addressCountry": "EG"
    }
  };

  return (
    <main className="min-h-screen bg-fb-bg-light pt-32 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-fb-teal mb-4 text-balance">
            {project.name_ar} – مساحات تجارية للبراندات | إف بي
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {project.overview_ar}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-fb-teal/10 text-center shadow-sm">
            <div className="text-fb-green font-extrabold text-3xl mb-1">{project.metrics?.numBrands || project.brands?.length || '0'}</div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">العلامات التجارية</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-fb-teal/10 text-center shadow-sm">
            <div className="text-fb-green font-extrabold text-3xl mb-1">{project.mapInfo?.catchment_ar || 'عالي'}</div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">الزيارات اليومية</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-fb-teal/10 text-center shadow-sm">
            <div className="text-fb-green font-extrabold text-3xl mb-1">{project.metrics?.openingYear || '2024'}</div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">سنة الافتتاح</div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-bold text-fb-teal mb-6 text-center">البراندات الموجودة</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {project.brands && project.brands.map((brand, i) => (
              <div key={i} className="bg-white border border-fb-teal/15 px-4 py-2 rounded-xl text-sm font-semibold text-fb-teal shadow-sm">
                {brand}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 rounded-3xl overflow-hidden shadow-lg border border-fb-teal/10 h-[400px]">
          <iframe 
            width="100%" 
            height="100%" 
            src={mapUrl}
            frameBorder="0" 
            scrolling="no" 
            marginHeight="0" 
            marginWidth="0"
          ></iframe>
        </div>

        <div className="text-center">
          <Link href="/ar/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-fb-green hover:bg-emerald-600 text-white font-extrabold text-lg transition-all duration-300 shadow-xl">
            احجز مساحتك في هذا الموقع
          </Link>
        </div>
      </div>
    </main>
  );
}
