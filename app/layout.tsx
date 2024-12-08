import type { Metadata } from "next";
import "./globals.css";
import { Cairo } from "next/font/google";
export const metadata: Metadata = {
  title: "ارسال التعليقات والاراء",
};
const cairo = Cairo({ subsets: ["arabic"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
