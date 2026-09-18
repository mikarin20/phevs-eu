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
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) ist ein Hybridfahrzeug, das sowohl Elektromotor als auch Benzinmotor kombiniert.',
        sections: [
          {
            title: 'Wie funktioniert PHEV?',
            content: `
              <p>PHEVs bieten drei verschiedene Fahrmodi:</p>
              <ul>
                <li><strong>Elektro-Modus:</strong> Nur Elektromotor wird verwendet</li>
                <li><strong>Hybrid-Modus:</strong> Elektro- und Benzinmotor arbeiten zusammen</li>
                <li><strong>Benzin-Modus:</strong> Nur Benzinmotor arbeitet bei leerer Batterie</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-bev-farki-nedir', 'phev-avantajlari-nelerdir', 'phev-menzil-hesaplama-nasil']
    },
    pl: {
      title: 'Czym jest PHEV i jak działa?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) to pojazd hybrydowy łączący silnik elektryczny i silnik benzynowy.',
        sections: [
          {
            title: 'Jak działa PHEV?',
            content: `
              <p>PHEV oferuje trzy tryby jazdy: elektryczny, hybrydowy i benzynowy.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-bev-farki-nedir', 'phev-avantajlari-nelerdir', 'phev-menzil-hesaplama-nasil']
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
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50-100 km (elektrik) + 500+ km (hibrit)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300-600 km (sadece elektrik)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Şarj Süresi</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2-5 saat (AC)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4-12 saat (AC), 30-60 dk (DC)</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-avantajlari-nelerdir', 'phev-satin-alma-rehberi']
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
              <p>PHEVs use both electricity and gasoline, while BEVs rely solely on high-capacity batteries.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-avantajlari-nelerdir', 'phev-satin-alma-rehberi']
    },
    de: {
      title: 'Was ist der Unterschied zwischen PHEV und BEV?',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Der Hauptunterschied liegt in den Energiequellen und der Reichweiten-Flexibilität.',
        sections: []
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-avantajlari-nelerdir', 'phev-satin-alma-rehberi']
    },
    pl: {
      title: 'Jaka jest różnica między PHEV a BEV?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Główna różnica między PHEV a BEV to źródła energii i elastyczność zasięgu.',
        sections: []
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-avantajlari-nelerdir', 'phev-satin-alma-rehberi']
    }
  },
  'phev-avantajlari-nelerdir': {
    tr: {
      title: 'PHEV avantajları ve dezavantajları nelerdir?',
      category: 'Genel Sorular',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hibrit araçlar hem şehir içi düşük tüketim hem de şehirler arası menzil kaygısız sürüş olanağı sunar.',
        sections: [
          {
            title: 'PHEV Avantajları',
            content: `
              <ul>
                <li><strong>Sıfır Emisyon Şehir İçi Sürüş:</strong> Günlük 50-100 km arası mesafeleri sadece elektrikle sessiz ve ekonomik katedebilirsiniz.</li>
                <li><strong>Menzil Kaygısı Yoktur:</strong> Şarjınız bitse dahi benzinli motor devreye girerek kesintisiz seyahat imkanı verir.</li>
                <li><strong>Düşük İşletme Maliyeti:</strong> Evde şarj edildiğinde km başına yakıt maliyeti benzinli araçlara kıyasla %70-80 oranında düşer.</li>
                <li><strong>Anlık Tork ve Performans:</strong> Elektrik motorunun anlık torku sayesinde seri ivmelenme sağlar.</li>
              </ul>
            `
          },
          {
            title: 'Dikkate Alınması Gereken Hususlar',
            content: `
              <ul>
                <li><strong>Düzenli Şarj Gereksinimi:</strong> PHEV araçların avantaj sağlaması için bataryanın düzenli olarak evde veya iş yerinde şarj edilmesi gerekir.</li>
                <li><strong>Çift Motor Ağırlığı:</strong> Hem batarya hem benzinli motor barındırdığı için içten yanmalı araçlara göre biraz daha ağırdır.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-bev-farki-nedir', 'phev-satin-alma-rehberi']
    },
    en: {
      title: 'Benefits and Advantages of PHEVs',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs combine zero-emission city driving with unlimited long-distance travel flexibility.',
        sections: [
          {
            title: 'Main Benefits',
            content: `
              <ul>
                <li><strong>Zero-Emission Commuting:</strong> Cover daily short trips purely on battery power.</li>
                <li><strong>No Range Anxiety:</strong> The internal combustion engine ensures you can take long road trips without worrying about charging stops.</li>
                <li><strong>Instant Torque:</strong> Electric motors provide seamless and quiet acceleration.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-bev-farki-nedir', 'phev-satin-alma-rehberi']
    },
    de: {
      title: 'Vorteile und Nachteile von PHEV',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs bieten emissionsfreies Fahren in der Stadt und volle Langstreckentauglichkeit.',
        sections: []
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-bev-farki-nedir']
    },
    pl: {
      title: 'Zalety i wady pojazdów PHEV',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Pojazdy PHEV łączą oszczędność jazdy miejskiej z elastycznością na długich trasach.',
        sections: []
      },
      relatedQuestions: ['phev-nedir-nasil-calisir', 'phev-bev-farki-nedir']
    }
  },
  'phev-satin-alma-rehberi': {
    tr: {
      title: 'Kapsamlı PHEV Satın Alma Rehberi',
      category: 'Satın Alma Rehberi',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV satın alırken dikkat edilmesi gereken en önemli kriterler; günlük sürüş mesafeniz, ev/iş yeri şarj imkanınız ve bütçenizdir.',
        sections: [
          {
            title: '1. Günlük Sürüş Mesafenizi Hesaplayın',
            content: `
              <p>Ev ile iş arasındaki günlük mesafeniz 40-80 km aralığındaysa, bir PHEV sizin için idealdir. Günlük işe gidiş gelişlerinizi neredeyse tamamen elektrikle tamamlayarak yakıt giderlerinizi minimuma indirebilirsiniz.</p>
            `
          },
          {
            title: '2. Şarj İmkânlarını Değerlendirin',
            content: `
              <p>PHEV'den maksimum verim alabilmek için aracınızı gece evde veya gündüz iş yerinde şarj edebilmeniz önemlidir. Standart 220V ev prizi dahi PHEV bataryalarını gece boyunca tam doldurmaya yeterlidir.</p>
            `
          },
          {
            title: '3. Gerçek Dünya Elektrikli Menzili (WLTP vs Gerçek)',
            content: `
              <p>Katalogda verilen WLTP menzili ideal şartlardadır. Kış aylarında veya yüksek hızlarda elektrikli menzil yaklaşık %20-30 oranında düşebilir. Seçim yaparken günlük ihtiyacınızın biraz üzerinde menzile sahip bir model tercih edin.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-fiyat-araligi-nedir', 'phev-menzil-hesaplama-nasil', 'phev-sarj-sureleri-ne-kadar']
    },
    en: {
      title: 'Complete PHEV Buying Guide',
      category: 'Buying Guide',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Key considerations when buying a PHEV: daily commute distance, home/workplace charging access, and real-world range expectations.',
        sections: [
          {
            title: '1. Assess Your Daily Commute',
            content: `
              <p>If your daily round-trip commute is within 40 to 80 km, a PHEV can cover nearly all your daily driving without using a drop of gasoline.</p>
            `
          },
          {
            title: '2. Check Charging Access',
            content: `
              <p>A standard home outlet is usually enough to fully recharge a PHEV battery overnight (typically 3 to 7 hours).</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-fiyat-araligi-nedir', 'phev-menzil-hesaplama-nasil', 'phev-sarj-sureleri-ne-kadar']
    },
    de: {
      title: 'Vollständiger PHEV-Kaufberater',
      category: 'Kaufberater',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Worauf Sie beim Kauf eines PHEV achten sollten: Tägliche Fahrstrecke, Lademöglichkeiten und Budget.',
        sections: []
      },
      relatedQuestions: ['phev-fiyat-araligi-nedir', 'phev-menzil-hesaplama-nasil']
    },
    pl: {
      title: 'Kompleksowy przewodnik zakupu PHEV',
      category: 'Przewodnik zakupu',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Na co zwrócić uwagę przy zakupie PHEV: codzienny dystans, dostęp do ładowania i budżet.',
        sections: []
      },
      relatedQuestions: ['phev-fiyat-araligi-nedir', 'phev-menzil-hesaplama-nasil']
    }
  },
  'phev-fiyat-araligi-nedir': {
    tr: {
      title: 'PHEV Fiyat Aralıkları ve Bütçe Planlaması',
      category: 'Satın Alma Rehberi',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Avrupa pazarında PHEV modelleri segmentlerine ve batarya kapasitelerine göre farklı fiyat kategorilerinde yer alır.',
        sections: [
          {
            title: 'PHEV Fiyat Segmentleri',
            content: `
              <ul>
                <li><strong>Giriş & Kompakt Segment (€30.000 - €45.000):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid gibi ulaşılabilir modeller.</li>
                <li><strong>Orta & Premium SUV/Sedan (€45.000 - €75.000):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A3/A5, BMW 3/5 Serisi, Volvo XC60.</li>
                <li><strong>Üst Seviye Lüks & Performans (€75.000+):</strong> Porsche Cayenne E-Hybrid, Range Rover PHEV, Mercedes-Benz GLE PHEV.</li>
              </ul>
            `
          },
          {
            title: 'Toplam Sahip Olma Maliyeti (TCO)',
            content: `
              <p>PHEV araçların ilk satın alma fiyatı benzinli modellere göre yüksek görünse de, günlük elektrikli kullanım sayesinde yakıt ve bakım maliyetlerinde sağlanan tasarruf 3-4 yıl içinde aradaki farkı telafi eder.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-satin-alma-rehberi', 'phev-bakim-maliyeti-nedir']
    },
    en: {
      title: 'PHEV Price Ranges & Budget Planning',
      category: 'Buying Guide',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV market pricing in Europe spans compact affordable models to premium luxury vehicles.',
        sections: [
          {
            title: 'Price Categories',
            content: `
              <ul>
                <li><strong>Compact / Affordable (€30,000 - €45,000):</strong> MG HS, Peugeot 308, Ford Kuga.</li>
                <li><strong>Mid-size / Premium (€45,000 - €75,000):</strong> VW Tiguan, Skoda Kodiaq, Audi A5, BMW 3/5 Series.</li>
                <li><strong>Luxury Performance (€75,000+):</strong> Porsche Cayenne, Range Rover E-Hybrid.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-satin-alma-rehberi', 'phev-bakim-maliyeti-nedir']
    },
    de: {
      title: 'PHEV-Preissegmente und Budgetplanung',
      category: 'Kaufberater',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Überblick über die verschiedenen Preiskategorien von PHEV-Modellen in Europa.',
        sections: []
      },
      relatedQuestions: ['phev-satin-alma-rehberi', 'phev-bakim-maliyeti-nedir']
    },
    pl: {
      title: 'Przedziały cenowe PHEV i planowanie budżetu',
      category: 'Przewodnik zakupu',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Przegląd kategorii cenowych pojazdów hybrydowych plug-in na rynku europejskim.',
        sections: []
      },
      relatedQuestions: ['phev-satin-alma-rehberi', 'phev-bakim-maliyeti-nedir']
    }
  },
  'phev-menzil-hesaplama-nasil': {
    tr: {
      title: 'PHEV Menzil Hesaplama ve WLTP Standartları',
      category: 'Teknik Özellikler',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV araçların elektrikli menzili batarya kapasitesi (kWh) ve enerji tüketim verimliliğine (kWh/100km) bağlıdır.',
        sections: [
          {
            title: 'WLTP Standartları Nedir?',
            content: `
              <p>WLTP (Worldwide Harmonised Light Vehicles Test Procedure), araçların emisyon ve menzil değerlerini standart laboratuvar şartlarında ölçen küresel test prosedürüdür. Günümüz modern PHEV modelleri ortalama 60-120 km WLTP elektrikli menzili sunar.</p>
            `
          },
          {
            title: 'Gerçek Dünya Menzilini Etkileyen Faktörler',
            content: `
              <ul>
                <li><strong>Dış Hava Sıcaklığı:</strong> Kışın dondurucu soğuklarda batarya verimliliği %20-30 oranında düşer.</li>
                <li><strong>Sürüş Hızı:</strong> Otoyolda 110 km/s üzeri hızlarda rüzgar direnci artarak elektrik tüketimini hızlandırır.</li>
                <li><strong>İklimlendirme (Klima & Isıtma):</strong> Kabin ısıtması elektrik bataryasından güç çektiği için menzili etkiler.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-sureleri-ne-kadar', 'phev-batarya-omru-ne-kadar']
    },
    en: {
      title: 'PHEV Range Calculation & WLTP Standards',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Electric range depends on usable battery capacity (kWh) and real-world efficiency (kWh/100km).',
        sections: [
          {
            title: 'Understanding WLTP vs Real-World Range',
            content: `
              <p>WLTP provides a standardized benchmark. Real-world electric range typically ranges between 70% to 90% of the WLTP figure depending on ambient temperature and highway speeds.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-sureleri-ne-kadar', 'phev-batarya-omru-ne-kadar']
    },
    de: {
      title: 'PHEV-Reichweitenberechnung und WLTP-Standards',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Wie die elektrische Reichweite gemessen wird und welche Faktoren sie im Alltag beeinflussen.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-sureleri-ne-kadar', 'phev-batarya-omru-ne-kadar']
    },
    pl: {
      title: 'Obliczanie zasięgu PHEV i standardy WLTP',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Jak mierzy się zasięg elektryczny i co wpływa na jego rzeczywiste wartości.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-sureleri-ne-kadar', 'phev-batarya-omru-ne-kadar']
    }
  },
  'phev-sarj-sureleri-ne-kadar': {
    tr: {
      title: 'Şarj Süreleri ve Hız Karşılaştırması (AC vs DC)',
      category: 'Teknik Özellikler',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV şarj süreleri kullanılan güç kaynağına (AC ev prizi, AC Wallbox veya DC Hızlı Şarj) ve aracın dahili şarj ünitesine (OBC) bağlıdır.',
        sections: [
          {
            title: 'Şarj Yöntemleri ve Süreler',
            content: `
              <ul>
                <li><strong>Evsel Priz (2.3 kW AC):</strong> Tam şarj yaklaşık 5 - 9 saat sürer. Gece şarjı için idealdir.</li>
                <li><strong>Wallbox / Şarj İstasyonu (3.7 kW - 11 kW AC):</strong> Tam şarj yaklaşık 2 - 4 saat sürer.</li>
                <li><strong>DC Hızlı Şarj (50 kW DC - destekleyen modellerde):</strong> %0'dan %80'e şarj yaklaşık 25 - 35 dakika sürer (Skoda Kodiaq iV, VW Tiguan, Mercedes PHEV vb.).</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    en: {
      title: 'Charging Times & Speed Comparison (AC vs DC)',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV charging time depends on battery capacity, charger power output (AC vs DC), and onboard charger limits.',
        sections: [
          {
            title: 'Average Charging Duration',
            content: `
              <ul>
                <li><strong>Standard Home Socket (2.3 kW AC):</strong> 5 to 9 hours (overnight).</li>
                <li><strong>AC Wallbox (7.4 kW - 11 kW):</strong> 2 to 4 hours.</li>
                <li><strong>DC Fast Charging (50 kW+ on supported PHEVs):</strong> 0-80% in ~25-35 minutes.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    de: {
      title: 'Ladezeiten und Geschwindigkeitsvergleich (AC vs. DC)',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Übersicht über Ladezeiten an Haushaltssteckdosen, Wallboxen und DC-Schnellladestationen.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    pl: {
      title: 'Czas ładowania i porównanie prędkości (AC vs DC)',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Czas ładowania PHEV z gniazda domowego, stacji Wallbox oraz szybkich ładowarek DC.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    }
  },
  'phev-batarya-omru-ne-kadar': {
    tr: {
      title: 'Batarya Ömrü ve Degradasyon (Yıpranma)',
      category: 'Teknik Özellikler',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Modern lityum-iyon PHEV bataryaları aracın ömrü boyunca yüksek performans sunacak şekilde tasarlanmıştır.',
        sections: [
          {
            title: 'Batarya Ömrü Kaç Yıldır?',
            content: `
              <p>Gelişmiş batarya yönetim sistemleri (BMS) ve sıvı soğutma teknolojileri sayesinde PHEV bataryaları 10-15 yıl veya 200.000+ km sorunsuz hizmet verebilir. Otomobil üreticileri genellikle bataryalar için 8 yıl / 160.000 km %70 kapasite garantisi sunar.</p>
            `
          },
          {
            title: 'Batarya Sağlığını Koruma Tavsiyeleri',
            content: `
              <ul>
                <li>Aracı uzun süre aşırı sıcakta veya tamamen boş batarya ile bekletmeyin.</li>
                <li>Günlük kullanımda bataryayı düzenli şarj ederek tam deşarj olmasını önleyin.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-menzil-hesaplama-nasil', 'phev-bakim-maliyeti-nedir']
    },
    en: {
      title: 'Battery Life & Degradation',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Modern lithium-ion PHEV battery packs are engineered with liquid cooling and BMS for 10-15+ years of operational life.',
        sections: [
          {
            title: 'Expected Lifespan',
            content: `
              <p>PHEV batteries typically lose less than 1-2% capacity per year under normal driving and charging habits, outlasting standard vehicle ownership cycles.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-menzil-hesaplama-nasil', 'phev-bakim-maliyeti-nedir']
    },
    de: {
      title: 'Batterie-Lebensdauer und Degradation',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Informationen zu Lebensdauer, Garantie und Pflege von PHEV-Akkus.',
        sections: []
      },
      relatedQuestions: ['phev-menzil-hesaplama-nasil', 'phev-bakim-maliyeti-nedir']
    },
    pl: {
      title: 'Żywotność baterii i degradacja',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Informacje o żywotności, degradacji i gwarancji na baterie PHEV.',
        sections: []
      },
      relatedQuestions: ['phev-menzil-hesaplama-nasil', 'phev-bakim-maliyeti-nedir']
    }
  },
  'phev-sarj-tipleri-nelerdir': {
    tr: {
      title: 'Şarj Tipleri ve Konnektör Standartları',
      category: 'Şarj ve Altyapı',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Avrupa genelinde PHEV araçlarda yaygın olarak kullanılan şarj soketi ve kablo standartları.',
        sections: [
          {
            title: 'Konnektör Standartları',
            content: `
              <ul>
                <li><strong>Type 2 (Mennekes):</strong> Avrupa'daki tüm AC şarj istasyonlarının ve PHEV araçların standart konnektörüdür (3.7 kW - 22 kW AC).</li>
                <li><strong>CCS Combo 2:</strong> DC hızlı şarjı destekleyen yeni nesil PHEV modellerinde kullanılan sokettir.</li>
                <li><strong>Evsel Priz (Schuko / Mode 2):</strong> Standart prizden güvenli şarj için kontrol kutulu ev şarj kablosu kullanılır.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['ev-phev-sarj-cihazi-gerekli-mi', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    en: {
      title: 'Charging Types & Connectors Explained',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Common charging connectors used for PHEVs across European charging networks.',
        sections: [
          {
            title: 'Connector Standards',
            content: `
              <ul>
                <li><strong>Type 2 (Mennekes):</strong> The universal European standard for AC charging.</li>
                <li><strong>CCS Combo 2:</strong> Combined charging system for models equipped with DC fast charging.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['ev-phev-sarj-cihazi-gerekli-mi', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    de: {
      title: 'Ladetypen und Steckersysteme im Überblick',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Übersicht über Typ 2, CCS und Ladekabel-Standards in Europa.',
        sections: []
      },
      relatedQuestions: ['ev-phev-sarj-cihazi-gerekli-mi', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    pl: {
      title: 'Typy ładowania i złącza',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Standardy złączy Type 2 i CCS stosowane w Europie.',
        sections: []
      },
      relatedQuestions: ['ev-phev-sarj-cihazi-gerekli-mi', 'phev-sarj-istasyonu-nasil-bulunur']
    }
  },
  'ev-phev-sarj-cihazi-gerekli-mi': {
    tr: {
      title: 'Ev Tipi Şarj Çözümleri (Wallbox vs Priz)',
      category: 'Şarj ve Altyapı',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV bataryalarını evde şarj etmek için özel Wallbox istasyonu şart mıdır, yoksa standart priz yeterli midir?',
        sections: [
          {
            title: 'Standart Priz vs Wallbox',
            content: `
              <p>PHEV bataryaları (10 - 25 kWh) tam elektrikli araçlara göre daha küçük olduğu için standart 220V ev prizi ile gece boyunca (5-8 saat) rahatlıkla şarj edilebilir.</p>
              <p>Ancak daha hızlı şarj (2-3 saat) ve kablo tak-çıkar kolaylığı için 7.4 kW ev tipi Wallbox kurulumu önerilir.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    en: {
      title: 'Home Charging Solutions: Wallbox vs Domestic Outlet',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Do you need a dedicated Wallbox for a PHEV, or is a standard home wall socket sufficient?',
        sections: [
          {
            title: 'Home Charging Overview',
            content: `
              <p>Because PHEV batteries are compact (10 to 25 kWh), a standard household wall socket can fully recharge the car overnight in 5 to 8 hours. A Wallbox reduces charging time to 2-3 hours and offers extra safety features.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    de: {
      title: 'Ladelösungen für zu Hause: Wallbox vs. Haushaltssteckdose',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Reicht eine Haushaltssteckdose für einen PHEV oder lohnt sich eine Wallbox?',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'phev-sarj-istasyonu-nasil-bulunur']
    },
    pl: {
      title: 'Domowe rozwiązania do ładowania: Wallbox vs gniazdko',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Czy do PHEV potrzebny jest Wallbox, czy wystarczy zwykłe gniazdko domowe?',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'phev-sarj-istasyonu-nasil-bulunur']
    }
  },
  'phev-sarj-istasyonu-nasil-bulunur': {
    tr: {
      title: 'Şarj İstasyonu Bulma Rehberi ve Harita Uygulamaları',
      category: 'Şarj ve Altyapı',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Şehir içi ve şehirler arası yolculuklarda en yakın kamuya açık AC ve DC şarj istasyonlarını bulma yöntemleri.',
        sections: [
          {
            title: 'Popüler Mobil Uygulamalar',
            content: `
              <ul>
                <li><strong>PlugShare & Shell Recharge:</strong> Avrupa genelinde yüz binlerce şarj noktasını, istasyon durumunu ve soket tiplerini gösterir.</li>
                <li><strong>Google Maps & Apple Maps:</strong> Harita aramasına "EV charging" yazarak çevredeki şarj istasyonlarına ulaşabilirsiniz.</li>
                <li><strong>Araç İçi Navigasyon:</strong> Birçok modern PHEV modeli rotanız üzerindeki şarj istasyonlarını canlı olarak haritada gösterir.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    en: {
      title: 'Finding Charging Stations & Mobile Charging Apps',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'How to locate public AC and DC charging points across Europe using navigation and dedicated apps.',
        sections: [
          {
            title: 'Recommended Apps',
            content: `
              <ul>
                <li><strong>PlugShare, ChargePoint & Shell Recharge:</strong> Global and European coverage of charging locations and real-time charger status.</li>
                <li><strong>Google Maps:</strong> Simply search for "EV charger" along your navigation route.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    de: {
      title: 'Ladestationen finden und Lade-Apps nutzen',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Die besten Apps und Tipps zum Finden von öffentlichen Ladestationen in Europa.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    },
    pl: {
      title: 'Wyszukiwanie stacji ładowania i aplikacje mobilne',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Jak znajdować publiczne stacje ładowania w Europie za pomocą aplikacji mobilnych.',
        sections: []
      },
      relatedQuestions: ['phev-sarj-tipleri-nelerdir', 'ev-phev-sarj-cihazi-gerekli-mi']
    }
  },
  'phev-bakim-maliyeti-nedir': {
    tr: {
      title: 'PHEV Bakım Maliyeti ve Tasarruf Potansiyeli',
      category: 'Bakım ve Servis',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV araçların periyodik bakım maliyetleri ve geleneksel içten yanmalı araçlara göre sağladığı tasarruf avantajları.',
        sections: [
          {
            title: 'Fren Balatası ve Disk Aşınmasında Azalma',
            content: `
              <p>Rejeneratif frenleme (rejenerasyon) sayesinde, araç yavaşlarken elektrik motoru jeneratör gibi çalışarak enerjiyi bataryaya geri yükler. Bu durum mekanik fren balatası ve disklerinin %50'ye varan oranda daha az yıpranmasını sağlar.</p>
            `
          },
          {
            title: 'Benzinli Motor Aşınmasının Azalması',
            content: `
              <p>Günlük sürüşlerin çoğunluğu elektrikle yapıldığı için benzinli motor geleneksel bir araca göre çok daha az saat çalışır. Bu da motor yağının ve mekanik parçaların yıpranma sürecini yavaşlatır.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-batarya-omru-ne-kadar', 'phev-avantajlari-nelerdir']
    },
    en: {
      title: 'PHEV Maintenance Costs & Long-Term Savings',
      category: 'Maintenance & Service',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Understanding long-term servicing requirements, brake wear reduction, and routine maintenance for PHEVs.',
        sections: [
          {
            title: 'Reduced Brake Wear via Regenerative Braking',
            content: `
              <p>Regenerative braking handles a significant portion of deceleration, capturing energy back into the battery. As a result, mechanical brake pads and rotors last up to twice as long as conventional ICE vehicles.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-batarya-omru-ne-kadar', 'phev-avantajlari-nelerdir']
    },
    de: {
      title: 'PHEV-Wartungskosten und langfristige Einsparungen',
      category: 'Wartung & Service',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Wartungsaufwand, Bremsenverschleiß und langfristige Einsparungen bei Plug-in-Hybriden.',
        sections: []
      },
      relatedQuestions: ['phev-batarya-omru-ne-kadar', 'phev-avantajlari-nelerdir']
    },
    pl: {
      title: 'Koszty konserwacji PHEV i oszczędności',
      category: 'Konserwacja i serwis',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Wymagania serwisowe, mniejsze zużycie hamulców i oszczędności eksploatacyjne.',
        sections: []
      },
      relatedQuestions: ['phev-batarya-omru-ne-kadar', 'phev-avantajlari-nelerdir']
    }
  }
}

export function getFaqData(slug: string, locale: 'tr' | 'en' | 'de' | 'pl' = 'tr') {
  const faq = faqData[slug as keyof typeof faqData]
  if (!faq) return null
  
  return faq[locale] || faq.tr
}
