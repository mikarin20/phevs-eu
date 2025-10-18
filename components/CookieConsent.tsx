'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('phevs-cookie-consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const acceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    localStorage.setItem('phevs-cookie-consent', JSON.stringify(allPreferences))
    localStorage.setItem('phevs-cookie-preferences', JSON.stringify(allPreferences))
    setIsVisible(false)
    // Initialize analytics and other services here
    initializeServices(allPreferences)
  }

  const acceptSelected = () => {
    localStorage.setItem('phevs-cookie-consent', 'true')
    localStorage.setItem('phevs-cookie-preferences', JSON.stringify(preferences))
    setIsVisible(false)
    setShowSettings(false)
    // Initialize services based on preferences
    initializeServices(preferences)
  }

  const rejectAll = () => {
    localStorage.setItem('phevs-cookie-consent', 'true')
    localStorage.setItem('phevs-cookie-preferences', JSON.stringify(preferences))
    setIsVisible(false)
    setShowSettings(false)
    // Only initialize essential services
    initializeServices(preferences)
  }

  const initializeServices = (prefs: typeof preferences) => {
    // Initialize Google Analytics if analytics is enabled
    if (prefs.analytics) {
      // Google Analytics initialization code will go here
      console.log('Analytics enabled')
    }
    
    // Initialize marketing cookies if enabled
    if (prefs.marketing) {
      // AdSense and other marketing services will go here
      console.log('Marketing cookies enabled')
    }
    
    // Initialize functional cookies if enabled
    if (prefs.functional) {
      // Additional functional services
      console.log('Functional cookies enabled')
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200">
            {!showSettings ? (
              // Main banner
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      🍪 We use cookies
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="ml-4 text-slate-400 hover:text-slate-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    Customize
                  </button>
                  <button
                    onClick={rejectAll}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    Reject All
                  </button>
                </div>
              </div>
            ) : (
              // Settings panel
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800">Essential Cookies</h4>
                      <p className="text-sm text-slate-600">Required for basic website functionality</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-slate-500 mr-2">Always Active</span>
                      <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800">Analytics Cookies</h4>
                      <p className="text-sm text-slate-600">Help us understand how visitors interact with our website</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800">Marketing Cookies</h4>
                      <p className="text-sm text-slate-600">Used to deliver relevant advertisements and measure ad performance</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-800">Functional Cookies</h4>
                      <p className="text-sm text-slate-600">Enable enhanced functionality and personalization</p>
                    </div>
                    <button
                      onClick={() => setPreferences(prev => ({ ...prev, functional: !prev.functional }))}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.functional ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptSelected}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
