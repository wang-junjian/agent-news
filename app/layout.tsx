import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tech Lab",
  description: "前沿 AI 研究成果展示平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
