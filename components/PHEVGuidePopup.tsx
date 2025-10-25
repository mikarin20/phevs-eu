'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, BookOpenIcon, CheckIcon, LightBulbIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline'

interface PHEVGuidePopupProps {
  isOpen: boolean
  onClose: () => void
  theme: string
}

export default function PHEVGuidePopup({ isOpen, onClose, theme }: PHEVGuidePopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Popup'ı yumuşak bir şekilde göster
      setTimeout(() => setIsVisible(true), 100)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const features = [
    {
      icon: LightBulbIcon,
      title: "PHEV Nedir?",
      description: "Plug-in Hybrid Electric Vehicle'ların nasıl çalıştığını öğrenin"
    },
    {
      icon: ChartBarIcon,
      title: "Menzil Simülatörü",
      description: "Gerçek dünya koşullarında menzil hesaplayın"
    },
    {
      icon: CogIcon,
      title: "Teknik Özellikler",
      description: "Batarya, motor ve şarj süreleri hakkında detaylı bilgi"
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
      <div className={`relative w-full max-w-2xl mx-auto transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className={`rounded-2xl shadow-2xl ${
          theme === 'dark' 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white border border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-6 border-b ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpenIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    PHEV Rehberi
                  </h2>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Plug-in Hybrid araçlar hakkında her şey
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
          <div className="p-6">
            <div className="mb-6">
              <h3 className={`text-lg font-semibold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Neler Öğreneceksiniz?
              </h3>
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <feature.icon className={`h-4 w-4 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
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
            <div className={`p-4 rounded-xl mb-6 ${
              theme === 'dark' ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <CheckIcon className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-800'
                }`}>
                  Avantajlar
                </span>
              </div>
              <ul className={`text-sm space-y-1 ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>
                <li>• Düşük yakıt tüketimi ve emisyon</li>
                <li>• Şehir içi elektrikli sürüş</li>
                <li>• Uzun mesafe için hibrit güç</li>
                <li>• Devlet teşvikleri ve vergi avantajları</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/faq"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-center hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                PHEV Rehberini İncele
              </a>
              <button
                onClick={onClose}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Daha Sonra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
