import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "@/src/components/ScrollToTop";
import StoreProvider from "../redux/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Learning CyberSoft | Dự án Tốt nghiệp",
  description: "Nền tảng học trực tuyến chất lượng cao - Nơi khởi đầu sự nghiệp lập trình của bạn.",
  
  openGraph: {
    title: "E-Learning CyberSoft | Vươn tầm Lập trình viên",
    description: "Hơn 1000+ khóa học từ Zero đến Hero. Hệ thống đánh giá, cấp chứng chỉ và kết nối việc làm chuyên nghiệp.",
    url: "https://bc-91-capstone-fe.vercel.app/",
    siteName: "E-Learning CyberSoft",
    images: [
      {
        url: "https://bc-91-capstone-fe.vercel.app/logo.png", 
        width: 1200,
        height: 630,
        alt: "Ảnh đại diện E-Learning CyberSoft",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "E-Learning CyberSoft | Vươn tầm Lập trình viên",
    description: "Hơn 1000+ khóa học từ Zero đến Hero. Hệ thống đánh giá, cấp chứng chỉ và kết nối việc làm chuyên nghiệp.",
    images: ["https://bc-91-capstone-fe.vercel.app/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: Ngăn chặn cảnh báo lỗi đồng bộ giao diện (Hydration) do các Extension của trình duyệt gây ra
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <StoreProvider>
          <Header />
          <main className="min-h-full" style={{ paddingTop: "100px" }}>
            {children}
          </main>
          <Footer />
        </StoreProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
