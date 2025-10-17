'use client'

import { useState } from 'react'

export default function DemoPage() {
  const [selectedTheme, setSelectedTheme] = useState('deep-slate')

  const themes = {
    // DERİN MAVİ-GRİ TÜREVLERİ
    'deep-slate': {
      name: 'Derin Slate',
      headerBg: 'bg-slate-800',
      headerText: 'text-white',
      accentText: 'text-slate-300',
      primaryBtn: 'bg-slate-700 hover:bg-slate-600',
      secondaryBtn: 'bg-blue-700 hover:bg-blue-600',
      cardBg: 'bg-slate-800',
      cardBorder: 'border-slate-700',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      badgePrimary: 'bg-slate-700 text-slate-200',
      badgeSecondary: 'bg-blue-900 text-blue-200',
      iconColor: 'text-slate-300',
      priceColor: 'text-blue-400',
      inputBg: 'bg-slate-700',
      inputBorder: 'border-slate-600',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-slate-400',
      background: 'bg-slate-900'
    },
    'deep-navy': {
      name: 'Derin Lacivert',
      headerBg: 'bg-slate-900',
      headerText: 'text-white',
      accentText: 'text-slate-200',
      primaryBtn: 'bg-slate-800 hover:bg-slate-700',
      secondaryBtn: 'bg-indigo-800 hover:bg-indigo-700',
      cardBg: 'bg-slate-900',
      cardBorder: 'border-slate-800',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-200',
      badgePrimary: 'bg-slate-800 text-slate-100',
      badgeSecondary: 'bg-indigo-900 text-indigo-200',
      iconColor: 'text-slate-200',
      priceColor: 'text-indigo-400',
      inputBg: 'bg-slate-800',
      inputBorder: 'border-slate-700',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-slate-300',
      background: 'bg-slate-950'
    },
    'deep-charcoal': {
      name: 'Derin Kömür',
      headerBg: 'bg-gray-900',
      headerText: 'text-white',
      accentText: 'text-gray-300',
      primaryBtn: 'bg-gray-800 hover:bg-gray-700',
      secondaryBtn: 'bg-blue-800 hover:bg-blue-700',
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-800',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      badgePrimary: 'bg-gray-800 text-gray-200',
      badgeSecondary: 'bg-blue-900 text-blue-200',
      iconColor: 'text-gray-300',
      priceColor: 'text-blue-400',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-700',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-gray-400',
      background: 'bg-black'
    },
    
    // YUMUŞAK MAVİ-GRİ TÜREVLERİ
    'soft-sky': {
      name: 'Yumuşak Gökyüzü',
      headerBg: 'bg-sky-50',
      headerText: 'text-sky-900',
      accentText: 'text-sky-600',
      primaryBtn: 'bg-sky-600 hover:bg-sky-700',
      secondaryBtn: 'bg-slate-500 hover:bg-slate-600',
      cardBg: 'bg-white',
      cardBorder: 'border-sky-200',
      textPrimary: 'text-sky-900',
      textSecondary: 'text-sky-700',
      badgePrimary: 'bg-sky-100 text-sky-800',
      badgeSecondary: 'bg-slate-100 text-slate-700',
      iconColor: 'text-sky-600',
      priceColor: 'text-sky-600',
      inputBg: 'bg-white',
      inputBorder: 'border-sky-300',
      inputText: 'text-sky-900',
      inputPlaceholder: 'placeholder-sky-600',
      background: 'bg-sky-50'
    },
    'soft-powder': {
      name: 'Yumuşak Toz',
      headerBg: 'bg-blue-50',
      headerText: 'text-blue-900',
      accentText: 'text-blue-600',
      primaryBtn: 'bg-blue-500 hover:bg-blue-600',
      secondaryBtn: 'bg-gray-500 hover:bg-gray-600',
      cardBg: 'bg-white',
      cardBorder: 'border-blue-200',
      textPrimary: 'text-blue-900',
      textSecondary: 'text-blue-700',
      badgePrimary: 'bg-blue-100 text-blue-800',
      badgeSecondary: 'bg-gray-100 text-gray-700',
      iconColor: 'text-blue-600',
      priceColor: 'text-blue-600',
      inputBg: 'bg-white',
      inputBorder: 'border-blue-300',
      inputText: 'text-blue-900',
      inputPlaceholder: 'placeholder-blue-600',
      background: 'bg-blue-50'
    },
    'soft-mist': {
      name: 'Yumuşak Sis',
      headerBg: 'bg-slate-50',
      headerText: 'text-slate-800',
      accentText: 'text-slate-600',
      primaryBtn: 'bg-slate-600 hover:bg-slate-700',
      secondaryBtn: 'bg-blue-500 hover:bg-blue-600',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      textPrimary: 'text-slate-800',
      textSecondary: 'text-slate-600',
      badgePrimary: 'bg-slate-100 text-slate-700',
      badgeSecondary: 'bg-blue-50 text-blue-700',
      iconColor: 'text-slate-600',
      priceColor: 'text-slate-700',
      inputBg: 'bg-white',
      inputBorder: 'border-slate-300',
      inputText: 'text-slate-800',
      inputPlaceholder: 'placeholder-slate-600',
      background: 'bg-slate-50'
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Theme Selector - Elegant */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light mb-6 text-gray-800 tracking-wide">Mavi-Gri Renk Paleti Türevleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Derin Mavi-Gri Türevleri */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Derin Mavi-Gri Türevleri</h3>
              {Object.entries(themes).slice(0, 3).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                    selectedTheme === key
                      ? 'bg-slate-700 text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-102'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
            
            {/* Yumuşak Mavi-Gri Türevleri */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Yumuşak Mavi-Gri Türevleri</h3>
              {Object.entries(themes).slice(3, 6).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                    selectedTheme === key
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md hover:scale-102'
                  }`}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className={`min-h-screen ${currentTheme.background}`}>
        {/* Header - Elegant */}
        <header className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder} shadow-lg sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${currentTheme.iconColor} rounded-lg flex items-center justify-center bg-opacity-20`}>
                    <div className="w-6 h-6 border-2 border-current rounded-sm"></div>
                  </div>
                  <div>
                    <h1 className={`text-2xl font-light ${currentTheme.headerText} tracking-wide`}>PHEVs.eu</h1>
                    <p className={`text-xs ${currentTheme.accentText} font-light tracking-wider uppercase`}>Plug-in Hybrid Comparison</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className={`${currentTheme.primaryBtn} text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                  <div className="w-4 h-4 border border-white rounded-sm"></div>
                  <span>Range Simulator</span>
                </button>
                <button className={`${currentTheme.secondaryBtn} text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                  <div className="w-4 h-4 border border-white rounded-sm"></div>
                  <span>Compare (0/3)</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Bar - Elegant */}
        <div className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder} py-6`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-80">
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                  <input
                    type="text"
                    placeholder="Search by brand or model..."
                    className={`w-full pl-12 pr-6 py-4 border ${currentTheme.inputBorder} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${currentTheme.inputBg} ${currentTheme.inputText} ${currentTheme.inputPlaceholder} text-sm font-light tracking-wide`}
                  />
                </div>
              </div>
              
              <select className={`${currentTheme.inputBg} ${currentTheme.inputText} border ${currentTheme.inputBorder} rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-light tracking-wide`}>
                <option>All Brands</option>
                <option>Audi</option>
                <option>BMW</option>
                <option>Mercedes</option>
              </select>
              
              <select className={`${currentTheme.inputBg} ${currentTheme.inputText} border ${currentTheme.inputBorder} rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-light tracking-wide`}>
                <option>All Segments</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Hatchback</option>
              </select>
            </div>
          </div>
        </div>

        {/* Range Simulator Banner - Elegant */}
        <div className={`${currentTheme.headerBg.includes('slate-8') || currentTheme.headerBg.includes('slate-9') || currentTheme.headerBg.includes('gray-9') ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-blue-50 to-sky-50'} border-b ${currentTheme.cardBorder}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 ${currentTheme.iconColor.includes('slate-3') ? 'bg-slate-700' : currentTheme.iconColor.includes('slate-2') ? 'bg-slate-800' : currentTheme.iconColor.includes('gray-3') ? 'bg-gray-800' : currentTheme.iconColor.includes('sky-6') ? 'bg-sky-100' : currentTheme.iconColor.includes('blue-6') ? 'bg-blue-100' : 'bg-slate-100'} rounded-xl flex items-center justify-center`}>
                  <div className="w-8 h-8 border-2 border-current rounded-lg"></div>
                </div>
                <div>
                  <h3 className={`text-xl font-light ${currentTheme.textPrimary} tracking-wide mb-2`}>Range Simulator</h3>
                  <p className={`text-sm ${currentTheme.textSecondary} font-light tracking-wide`}>Discover your real-world electric range based on temperature and driving conditions</p>
                </div>
              </div>
              <button className={`${currentTheme.primaryBtn} text-white font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                <div className="w-4 h-4 border border-white rounded-sm"></div>
                <span>Try Range Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Elegant */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-light ${currentTheme.textPrimary} tracking-wide`}>87 vehicles found</h2>
          </div>

          {/* Sample Car Cards - Elegant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Car 1 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-slate-400 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-slate-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium ${currentTheme.textPrimary} tracking-wide`}>Audi A3 Sportback TFSI e</h3>
                  <div className={`text-2xl font-light ${currentTheme.priceColor} tracking-wide`}>€45,000</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`${currentTheme.badgePrimary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>2024</span>
                    <span className={`${currentTheme.badgeSecondary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>Compact</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>EV Range:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>78 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Battery:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>13 kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Fuel Consumption:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>1.4 L/100km</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between pt-6 border-t ${currentTheme.cardBorder}`}>
                  <button className={`p-3 ${currentTheme.headerBg.includes('slate-8') || currentTheme.headerBg.includes('slate-9') || currentTheme.headerBg.includes('gray-9') ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-gray-400 rounded-sm hover:border-red-500 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-blue-600 flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Car 2 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-slate-400 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-slate-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium ${currentTheme.textPrimary} tracking-wide`}>BMW X5 xDrive45e</h3>
                  <div className={`text-2xl font-light ${currentTheme.priceColor} tracking-wide`}>€78,000</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`${currentTheme.badgePrimary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>2024</span>
                    <span className={`${currentTheme.badgeSecondary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>SUV</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>EV Range:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>87 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Battery:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>24 kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Fuel Consumption:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>2.1 L/100km</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between pt-6 border-t ${currentTheme.cardBorder}`}>
                  <button className={`p-3 ${currentTheme.headerBg.includes('slate-8') || currentTheme.headerBg.includes('slate-9') || currentTheme.headerBg.includes('gray-9') ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-gray-400 rounded-sm hover:border-red-500 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-blue-600 flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Car 3 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-slate-400 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-slate-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-medium ${currentTheme.textPrimary} tracking-wide`}>Mercedes C-Class C300e</h3>
                  <div className={`text-2xl font-light ${currentTheme.priceColor} tracking-wide`}>€52,000</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`${currentTheme.badgePrimary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>2024</span>
                    <span className={`${currentTheme.badgeSecondary} text-xs font-medium px-3 py-1.5 rounded-full tracking-wide`}>Sedan</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>EV Range:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>105 km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Battery:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>25.4 kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                      <span className={`${currentTheme.textSecondary} font-light tracking-wide`}>Fuel Consumption:</span>
                    </div>
                    <span className={`font-medium ${currentTheme.priceColor} tracking-wide`}>1.1 L/100km</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between pt-6 border-t ${currentTheme.cardBorder}`}>
                  <button className={`p-3 ${currentTheme.headerBg.includes('slate-8') || currentTheme.headerBg.includes('slate-9') || currentTheme.headerBg.includes('gray-9') ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-gray-400 rounded-sm hover:border-red-500 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-blue-600 flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-gray-400 rounded-sm"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}