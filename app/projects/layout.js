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
  title: "F.B Company | Projects & Prime Commercial Assets",
  description: "Explore F.B Company's portfolio of premier fuel plazas and commercial developments across Egypt.",
};

export default function ProjectsRootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-fb-bg-light text-fb-black antialiased font-lama">
        <DataProvider>
          <LanguageProvider>
            <SmoothScroll />
            <CustomCursor />
            <Navbar />
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
