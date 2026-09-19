export const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '55578fe17dab0a84acf6a3889e002f0c'
export const INDEXNOW_HOST = 'www.phevs.eu'
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`

export interface IndexNowResult {
  success: boolean
  status?: number
  submittedCount: number
  endpoint?: string
  error?: string
}

/**
 * Normalizes a URL to ensure it has the correct protocol, host, and formatting for IndexNow.
 */
export function normalizeIndexNowUrl(pathOrUrl: string): string {
  let url = pathOrUrl.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`
    url = `https://${INDEXNOW_HOST}${cleanPath}`
  }
  // Replace non-www if present to maintain consistency
  url = url.replace('https://phevs.eu', `https://${INDEXNOW_HOST}`)
  return url
}

/**
 * Submits a URL or an array of URLs to the IndexNow protocol (notifying Bing, Yandex, etc. instantly).
 */
export async function submitToIndexNow(urls: string | string[]): Promise<IndexNowResult> {
  try {
    const rawList = Array.isArray(urls) ? urls : [urls]
    const cleanList = Array.from(
      new Set(
        rawList
          .map((u) => normalizeIndexNowUrl(u))
          .filter((u) => u.startsWith(`https://${INDEXNOW_HOST}`))
      )
    )

    if (cleanList.length === 0) {
      return {
        success: false,
        submittedCount: 0,
        error: 'No valid URLs provided for IndexNow submission',
      }
    }

    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: cleanList,
    }

    // Official global IndexNow endpoint (shares automatically with Bing, Yandex, Seznam, Naver)
    const endpoint = 'https://api.indexnow.org/indexnow'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    const status = res.status
    // 200: OK, 202: Accepted (key verification pending)
    const success = status === 200 || status === 202

    if (!success) {
      const responseText = await res.text().catch(() => '')
      console.warn(`[IndexNow] Submission returned status ${status}: ${responseText}`)
      return {
        success: false,
        status,
        submittedCount: cleanList.length,
        endpoint,
        error: `HTTP ${status}: ${responseText || 'Submission rejected'}`,
      }
    }

    console.log(`[IndexNow] Successfully submitted ${cleanList.length} URL(s) to ${endpoint} (Status: ${status})`)
    return {
      success: true,
      status,
      submittedCount: cleanList.length,
      endpoint,
    }
  } catch (err: any) {
    console.error('[IndexNow] Submission error:', err)
    return {
      success: false,
      submittedCount: 0,
      error: err?.message || 'Network error during IndexNow ping',
    }
  }
}
