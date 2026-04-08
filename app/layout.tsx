import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import { AuthNavigation } from "@/components/AuthNavigation/AuthNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Manage your notes efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>NoteHub</a>
              <AuthNavigation />
            </nav>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
