//'use client';

import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/Providers/AuthProvider'
import { ThemeProvider } from "@/Providers/ThemeContext";

export const metadata = {
  title: "HTTPS 证书监控系统",
  description: "监控和管理您的域名 HTTPS 证书, 证书到期提醒, 证书自动更新",
  keywords: `HTTPS, 证书, 监控, 域名, SSL, TLS, 证书过期, 证书监控, 证书管理, 证书到期, 证书提醒, 证书更新, 证书自动更新, 证书自动续期`,
  icons:{
    icon:'/favicon.svg',
  }
};


export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body
        className={`antialiased`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
