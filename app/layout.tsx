import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata = {
  title: "PolarTwin — Antarctic Digital Twin",
  description: "Digital Twin & Predictive Maintenance for Maitri & Bharati Stations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased overflow-x-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
