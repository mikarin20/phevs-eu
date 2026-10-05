'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { type Locale } from '@/lib/i18n';

export interface LanguageOption {
  code: Locale;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  currentLocale: Locale;
  basePath?: string;
  languages?: LanguageOption[];
  className?: string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: 'en' as Locale, name: 'EN', flag: 'gb' },
  { code: 'de' as Locale, name: 'DE', flag: 'de' },
  { code: 'fr' as Locale, name: 'FR', flag: 'fr' },
  { code: 'es' as Locale, name: 'ES', flag: 'es' },
  { code: 'tr' as Locale, name: 'TR', flag: 'tr' },
  { code: 'pl' as Locale, name: 'PL', flag: 'pl' },
];

export default function LanguageSelector({
  currentLocale,
  basePath,
  languages = DEFAULT_LANGUAGES,
  className = '',
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getLanguageUrl = (lang: Locale) => {
    const path = basePath || pathname;
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (lang === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    const query = params.toString();
    return query ? `${path}?${query}` : path;
  };

  return (
    <div
      aria-label="Language selection"
      className={`inline-flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-xl p-1 shadow-xs max-w-full overflow-hidden ${className}`}
    >
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        return (
          <Link
            key={lang.code}
            href={getLanguageUrl(lang.code)}
            className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition-all duration-200 text-xs font-bold flex items-center gap-1.5 shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
            }`}
            title={lang.name}
          >
            <span className={`fi fi-${lang.flag} text-sm`}></span>
            <span>{lang.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
