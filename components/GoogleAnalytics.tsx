'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

export default function GoogleAnalytics() {
  useEffect(() => {
    // Check if user has consented to analytics cookies
    const consent = localStorage.getItem('phevs-cookie-consent')
    const preferences = localStorage.getItem('phevs-cookie-preferences')
    
    if (consent && preferences) {
      const prefs = JSON.parse(preferences)
      if (prefs.analytics) {
        // Initialize Google Analytics
        window.gtag = window.gtag || function() {
          (window.gtag.q = window.gtag.q || []).push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', GA_TRACKING_ID, {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    }
  }, [])

  if (!GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}
