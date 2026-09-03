import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIAssistant from "@/components/AIAssistant";
import AdminPanelModal from "@/components/AdminPanelModal";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  title: "F.B Company | Asset Management & Franchise Location Sourcing Egypt",
  description: "Research-driven investment and retail location sourcing strategies built to uncover high-value opportunities others overlook across Egypt.",
  icons: {
    icon: [
      {
        url: "/company/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/company/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/company/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
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
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'F.B Company',
  alternateName: 'F.B for Asset Management & Franchise Location Sourcing',
  url: 'https://fbcompany.com',
  logo: 'https://fbcompany.com/company/logo.png',
  description: 'Research-driven investment and retail location sourcing strategies across Egypt.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'B165, Dr. Ahmed Okasha St., El Banafseg Buildings',
    addressLocality: 'New Cairo',
    addressRegion: 'Cairo',
    addressCountry: 'EG',
  },
  telephone: '+201117751967',
  email: 'info@fbcompany.com',
  sameAs: [
    'https://www.facebook.com/profile.php?id=61563734981427',
    'https://www.instagram.com/fb_company1/',
    'https://www.linkedin.com/company/f-b-company1/',
  ],
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
