'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

interface LanguageSelectorProps {
  currentLocale: Locale
  basePath?: string
}

export default function LanguageSelector({ currentLocale, basePath }: LanguageSelectorProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const languages = [
    { code: 'en' as Locale, name: 'EN', flag: 'gb' },
    { code: 'de' as Locale, name: 'DE', flag: 'de' },
    { code: 'tr' as Locale, name: 'TR', flag: 'tr' },
    { code: 'pl' as Locale, name: 'PL', flag: 'pl' }
  ]

  const getLanguageUrl = (lang: Locale) => {
    const path = basePath || pathname
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', lang)
    return `${path}?${params.toString()}`
  }

  return (
    <div className="flex items-center space-x-1 bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code
        return (
          <Link
            key={lang.code}
            href={getLanguageUrl(lang.code)}
            className={`p-2 rounded-md transition-all duration-200 ${
              isActive
                ? 'bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white'
                : 'hover:bg-white/20 dark:hover:bg-slate-700/50 text-white'
            }`}
            title={lang.name}
          >
            <span className={`fi fi-${lang.flag} text-sm`}></span>
          </Link>
        )
      })}
    </div>
  )
}

