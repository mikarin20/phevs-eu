'use client'

import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { COMMON_TRANSLATIONS, type CategoryLang } from '@/lib/category-translations'

interface CategoryHeaderProps {
  currentLang: CategoryLang
  basePath: string
  badgeText?: string
}

const SUPPORTED_LANGS: { code: CategoryLang; flag: string; name: string }[] = [
  { code: 'en', flag: 'gb', name: 'EN' },
  { code: 'de', flag: 'de', name: 'DE' },
  { code: 'fr', flag: 'fr', name: 'FR' },
  { code: 'es', flag: 'es', name: 'ES' },
  { code: 'tr', flag: 'tr', name: 'TR' },
  { code: 'pl', flag: 'pl', name: 'PL' }
]

export default function CategoryHeader({ currentLang, basePath, badgeText }: CategoryHeaderProps) {
  const common = COMMON_TRANSLATIONS[currentLang] || COMMON_TRANSLATIONS.en
  const backHref = currentLang !== 'en' ? `/?lang=${currentLang}` : '/'

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center space-x-1.5 sm:space-x-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-xs sm:text-sm transition-colors shrink-0"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>{common.allPHEVs}</span>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {badgeText || common.curatedCategory}
          </span>

          {/* Compact Flag Selector */}
          <div className="flex items-center space-x-0.5 bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 rounded-full p-1 shadow-2xs">
            {SUPPORTED_LANGS.map((lang) => {
              const isSelected = currentLang === lang.code
              const langHref = lang.code === 'en' ? basePath : `${basePath}?lang=${lang.code}`

              return (
                <Link
                  key={lang.code}
                  href={langHref}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('phevs-language', lang.code)
                      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang.code } }))
                    }
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-150 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs ring-1 ring-slate-900/5 dark:ring-white/10 scale-105'
                      : 'opacity-65 hover:opacity-100 hover:bg-white/60 dark:hover:bg-slate-700/50'
                  }`}
                  title={lang.name}
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span className={`fi fi-${lang.flag} text-xs`}></span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
