import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/Providers/AuthProvider'
import { ThemeProvider } from "@/Providers/ThemeContext";
import I18nProvider from '@/components/I18nProvider'

export default function RootLayout({ children, params }) {
  const locale = params?.locale || 'zh'
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark"
          enableSystem={false}
          storageKey="theme-preference"
          forcedTheme={undefined}
          disableTransitionOnChange={false}
        >
          <I18nProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
} 