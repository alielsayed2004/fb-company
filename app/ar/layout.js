import "../globals.css";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { revealScript } from "@/lib/reveal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    path: '/',
    locale: 'ar',
    title: "إف بي | إدارة الأصول وتوفير مواقع الفرنشايز في مصر",
    description: "شركة إف بي في القاهرة الجديدة: إدارة الأصول العقارية التجارية وتوفير مواقع الفرنشايز في محطات الوقود والمولات والأندية في مصر.",
  }),
  icons: {
    icon: [
      { url: "/company/icon.svg", type: "image/svg+xml" },
      { url: "/company/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/company/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/company/icon.svg",
    apple: "/company/icon-light.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://fbassets.com/#organization",
      "name": "F.B Company",
      "alternateName": ["FB Assets", "F.B Assets", "إف بي للاستثمار وإدارة الأصول"],
      "url": "https://fbassets.com",
      "logo": "https://fbassets.com/company/logo.png",
      "slogan": "From Vision to Value",
      "description": "F.B Company is an Egyptian asset management and franchise location sourcing firm. We identify, develop, and manage high-traffic commercial locations and match them with franchise brands across Egypt.",
      "email": "info@fbassets.com",
      "telephone": "+201117751967",
      "founder": { "@type": "Person", "name": "Eng. Mohamed Bahr", "jobTitle": "CEO" },
      "areaServed": { "@type": "Country", "name": "Egypt" },
      "knowsAbout": ["Asset Management", "Commercial Real Estate", "Franchise Location Sourcing", "Retail Site Selection", "Investment Management"],
      "sameAs": [
        "https://www.facebook.com/profile.php?id=61563734981427",
        "https://x.com/FB_Company1",
        "https://www.instagram.com/fb_company1/",
        "https://www.linkedin.com/company/f-b-company1/about/?viewAsMember=true",
        "https://www.tiktok.com/@fbcompany1"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://fbassets.com/#localbusiness",
      "name": "F.B Company",
      "parentOrganization": { "@id": "https://fbassets.com/#organization" },
      "url": "https://fbassets.com",
      "image": "https://fbassets.com/company/logo.png",
      "telephone": "+201117751967",
      "email": "info@fbassets.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "B165, Dr. Ahmed Okasha St., El Banafseg Buildings",
        "addressLocality": "New Cairo",
        "addressRegion": "Cairo Governorate",
        "addressCountry": "EG"
      },
      "areaServed": "Egypt"
    },
    {
      "@type": "WebSite",
      "@id": "https://fbassets.com/#website",
      "url": "https://fbassets.com",
      "name": "F.B Company",
      "publisher": { "@id": "https://fbassets.com/#organization" },
      "inLanguage": ["en", "ar"]
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <link rel="preload" href="/fonts/LamaSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/LamaSans-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-fb-bg-light text-fb-black antialiased font-lama">
        <DataProvider>
          <LanguageProvider initialLocale="ar">
            <SmoothScroll />
            <CustomCursor />
            <Navbar />
            {/* Main layout container with padding-top for fixed navigation header */}
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </DataProvider>
      </body>
    </html>
  );
}
