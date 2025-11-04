'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, BookOpenIcon, CheckIcon, LightBulbIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'
import { getTranslations, type Locale } from '@/lib/i18n'

interface PHEVGuidePopupProps {
  isOpen: boolean
  onClose: () => void
  theme: string
  language: string
}

export default function PHEVGuidePopup({ isOpen, onClose, theme, language }: PHEVGuidePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [translations, setTranslations] = useState<any>(null)

  useEffect(() => {
    const loadTranslations = async () => {
      const t = await getTranslations(language as Locale)
      setTranslations(t)
    }
    loadTranslations()
  }, [language])

  useEffect(() => {
    if (isOpen) {
      // Popup'ı yumuşak bir şekilde göster
      setTimeout(() => setIsVisible(true), 100)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen || !translations) return null

  const features = [
    {
      icon: LightBulbIcon,
      title: translations.phevGuidePopup.features.phevBasics.title,
      description: translations.phevGuidePopup.features.phevBasics.description
    },
    {
      icon: ChartBarIcon,
      title: translations.phevGuidePopup.features.rangeSimulator.title,
      description: translations.phevGuidePopup.features.rangeSimulator.description
    },
    {
      icon: CogIcon,
      title: translations.phevGuidePopup.features.technicalSpecs.title,
      description: translations.phevGuidePopup.features.technicalSpecs.description
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          isVisible ? 'bg-black/50' : 'bg-black/0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className={`relative w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className={`rounded-2xl shadow-2xl ${
          theme === 'dark' 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 sm:p-6 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpenIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className={`text-lg sm:text-2xl font-bold truncate ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {translations.phevGuidePopup.title}
                  </h2>
                  <p className={`text-xs sm:text-sm break-words ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {translations.phevGuidePopup.subtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'hover:bg-slate-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h3 className={`text-base sm:text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {translations.phevGuidePopup.whatWillYouLearn}
              </h3>
              <div className="grid gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <feature.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm sm:text-base mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-xs sm:text-sm leading-relaxed break-words ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className={`p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 ${
              theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <CheckIcon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`font-semibold text-sm sm:text-base ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-800'
                }`}>
                  {translations.phevGuidePopup.benefits.title}
                </span>
              </div>
              <ul className={`text-xs sm:text-sm space-y-1 break-words ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>
                {translations.phevGuidePopup.benefits.items.map((item: string, index: number) => (
                  <li key={index} className="break-words">• {item}</li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <a
                href="/faq"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {translations.phevGuidePopup.buttons.exploreGuide}
              </a>
              <button
                onClick={onClose}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {translations.phevGuidePopup.buttons.later}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
