import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/Providers/AuthProvider'
import { ThemeProvider } from "@/Providers/ThemeContext";
import I18nProvider from '@/components/I18nProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="antialiased">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem
          disableTransitionOnChange>
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