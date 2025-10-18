'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface AdSenseProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  adStyle?: React.CSSProperties
  className?: string
  responsive?: boolean
}

export default function AdSense({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' }, 
  className = '',
  responsive = true 
}: AdSenseProps) {
  const [isClient, setIsClient] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if user has consented to marketing cookies
    const consent = localStorage.getItem('phevs-cookie-consent')
    const preferences = localStorage.getItem('phevs-cookie-preferences')
    
    if (consent && preferences) {
      const prefs = JSON.parse(preferences)
      setConsentGiven(prefs.marketing || false)
    }
  }, [])

  useEffect(() => {
    if (isClient && consentGiven && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [isClient, consentGiven])

  if (!isClient || !consentGiven) {
    return (
      <div className={`bg-slate-100 border border-slate-200 rounded-lg p-8 text-center ${className}`}>
        <p className="text-slate-500 text-sm">
          Advertisement - Enable marketing cookies to view
        </p>
      </div>
    )
  }

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle ${className}`}
        style={adStyle}
        data-ad-client="ca-pub-2031503694387888"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </>
  )
}

// Declare adsbygoogle for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[]
  }
}
