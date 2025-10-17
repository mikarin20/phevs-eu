'use client'

import { useState } from 'react'

export default function DemoPage() {
  const [selectedTheme, setSelectedTheme] = useState('navy-beige-dark')

  const themes = {
    'navy-beige-dark': {
      name: 'Navy Beige Dark',
      headerBg: 'bg-[#1B3C53]',
      headerText: 'text-white',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#234C6A] hover:bg-[#1B3C53]',
      secondaryBtn: 'bg-[#456882] hover:bg-[#234C6A]',
      cardBg: 'bg-[#1B3C53]',
      cardBorder: 'border-[#234C6A]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#234C6A] text-[#D2C1B6]',
      badgeSecondary: 'bg-[#456882] text-white',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#234C6A]',
      inputBorder: 'border-[#456882]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#1B3C53]'
    },
    'navy-beige-light': {
      name: 'Navy Beige Light',
      headerBg: 'bg-[#234C6A]',
      headerText: 'text-white',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#456882] hover:bg-[#234C6A]',
      secondaryBtn: 'bg-[#1B3C53] hover:bg-[#234C6A]',
      cardBg: 'bg-[#234C6A]',
      cardBorder: 'border-[#456882]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#456882] text-white',
      badgeSecondary: 'bg-[#1B3C53] text-[#D2C1B6]',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#456882]',
      inputBorder: 'border-[#234C6A]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#234C6A]'
    },
    'navy-beige-soft': {
      name: 'Navy Beige Soft',
      headerBg: 'bg-[#456882]',
      headerText: 'text-white',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#1B3C53] hover:bg-[#234C6A]',
      secondaryBtn: 'bg-[#234C6A] hover:bg-[#1B3C53]',
      cardBg: 'bg-[#456882]',
      cardBorder: 'border-[#234C6A]',
      textPrimary: 'text-white',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#1B3C53] text-[#D2C1B6]',
      badgeSecondary: 'bg-[#234C6A] text-white',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#1B3C53]',
      inputBorder: 'border-[#456882]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#456882]'
    },
    'navy-beige-elegant': {
      name: 'Navy Beige Elegant',
      headerBg: 'bg-[#1B3C53]',
      headerText: 'text-[#D2C1B6]',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#D2C1B6] hover:bg-[#C4B5A8] text-[#1B3C53]',
      secondaryBtn: 'bg-[#456882] hover:bg-[#234C6A] text-white',
      cardBg: 'bg-[#1B3C53]',
      cardBorder: 'border-[#D2C1B6]',
      textPrimary: 'text-[#D2C1B6]',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#D2C1B6] text-[#1B3C53]',
      badgeSecondary: 'bg-[#456882] text-white',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#234C6A]',
      inputBorder: 'border-[#D2C1B6]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#1B3C53]'
    },
    'navy-beige-luxury': {
      name: 'Navy Beige Luxury',
      headerBg: 'bg-[#234C6A]',
      headerText: 'text-[#D2C1B6]',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#D2C1B6] hover:bg-[#C4B5A8] text-[#1B3C53]',
      secondaryBtn: 'bg-[#1B3C53] hover:bg-[#234C6A] text-[#D2C1B6]',
      cardBg: 'bg-[#234C6A]',
      cardBorder: 'border-[#D2C1B6]',
      textPrimary: 'text-[#D2C1B6]',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#D2C1B6] text-[#1B3C53]',
      badgeSecondary: 'bg-[#1B3C53] text-[#D2C1B6]',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#456882]',
      inputBorder: 'border-[#D2C1B6]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#234C6A]'
    },
    'navy-beige-premium': {
      name: 'Navy Beige Premium',
      headerBg: 'bg-[#456882]',
      headerText: 'text-[#D2C1B6]',
      accentText: 'text-[#D2C1B6]',
      primaryBtn: 'bg-[#D2C1B6] hover:bg-[#C4B5A8] text-[#1B3C53]',
      secondaryBtn: 'bg-[#234C6A] hover:bg-[#1B3C53] text-[#D2C1B6]',
      cardBg: 'bg-[#456882]',
      cardBorder: 'border-[#D2C1B6]',
      textPrimary: 'text-[#D2C1B6]',
      textSecondary: 'text-[#D2C1B6]',
      badgePrimary: 'bg-[#D2C1B6] text-[#1B3C53]',
      badgeSecondary: 'bg-[#234C6A] text-[#D2C1B6]',
      iconColor: 'text-[#D2C1B6]',
      priceColor: 'text-[#D2C1B6]',
      inputBg: 'bg-[#1B3C53]',
      inputBorder: 'border-[#D2C1B6]',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-[#D2C1B6]',
      background: 'bg-[#456882]'
    }
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes]

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Theme Selector - Navy Beige */}
      <div className="bg-[#1B3C53] border-b border-[#234C6A] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light mb-6 text-[#D2C1B6] tracking-wide">Navy Beige Renk Paleti Türevleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key)}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                  selectedTheme === key
                    ? 'bg-[#D2C1B6] text-[#1B3C53] shadow-lg transform scale-105'
                    : 'bg-[#234C6A] text-[#D2C1B6] hover:bg-[#456882] hover:shadow-md hover:scale-102'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className={`min-h-screen ${currentTheme.background}`}>
        {/* Header - Navy Beige */}
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
                <button className={`${currentTheme.primaryBtn} font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                  <div className="w-4 h-4 border border-current rounded-sm"></div>
                  <span>Range Simulator</span>
                </button>
                <button className={`${currentTheme.secondaryBtn} font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                  <div className="w-4 h-4 border border-current rounded-sm"></div>
                  <span>Compare (0/3)</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Bar - Navy Beige */}
        <div className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder} py-6`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-80">
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 border border-current ${currentTheme.iconColor} rounded-sm`}></div>
                  <input
                    type="text"
                    placeholder="Search by brand or model..."
                    className={`w-full pl-12 pr-6 py-4 border ${currentTheme.inputBorder} rounded-lg focus:ring-2 focus:ring-[#D2C1B6] focus:border-[#D2C1B6] outline-none ${currentTheme.inputBg} ${currentTheme.inputText} ${currentTheme.inputPlaceholder} text-sm font-light tracking-wide`}
                  />
                </div>
              </div>
              
              <select className={`${currentTheme.inputBg} ${currentTheme.inputText} border ${currentTheme.inputBorder} rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-[#D2C1B6] focus:border-[#D2C1B6] outline-none font-light tracking-wide`}>
                <option>All Brands</option>
                <option>Audi</option>
                <option>BMW</option>
                <option>Mercedes</option>
              </select>
              
              <select className={`${currentTheme.inputBg} ${currentTheme.inputText} border ${currentTheme.inputBorder} rounded-lg px-4 py-4 text-sm focus:ring-2 focus:ring-[#D2C1B6] focus:border-[#D2C1B6] outline-none font-light tracking-wide`}>
                <option>All Segments</option>
                <option>SUV</option>
                <option>Sedan</option>
                <option>Hatchback</option>
              </select>
            </div>
          </div>
        </div>

        {/* Range Simulator Banner - Navy Beige */}
        <div className={`${currentTheme.headerBg} border-b ${currentTheme.cardBorder}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className={`w-16 h-16 ${currentTheme.iconColor} rounded-xl flex items-center justify-center bg-opacity-20`}>
                  <div className="w-8 h-8 border-2 border-current rounded-lg"></div>
                </div>
                <div>
                  <h3 className={`text-xl font-light ${currentTheme.textPrimary} tracking-wide mb-2`}>Range Simulator</h3>
                  <p className={`text-sm ${currentTheme.textSecondary} font-light tracking-wide`}>Discover your real-world electric range based on temperature and driving conditions</p>
                </div>
              </div>
              <button className={`${currentTheme.primaryBtn} font-medium py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center space-x-3 text-sm tracking-wide`}>
                <div className="w-4 h-4 border border-current rounded-sm"></div>
                <span>Try Range Simulator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Navy Beige */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-light ${currentTheme.textPrimary} tracking-wide`}>87 vehicles found</h2>
          </div>

          {/* Sample Car Cards - Navy Beige */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Car 1 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-[#D2C1B6] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-[#D2C1B6] rounded-sm"></div>
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
                      <div key={i} className="w-3 h-3 bg-[#D2C1B6] rounded-full"></div>
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
                  <button className={`p-3 hover:bg-[#234C6A] rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-[#D2C1B6] rounded-sm hover:border-red-400 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-[#D2C1B6] flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-[#D2C1B6] rounded-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Car 2 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-[#D2C1B6] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-[#D2C1B6] rounded-sm"></div>
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
                      <div key={i} className="w-3 h-3 bg-[#D2C1B6] rounded-full"></div>
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
                  <button className={`p-3 hover:bg-[#234C6A] rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-[#D2C1B6] rounded-sm hover:border-red-400 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-[#D2C1B6] flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-[#D2C1B6] rounded-sm"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sample Car 3 */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 p-8 group`}>
              <div className="aspect-w-16 aspect-h-9 mb-6">
                <div className="w-full h-64 bg-gradient-to-br from-[#234C6A] to-[#456882] rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-[#D2C1B6] rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 border border-[#D2C1B6] rounded-sm"></div>
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
                      <div key={i} className="w-3 h-3 bg-[#D2C1B6] rounded-full"></div>
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
                  <button className={`p-3 hover:bg-[#234C6A] rounded-lg transition-all duration-300`}>
                    <div className="w-5 h-5 border border-[#D2C1B6] rounded-sm hover:border-red-400 transition-colors"></div>
                  </button>
                  <button className={`w-10 h-10 rounded-lg border-2 ${currentTheme.cardBorder} hover:border-[#D2C1B6] flex items-center justify-center transition-all duration-300`}>
                    <div className="w-4 h-4 border border-[#D2C1B6] rounded-sm"></div>
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