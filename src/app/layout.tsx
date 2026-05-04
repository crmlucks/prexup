import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "PrexUp | CRM de Bienes Raíces con IA",
  description: "SaaS CRM moderno y responsivo para agencias inmobiliarias potenciado por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="dark" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-inter bg-background text-foreground antialiased transition-colors duration-300`}>
        <ToastProvider>
          <div className="flex flex-col md:flex-row min-h-screen relative">
            <Sidebar />
            <main className="flex-1 min-h-screen p-2 md:p-6 lg:p-8 relative overflow-hidden transition-all duration-300 w-full">
              {/* Elementos de fondo decorativos */}
              <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-brand-blue/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-[1600px] mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
