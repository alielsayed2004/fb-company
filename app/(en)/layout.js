import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import AdminPanelModal from "@/components/AdminPanelModal";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  metadataBase: new URL('https://fbassets.com'),
  title: "F.B Company | Asset Management & Franchise Location Sourcing in Egypt",
  description: "F.B Company identifies, develops, and manages high-traffic commercial locations across Egypt and connects them with leading franchise brands. From Vision to Value.",
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'ar': '/ar',
      'x-default': '/'
    }
  },
  openGraph: {
    title: "F.B Company | Asset Management & Franchise Location Sourcing in Egypt",
    description: "F.B Company identifies, develops, and manages high-traffic commercial locations across Egypt and connects them with leading franchise brands. From Vision to Value.",
    url: '/',
    siteName: 'F.B Company',
    images: [
      {
        url: '/company/logo.png',
        width: 800,
        height: 600,
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "F.B Company | Asset Management & Franchise Location Sourcing in Egypt",
    description: "F.B Company identifies, develops, and manages high-traffic commercial locations across Egypt and connects them with leading franchise brands. From Vision to Value.",
    images: ['/company/logo.png'],
  },
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
      "description": "F.B Company is an Egyptian asset management and franchise location sourcing firm. We identify, develop, and manage high-traffic commercial locations and match them with leading franchise brands across Egypt.",
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
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-fb-bg-light text-fb-black antialiased font-lama">
        <DataProvider>
          <LanguageProvider>
            <SmoothScroll />
            <CustomCursor />
            <Navbar />
            {/* Main layout container with padding-top for fixed navigation header */}
            <main className="flex-grow">
              {children}
            </main>
            <AIAssistant />
            <AdminPanelModal />
            <Footer />
          </LanguageProvider>
        </DataProvider>
      </body>
    </html>
  );
}
