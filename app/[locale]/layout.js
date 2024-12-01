// 为不同语言定义 metadata
const metadata = {
  zh: {
    title: "HTTPS 证书监控系统",
    description: "监控和管理您的域名 HTTPS 证书, 证书到期提醒, 证书自动更新",
    keywords: "HTTPS, 证书, 监控, 域名, SSL, TLS, 证书过期, 证书监控, 证书管理, 证书到期, 证书提醒, 证书更新, 证书自动更新, 证书自动续期"
  },
  en: {
    title: "HTTPS Certificate Monitor",
    description: "Monitor and manage your domain HTTPS certificates, certificate expiry alerts, automatic certificate updates",
    keywords: "HTTPS, Certificate, Monitor, Domain, SSL, TLS, Certificate Expiry, Certificate Monitoring, Certificate Management, Certificate Renewal, Certificate Alert, Certificate Update, Automatic Certificate Update, Automatic Certificate Renewal"
  }
};

export async function generateMetadata({ params }) {
  const locale = params?.locale || 'en';
  const meta = metadata[locale] || metadata.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    icons: {
      icon: '/favicon.svg',
    }
  };
}

export default function LocaleLayout({ children }) {
  return children;
} 