import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import i18next from 'i18next';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const locale = i18next.language === 'zh' ? 'zh-CN' : 'en-US';
  return date.toLocaleString(locale, { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export function formatCountdown(dateString) {
  if (!dateString) return 'N/A';
  const now = new Date();
  const expiryDate = new Date(dateString);
  const diff = expiryDate - now;
  
  if (diff < 0) return i18next.t('time.expired');
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return i18next.t('time.countdown', { days, hours, minutes });
}

export function formatRelativeTime(dateString) {
  if (!dateString) return 'N/A';
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return i18next.t('time.justNow');
  if (minutes < 60) return i18next.t('time.minutesAgo', { minutes });
  if (hours < 24) return i18next.t('time.hoursAgo', { hours });
  if (days < 30) return i18next.t('time.daysAgo', { days });
  return formatDate(dateString);
}
