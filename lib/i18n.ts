import en from './locales/en.json'
import tr from './locales/tr.json'
import de from './locales/de.json'
import pl from './locales/pl.json'

export const locales = {
  en,
  tr,
  de,
  pl
} as const

export type Locale = keyof typeof locales

export function getTranslations(locale: Locale = 'en') {
  return locales[locale]
}

export function getFaqTranslations(locale: Locale = 'en') {
  return getTranslations(locale).faq
}
