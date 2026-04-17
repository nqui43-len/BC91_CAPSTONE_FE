import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Learning CyberSoft",
  description: "Dự án tốt nghiệp Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        {/* 3. Đặt Header ở đây, nó sẽ luôn nằm trên cùng của mọi trang */}
        <Header />
        
        {/* Phần children này chính là nội dung thay đổi của từng trang */}
        <main className="min-h-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
