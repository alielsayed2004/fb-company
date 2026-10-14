import "../globals.css";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import { revealScript } from "@/lib/reveal";
import { organizationJsonLd } from "@/lib/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    path: '/',
    locale: 'en',
    title: "F.B Company | Asset Management & Franchise Sourcing, Egypt",
    description: "F.B Company, New Cairo: commercial real estate asset management and franchise location sourcing in fuel stations, malls and clubs across Egypt.",
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

const organizationLd = organizationJsonLd('en');

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
        <link rel="preload" href="/fonts/LamaSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/LamaSans-ExtraBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-fb-bg-light text-fb-black antialiased font-lama">
        <DataProvider>
          <LanguageProvider>
            <SmoothScroll />
            <Navbar />
            {/* Main layout container with padding-top for fixed navigation header */}
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <Analytics />
          </LanguageProvider>
        </DataProvider>
      </body>
    </html>
  );
}
