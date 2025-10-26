export const faqData = {
  'phev-nedir-nasil-calisir': {
    tr: {
      title: 'PHEV nedir ve nasıl çalışır?',
      category: 'Genel Sorular',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV), hem elektrik motoru hem de benzin motoru bulunan hibrit araçlardır. Bu araçlar, elektrikli sürüşün avantajlarını geleneksel yakıt esnekliği ile birleştirir.',
        sections: [
          {
            title: 'PHEV Nasıl Çalışır?',
            content: `
              <p>PHEV'ler üç farklı sürüş modu sunar:</p>
              <ul>
                <li><strong>Elektrik Modu:</strong> Sadece elektrik motoru kullanılır, sıfır emisyon</li>
                <li><strong>Hibrit Modu:</strong> Hem elektrik hem benzin motoru birlikte çalışır</li>
                <li><strong>Benzin Modu:</strong> Batarya bittiğinde sadece benzin motoru çalışır</li>
              </ul>
              <p>Akıllı kontrol sistemi, sürüş koşullarına göre en verimli modu otomatik olarak seçer.</p>
            `
          },
          {
            title: 'PHEV Bileşenleri',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>Elektrik Sistemi</h4>
                  <ul>
                    <li>Yüksek voltajlı lityum-iyon batarya</li>
                    <li>Elektrik motoru (genellikle 80-150 kW)</li>
                    <li>Şarj portu (Type 2 AC, CCS DC)</li>
                    <li>Batarya yönetim sistemi</li>
                  </ul>
                </div>
                <div>
                  <h4>Geleneksel Sistem</h4>
                  <ul>
                    <li>Benzin motoru (1.0-2.0L turbo)</li>
                    <li>Otomatik şanzıman</li>
                    <li>Yakıt deposu (30-60L)</li>
                    <li>Egzoz sistemi</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            title: 'PHEV Avantajları',
            content: `
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Çevre Dostu</h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Günlük kullanımda sıfır emisyon, düşük CO2 salınımı</p>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Yakıt Tasarrufu</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">%40-60 daha az yakıt tüketimi</p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">Menzil Esnekliği</h4>
                  <p class="text-sm text-purple-700 dark:text-purple-300">Elektrik + benzin ile 600+ km menzil</p>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-bev-farki-nedir',
        'phev-avantajlari-nelerdir',
        'phev-menzil-hesaplama-nasil'
      ]
    },
    en: {
      title: 'What is PHEV and how does it work?',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) is a hybrid vehicle that combines both electric motor and gasoline engine. These vehicles combine the advantages of electric driving with traditional fuel flexibility.',
        sections: [
          {
            title: 'How Does PHEV Work?',
            content: `
              <p>PHEVs offer three different driving modes:</p>
              <ul>
                <li><strong>Electric Mode:</strong> Only electric motor is used, zero emissions</li>
                <li><strong>Hybrid Mode:</strong> Both electric and gasoline engines work together</li>
                <li><strong>Gasoline Mode:</strong> Only gasoline engine works when battery is depleted</li>
              </ul>
              <p>Smart control system automatically selects the most efficient mode according to driving conditions.</p>
            `
          },
          {
            title: 'PHEV Components',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>Electric System</h4>
                  <ul>
                    <li>High voltage lithium-ion battery</li>
                    <li>Electric motor (usually 80-150 kW)</li>
                    <li>Charging port (Type 2 AC, CCS DC)</li>
                    <li>Battery management system</li>
                  </ul>
                </div>
                <div>
                  <h4>Traditional System</h4>
                  <ul>
                    <li>Gasoline engine (1.0-2.0L turbo)</li>
                    <li>Automatic transmission</li>
                    <li>Fuel tank (30-60L)</li>
                    <li>Exhaust system</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            title: 'PHEV Advantages',
            content: `
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Eco-Friendly</h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Zero emissions in daily use, low CO2 emissions</p>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Fuel Savings</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">40-60% less fuel consumption</p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">Range Flexibility</h4>
                  <p class="text-sm text-purple-700 dark:text-purple-300">600+ km range with electricity + gasoline</p>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-bev-farki-nedir',
        'phev-avantajlari-nelerdir',
        'phev-menzil-hesaplama-nasil'
      ]
    },
    de: {
      title: 'Was ist PHEV und wie funktioniert es?',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) ist ein Hybridfahrzeug, das sowohl Elektromotor als auch Benzinmotor kombiniert. Diese Fahrzeuge verbinden die Vorteile des elektrischen Fahrens mit der traditionellen Kraftstoffflexibilität.',
        sections: [
          {
            title: 'Wie funktioniert PHEV?',
            content: `
              <p>PHEVs bieten drei verschiedene Fahr Modi:</p>
              <ul>
                <li><strong>Elektro-Modus:</strong> Nur Elektromotor wird verwendet, null Emissionen</li>
                <li><strong>Hybrid-Modus:</strong> Elektro- und Benzinmotor arbeiten zusammen</li>
                <li><strong>Benzin-Modus:</strong> Nur Benzinmotor arbeitet, wenn Batterie leer ist</li>
              </ul>
              <p>Intelligentes Kontrollsystem wählt automatisch den effizientesten Modus je nach Fahrbedingungen.</p>
            `
          },
          {
            title: 'PHEV Komponenten',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>Elektrisches System</h4>
                  <ul>
                    <li>Hochspannungs-Lithium-Ionen-Batterie</li>
                    <li>Elektromotor (meist 80-150 kW)</li>
                    <li>Ladeanschluss (Type 2 AC, CCS DC)</li>
                    <li>Batteriemanagementsystem</li>
                  </ul>
                </div>
                <div>
                  <h4>Traditionelles System</h4>
                  <ul>
                    <li>Benzinmotor (1.0-2.0L Turbo)</li>
                    <li>Automatikgetriebe</li>
                    <li>Kraftstofftank (30-60L)</li>
                    <li>Abgasanlage</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            title: 'PHEV Vorteile',
            content: `
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Umweltfreundlich</h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Null Emissionen im täglichen Gebrauch, niedrige CO2-Emissionen</p>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Kraftstoffeinsparung</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">40-60% weniger Kraftstoffverbrauch</p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">Reichweiten-Flexibilität</h4>
                  <p class="text-sm text-purple-700 dark:text-purple-300">600+ km Reichweite mit Strom + Benzin</p>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-bev-farki-nedir',
        'phev-avantajlari-nelerdir',
        'phev-menzil-hesaplama-nasil'
      ]
    },
    pl: {
      title: 'Czym jest PHEV i jak działa?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) to pojazd hybrydowy łączący silnik elektryczny i silnik benzynowy. Te pojazdy łączą zalety jazdy elektrycznej z tradycyjną elastycznością paliwową.',
        sections: [
          {
            title: 'Jak działa PHEV?',
            content: `
              <p>PHEV oferuje trzy różne tryby jazdy:</p>
              <ul>
                <li><strong>Tryb elektryczny:</strong> Używany tylko silnik elektryczny, zero emisji</li>
                <li><strong>Tryb hybrydowy:</strong> Silnik elektryczny i benzynowy pracują razem</li>
                <li><strong>Tryb benzynowy:</strong> Tylko silnik benzynowy pracuje gdy bateria jest rozładowana</li>
              </ul>
              <p>Inteligentny system kontroli automatycznie wybiera najbardziej efektywny tryb w zależności od warunków jazdy.</p>
            `
          },
          {
            title: 'Komponenty PHEV',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>System elektryczny</h4>
                  <ul>
                    <li>Bateria litowo-jonowa wysokiego napięcia</li>
                    <li>Silnik elektryczny (zwykle 80-150 kW)</li>
                    <li>Port ładowania (Type 2 AC, CCS DC)</li>
                    <li>System zarządzania baterią</li>
                  </ul>
                </div>
                <div>
                  <h4>System tradycyjny</h4>
                  <ul>
                    <li>Silnik benzynowy (1.0-2.0L turbo)</li>
                    <li>Skrzynia automatyczna</li>
                    <li>Zbiornik paliwa (30-60L)</li>
                    <li>System wydechowy</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            title: 'Zalety PHEV',
            content: `
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Przyjazny środowisku</h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Zero emisji w codziennym użytkowaniu, niska emisja CO2</p>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Oszczędność paliwa</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">40-60% mniejsze zużycie paliwa</p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">Elastyczność zasięgu</h4>
                  <p class="text-sm text-purple-700 dark:text-purple-300">600+ km zasięgu z elektrycznością + benzyną</p>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-bev-farki-nedir',
        'phev-avantajlari-nelerdir',
        'phev-menzil-hesaplama-nasil'
      ]
    }
  },
  'phev-bev-farki-nedir': {
    tr: {
      title: 'PHEV ile BEV arasındaki fark nedir?',
      category: 'Genel Sorular',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV (Plug-in Hybrid) ve BEV (Battery Electric Vehicle) arasında temel fark, enerji kaynakları ve menzil esnekliğidir.',
        sections: [
          {
            title: 'Temel Farklar',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Özellik</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">BEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Motor</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Elektrik + Benzin</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Sadece Elektrik</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Menzil</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50-80 km (elektrik) + 500+ km (hibrit)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300-600 km (sadece elektrik)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Şarj Süresi</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2-8 saat (AC)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4-12 saat (AC), 30-60 dk (DC)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Fiyat</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">25.000-80.000€</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">30.000-150.000€</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-nedir-nasil-calisir',
        'phev-avantajlari-nelerdir',
        'phev-satin-alma-rehberi'
      ]
    },
    en: {
      title: 'What is the difference between PHEV and BEV?',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'The main difference between PHEV (Plug-in Hybrid) and BEV (Battery Electric Vehicle) is energy sources and range flexibility.',
        sections: [
          {
            title: 'Key Differences',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Feature</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">BEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Engine</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Electric + Gasoline</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Electric Only</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Range</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50-80 km (electric) + 500+ km (hybrid)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300-600 km (electric only)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Charging Time</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2-8 hours (AC)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4-12 hours (AC), 30-60 min (DC)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Price</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€25,000-80,000</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€30,000-150,000</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-nedir-nasil-calisir',
        'phev-avantajlari-nelerdir',
        'phev-satin-alma-rehberi'
      ]
    },
    de: {
      title: 'Was ist der Unterschied zwischen PHEV und BEV?',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Der Hauptunterschied zwischen PHEV (Plug-in Hybrid) und BEV (Battery Electric Vehicle) liegt in den Energiequellen und der Reichweiten-Flexibilität.',
        sections: [
          {
            title: 'Hauptunterschiede',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Eigenschaft</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">BEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Motor</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Elektro + Benzin</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Nur Elektro</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Reichweite</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50-80 km (elektrisch) + 500+ km (hybrid)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300-600 km (nur elektrisch)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Ladezeit</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2-8 Stunden (AC)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4-12 Stunden (AC), 30-60 Min (DC)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Preis</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€25.000-80.000</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€30.000-150.000</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-nedir-nasil-calisir',
        'phev-avantajlari-nelerdir',
        'phev-satin-alma-rehberi'
      ]
    },
    pl: {
      title: 'Jaka jest różnica między PHEV a BEV?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Główna różnica między PHEV (Plug-in Hybrid) a BEV (Battery Electric Vehicle) to źródła energii i elastyczność zasięgu.',
        sections: [
          {
            title: 'Kluczowe różnice',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Cecha</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">BEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Silnik</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Elektryczny + Benzyna</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Tylko elektryczny</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Zasięg</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50-80 km (elektryczny) + 500+ km (hybrydowy)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300-600 km (tylko elektryczny)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Czas ładowania</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2-8 godzin (AC)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4-12 godzin (AC), 30-60 min (DC)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Cena</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€25.000-80.000</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">€30.000-150.000</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-nedir-nasil-calisir',
        'phev-avantajlari-nelerdir',
        'phev-satin-alma-rehberi'
      ]
    }
  }
}

export function getFaqData(slug: string, locale: 'tr' | 'en' | 'de' | 'pl' = 'tr') {
  const faq = faqData[slug as keyof typeof faqData]
  if (!faq) return null
  
  return faq[locale] || faq.tr
}
