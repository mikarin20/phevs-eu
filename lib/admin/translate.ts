export type SupportedLocale = 'tr' | 'en' | 'de' | 'pl'

interface TranslatableBlogFields {
  title: string
  excerpt: string
  content: string
  metaTitle?: string
  metaDescription?: string
}

const localeCodes: Record<SupportedLocale, string> = {
  tr: 'TR',
  en: 'EN',
  de: 'DE',
  pl: 'PL',
}

export async function translateBlogFields(
  fields: TranslatableBlogFields,
  sourceLocale: SupportedLocale,
  targetLocale: SupportedLocale
): Promise<TranslatableBlogFields> {
  if (sourceLocale === targetLocale) return fields

  const apiKey = process.env.DEEPL_API_KEY
  const apiUrl = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate'
  if (!apiKey) throw new Error('DEEPL_API_KEY is not configured')

  const values = [
    fields.title,
    fields.excerpt,
    fields.content,
    fields.metaTitle || '',
    fields.metaDescription || '',
  ]
  const params = new URLSearchParams()
  values.forEach((value) => params.append('text', value))
  params.set('source_lang', localeCodes[sourceLocale])
  params.set('target_lang', localeCodes[targetLocale])
  params.set('preserve_formatting', '1')

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`DeepL translation failed (${response.status}): ${detail}`)
  }

  const result = await response.json() as { translations: Array<{ text: string }> }
  if (result.translations.length !== values.length) {
    throw new Error('DeepL returned an incomplete translation response')
  }

  return {
    title: result.translations[0].text,
    excerpt: result.translations[1].text,
    content: result.translations[2].text,
    metaTitle: result.translations[3].text || undefined,
    metaDescription: result.translations[4].text || undefined,
  }
}

export async function buildLocalizedBlogFields(
  fields: TranslatableBlogFields,
  sourceLocale: SupportedLocale,
  autoTranslate: boolean,
  existing: Record<string, any> = {}
) {
  const locales: SupportedLocale[] = ['tr', 'en', 'de', 'pl']
  const translated = new Map<SupportedLocale, TranslatableBlogFields>()
  translated.set(sourceLocale, fields)

  if (autoTranslate) {
    await Promise.all(
      locales
        .filter((locale) => locale !== sourceLocale)
        .map(async (locale) => translated.set(locale, await translateBlogFields(fields, sourceLocale, locale)))
    )
  }

  const resolve = (locale: SupportedLocale, field: keyof TranslatableBlogFields) => {
    const suffix = locale === 'tr' ? '' : `_${locale}`
    const existingKey = `${field === 'metaTitle' ? 'meta_title' : field === 'metaDescription' ? 'meta_description' : field}${suffix}`
    return translated.get(locale)?.[field] || existing[existingKey] || fields[field] || ''
  }

  return {
    title: resolve('tr', 'title'),
    title_en: resolve('en', 'title'),
    title_de: resolve('de', 'title'),
    title_pl: resolve('pl', 'title'),
    excerpt: resolve('tr', 'excerpt'),
    excerpt_en: resolve('en', 'excerpt'),
    excerpt_de: resolve('de', 'excerpt'),
    excerpt_pl: resolve('pl', 'excerpt'),
    content: resolve('tr', 'content'),
    content_en: resolve('en', 'content'),
    content_de: resolve('de', 'content'),
    content_pl: resolve('pl', 'content'),
    meta_title: resolve('tr', 'metaTitle'),
    meta_title_en: resolve('en', 'metaTitle'),
    meta_title_de: resolve('de', 'metaTitle'),
    meta_title_pl: resolve('pl', 'metaTitle'),
    meta_description: resolve('tr', 'metaDescription'),
    meta_description_en: resolve('en', 'metaDescription'),
    meta_description_de: resolve('de', 'metaDescription'),
    meta_description_pl: resolve('pl', 'metaDescription'),
    source_locale: sourceLocale,
  }
}
