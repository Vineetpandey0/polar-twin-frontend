import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Rajdhani, JetBrains_Mono } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "PolarTwin — NCPOR Antarctic Mission Operations Console",
  description: "Real-time SCADA Digital Twin & Telemetry Management for Maitri & Bharati Stations (SIH PS 26060)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${jetbrains.variable} h-screen overflow-hidden`}>
      <body className="bg-[#090D14] text-[#E2EAF4] font-sans antialiased h-screen overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

