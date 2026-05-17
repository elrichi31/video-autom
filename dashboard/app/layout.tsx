import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Generator · Dashboard",
  description: "Generador de videos de ciberseguridad e IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#0d0d0d]">{children}</body>
    </html>
  );
}
