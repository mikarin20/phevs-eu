export const faqData = {
  'what-is-phev-how-it-works': {
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
        'phev-vs-bev-differences',
        'phev-benefits-and-advantages',
        'phev-range-wltp-calculation'
      ]
    },
    en: {
      title: 'What is PHEV and how does it work?',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'A Plug-in Hybrid Electric Vehicle (PHEV) combines both an electric motor and a gasoline engine. These vehicles merge the advantages of electric driving with the flexibility of traditional fuel.',
        sections: [
          {
            title: 'How Does a PHEV Work?',
            content: `
              <p>PHEVs offer three different driving modes that the onboard computer switches between automatically:</p>
              <ul>
                <li><strong>Electric Mode:</strong> Only the electric motor is used — zero tailpipe emissions for everyday city driving.</li>
                <li><strong>Hybrid Mode:</strong> Both electric and gasoline engines work together for maximum efficiency at higher speeds.</li>
                <li><strong>Gasoline Mode:</strong> When the battery is depleted, the vehicle runs on the gasoline engine alone, just like a conventional car.</li>
              </ul>
              <p>A smart energy management system selects the most efficient mode in real time based on speed, battery state, and road conditions.</p>
            `
          },
          {
            title: 'Core PHEV Components',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>Electric Powertrain</h4>
                  <ul>
                    <li>High-voltage lithium-ion battery (10–25 kWh)</li>
                    <li>Electric motor(s) (typically 80–150 kW)</li>
                    <li>Charging port (Type 2 AC and/or CCS DC)</li>
                    <li>Battery Management System (BMS)</li>
                    <li>Onboard charger (OBC)</li>
                  </ul>
                </div>
                <div>
                  <h4>Combustion Powertrain</h4>
                  <ul>
                    <li>Petrol engine (1.0–2.0L turbocharged)</li>
                    <li>Automatic or dual-clutch gearbox</li>
                    <li>Fuel tank (30–60 L)</li>
                    <li>Exhaust & emission control system</li>
                  </ul>
                </div>
              </div>
            `
          },
          {
            title: 'Key Advantages at a Glance',
            content: `
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Eco-Friendly</h4>
                  <p class="text-sm text-green-700 dark:text-green-300">Zero tailpipe emissions during electric driving, significantly lower CO₂ overall.</p>
                </div>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Fuel Savings</h4>
                  <p class="text-sm text-blue-700 dark:text-blue-300">40–60 % less fuel consumption for typical urban commuters who charge regularly.</p>
                </div>
                <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-2">No Range Anxiety</h4>
                  <p class="text-sm text-purple-700 dark:text-purple-300">600+ km combined range — switch seamlessly to petrol when the battery runs out.</p>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: [
        'phev-vs-bev-differences',
        'phev-benefits-and-advantages',
        'phev-range-wltp-calculation'
      ]
    },
    de: {
      title: 'Was ist ein PHEV und wie funktioniert er?',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Ein Plug-in-Hybridfahrzeug (PHEV) kombiniert einen Elektromotor mit einem Verbrennungsmotor und vereint emissionsfreies Fahren in der Stadt mit unbegrenzter Reichweite auf der Autobahn.',
        sections: [
          {
            title: 'Wie funktioniert ein PHEV?',
            content: `
              <p>PHEVs wechseln automatisch zwischen drei Fahrmodi:</p>
              <ul>
                <li><strong>Elektro-Modus:</strong> Nur der Elektromotor ist aktiv — lokal emissionsfrei für den Stadtverkehr.</li>
                <li><strong>Hybrid-Modus:</strong> Elektro- und Benzinmotor arbeiten gemeinsam für maximale Effizienz bei höheren Geschwindigkeiten.</li>
                <li><strong>Benzin-Modus:</strong> Bei leerem Akku fährt das Auto rein mit dem Verbrennungsmotor weiter.</li>
              </ul>
              <p>Ein intelligentes Energiemanagementsystem wählt in Echtzeit den effizientesten Modus.</p>
            `
          },
          {
            title: 'Wichtigste Komponenten',
            content: `
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4>Elektrisches System</h4>
                  <ul>
                    <li>Hochvolt-Lithium-Ionen-Akku (10–25 kWh)</li>
                    <li>Elektromotor(en) (typisch 80–150 kW)</li>
                    <li>Ladeanschluss (Typ 2 AC / CCS DC)</li>
                    <li>Batteriemanagementsystem (BMS)</li>
                  </ul>
                </div>
                <div>
                  <h4>Verbrennungssystem</h4>
                  <ul>
                    <li>Benzinmotor (1,0–2,0 L Turbo)</li>
                    <li>Automatik- oder Doppelkupplungsgetriebe</li>
                    <li>Kraftstofftank (30–60 L)</li>
                    <li>Abgasanlage</li>
                  </ul>
                </div>
              </div>
            `
          }
        ]
      },
      relatedQuestions: ['phev-vs-bev-differences', 'phev-benefits-and-advantages', 'phev-range-wltp-calculation']
    },
    pl: {
      title: 'Czym jest PHEV i jak działa?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Plug-in Hybrid Electric Vehicle (PHEV) łączy silnik elektryczny z benzynowym, oferując zeroemisyjną jazdę w mieście i pełną elastyczność w długich trasach.',
        sections: [
          {
            title: 'Jak działa PHEV?',
            content: `
              <p>PHEV automatycznie przełącza między trzema trybami jazdy:</p>
              <ul>
                <li><strong>Tryb elektryczny:</strong> Tylko silnik elektryczny — zerowa emisja spalin w mieście.</li>
                <li><strong>Tryb hybrydowy:</strong> Oba silniki współpracują dla maksymalnej efektywności.</li>
                <li><strong>Tryb benzynowy:</strong> Po wyczerpaniu akumulatora pojazd jedzie jak tradycyjny samochód.</li>
              </ul>
            `
          },
          {
            title: 'Kluczowe zalety',
            content: `
              <ul>
                <li><strong>Ekologiczność:</strong> Zerowa emisja podczas jazdy elektrycznej.</li>
                <li><strong>Oszczędność paliwa:</strong> 40–60% mniejsze zużycie paliwa przy regularnym ładowaniu.</li>
                <li><strong>Brak obawy o zasięg:</strong> Ponad 600 km zasięgu łączonego.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-vs-bev-differences', 'phev-benefits-and-advantages', 'phev-range-wltp-calculation']
    }
  },
  'phev-vs-bev-differences': {
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
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-benefits-and-advantages', 'phev-buying-guide']
    },
    en: {
      title: 'PHEV vs BEV: What is the Difference?',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs (Plug-in Hybrid Electric Vehicles) and BEVs (Battery Electric Vehicles) represent two distinct approaches to electrified transport. Understanding the trade-offs is key to choosing the right vehicle for your lifestyle.',
        sections: [
          {
            title: 'Side-by-Side Comparison',
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
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Powertrain</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Electric + Petrol</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Electric only</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Electric range</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50–120 km (WLTP)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km (WLTP)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Total range</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">600–900 km (combined)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Charging time</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">2–5 h (AC Wallbox)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">4–12 h AC, 20–45 min DC</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Battery size</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">10–25 kWh</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50–100+ kWh</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Range anxiety</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">None — petrol fallback</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Possible on long trips</td>
                  </tr>
                </tbody>
              </table>
            `
          },
          {
            title: 'Which Should You Choose?',
            content: `
              <p><strong>Choose a PHEV if:</strong></p>
              <ul>
                <li>Your daily commute is under 80 km and you can charge at home or work.</li>
                <li>You regularly travel long distances where public charging infrastructure is uncertain.</li>
                <li>You want to reduce fuel costs and emissions without the commitment of a full EV.</li>
              </ul>
              <p><strong>Choose a BEV if:</strong></p>
              <ul>
                <li>You have reliable home or workplace charging.</li>
                <li>Your daily mileage is well within the vehicle's single-charge range.</li>
                <li>You want the lowest possible running costs and CO₂ footprint.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-benefits-and-advantages', 'phev-buying-guide']
    },
    de: {
      title: 'PHEV vs. BEV: Was ist der Unterschied?',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs und BEVs verfolgen unterschiedliche Ansätze zur Elektromobilität. Die Wahl hängt von Ihrem täglichen Fahrverhalten ab.',
        sections: [
          {
            title: 'Vergleichsübersicht',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Merkmal</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">BEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Antrieb</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Elektro + Benzin</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Nur Elektro</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Elektrische Reichweite</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50–120 km (WLTP)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km (WLTP)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Gesamtreichweite</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">600–900 km (kombiniert)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km</td>
                  </tr>
                </tbody>
              </table>
            `
          },
          {
            title: 'Was passt zu Ihnen?',
            content: `
              <p><strong>Wählen Sie einen PHEV, wenn:</strong></p>
              <ul>
                <li>Ihre tägliche Pendelstrecke unter 80 km liegt und Sie zu Hause oder am Arbeitsplatz laden können.</li>
                <li>Sie regelmäßig lange Strecken fahren, auf denen Schnellladenetz noch lückenhaft ist.</li>
              </ul>
              <p><strong>Wählen Sie ein BEV, wenn:</strong></p>
              <ul>
                <li>Sie zuverlässig zu Hause oder am Arbeitsplatz laden können.</li>
                <li>Ihre tägliche Fahrstrecke deutlich unter der Reichweite des Fahrzeugs liegt.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-benefits-and-advantages', 'phev-buying-guide']
    },
    pl: {
      title: 'PHEV vs BEV: jaka jest różnica?',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVy i BEVy to dwa różne podejścia do elektryfikacji transportu. Wybór zależy od Twoich codziennych potrzeb.',
        sections: [
          {
            title: 'Porównanie PHEV vs BEV',
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
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Napęd</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Elektryczny + benzynowy</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">Tylko elektryczny</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Zasięg elektryczny</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">50–120 km (WLTP)</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km (WLTP)</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 dark:border-slate-600 p-3 font-medium">Zasięg łączony</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">600–900 km</td>
                    <td class="border border-gray-300 dark:border-slate-600 p-3">300–700 km</td>
                  </tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-benefits-and-advantages', 'phev-buying-guide']
    }
  },
  'phev-benefits-and-advantages': {
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
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-vs-bev-differences', 'phev-buying-guide']
    },
    en: {
      title: 'PHEV Benefits & Advantages Explained',
      category: 'General Questions',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs offer a compelling combination of zero-emission urban commuting and unlimited long-distance capability — making them ideal for drivers who are not yet ready to commit fully to an EV.',
        sections: [
          {
            title: 'Top Benefits of Owning a PHEV',
            content: `
              <ul>
                <li><strong>Zero-Emission City Commuting:</strong> Cover daily trips of up to 80 km purely on battery power — no fuel burned, no tailpipe emissions.</li>
                <li><strong>No Range Anxiety:</strong> The petrol engine kicks in seamlessly when the battery is depleted, giving you unlimited reach on any road.</li>
                <li><strong>Lower Running Costs:</strong> Home charging is far cheaper than petrol. Drivers who charge daily can cut fuel costs by 60–80 %.</li>
                <li><strong>Instant Torque:</strong> The electric motor delivers immediate acceleration, making PHEVs feel responsive and sporty from a standstill.</li>
                <li><strong>Regenerative Braking:</strong> Kinetic energy is captured during braking and converted back to electricity, improving efficiency and extending brake pad life.</li>
                <li><strong>Lower CO₂ Emissions:</strong> PHEVs emit significantly less CO₂ than comparable petrol-only vehicles, especially with a green electricity tariff.</li>
              </ul>
            `
          },
          {
            title: 'Considerations & Trade-offs',
            content: `
              <ul>
                <li><strong>Must Charge Regularly:</strong> The full efficiency benefit requires regular charging. If you never plug in, a PHEV can be heavier and slightly less efficient than a conventional car.</li>
                <li><strong>Added Weight:</strong> Carrying both a battery pack and a petrol engine adds 100–200 kg compared to an equivalent ICE vehicle.</li>
                <li><strong>Higher Purchase Price:</strong> PHEVs typically cost €3,000–€8,000 more than a comparable non-hybrid model at purchase, though lower running costs offset this over time.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-vs-bev-differences', 'phev-buying-guide']
    },
    de: {
      title: 'PHEV-Vorteile und Nachteile im Überblick',
      category: 'Allgemeine Fragen',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs bieten emissionsfreies Fahren in der Stadt und volle Langstreckentauglichkeit — ideal für Fahrer, die noch nicht vollständig auf ein Elektroauto umsteigen möchten.',
        sections: [
          {
            title: 'Die wichtigsten Vorteile',
            content: `
              <ul>
                <li><strong>Emissionsfreies Pendeln:</strong> Bis zu 80 km täglicher Fahrstrecke rein elektrisch zurücklegen.</li>
                <li><strong>Keine Reichweitenangst:</strong> Bei leerem Akku übernimmt der Benzinmotor nahtlos.</li>
                <li><strong>Geringere Betriebskosten:</strong> Heimladen ist deutlich günstiger als Benzin — bis zu 70 % weniger Kraftstoffkosten möglich.</li>
                <li><strong>Sofortiges Drehmoment:</strong> Elektrischer Antrieb sorgt für spontane, leise Beschleunigung.</li>
                <li><strong>Rekuperation:</strong> Bremsenergie wird zurückgewonnen und verlängert die Reichweite und Bremslebensdauer.</li>
              </ul>
            `
          },
          {
            title: 'Abwägungen und Nachteile',
            content: `
              <ul>
                <li><strong>Regelmäßiges Laden notwendig:</strong> Ohne regelmäßiges Laden verliert der PHEV seinen Effizienzbonus gegenüber einem konventionellen Fahrzeug.</li>
                <li><strong>Mehrgewicht:</strong> Durch Akku und Verbrenner 100–200 kg schwerer als ein vergleichbares Fahrzeug ohne Hybridantrieb.</li>
                <li><strong>Höherer Kaufpreis:</strong> Typischerweise €3.000–€8.000 teurer als das Pendant ohne Hybridantrieb.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-vs-bev-differences', 'phev-buying-guide']
    },
    pl: {
      title: 'Zalety i wady pojazdów PHEV',
      category: 'Ogólne pytania',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVy łączą zeroemisyjną jazdę miejską z pełną elastycznością na długich trasach — idealne dla kierowców niezdecydowanych na pełne przejście na EV.',
        sections: [
          {
            title: 'Główne zalety',
            content: `
              <ul>
                <li><strong>Zeroemisyjne dojazdy:</strong> Do 80 km dziennie wyłącznie na energii elektrycznej.</li>
                <li><strong>Brak obawy o zasięg:</strong> Po wyczerpaniu akumulatora silnik benzynowy przejmuje jazdę.</li>
                <li><strong>Niższe koszty eksploatacji:</strong> Ładowanie w domu jest znacznie tańsze niż paliwo — oszczędności do 70%.</li>
                <li><strong>Natychmiastowy moment obrotowy:</strong> Silnik elektryczny zapewnia płynne i ciche przyspieszanie.</li>
                <li><strong>Rekuperacja energii:</strong> Energia hamowania odzyskiwana jest z powrotem do akumulatora.</li>
              </ul>
            `
          },
          {
            title: 'Wady i kompromisy',
            content: `
              <ul>
                <li><strong>Wymaga regularnego ładowania:</strong> Bez ładowania PHEV może być mniej efektywny niż zwykły samochód benzynowy.</li>
                <li><strong>Większa masa:</strong> 100–200 kg więcej niż porównywalny samochód spalinowy.</li>
                <li><strong>Wyższa cena zakupu:</strong> Zazwyczaj €3 000–€8 000 droższy od odpowiednika bez napędu hybrydowego.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['what-is-phev-how-it-works', 'phev-vs-bev-differences', 'phev-buying-guide']
    }
  },
  'phev-buying-guide': {
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
      relatedQuestions: ['phev-price-ranges', 'phev-range-wltp-calculation', 'phev-charging-times-ac-vs-dc']
    },
    en: {
      title: 'Complete PHEV Buying Guide',
      category: 'Buying Guide',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'A practical step-by-step guide to buying the right PHEV for your lifestyle. Consider your daily commute, charging access, real-world range expectations, and total cost of ownership.',
        sections: [
          {
            title: '1. Calculate Your Daily Commute',
            content: `
              <p>If your daily round-trip is within 40–80 km, a PHEV can cover nearly all your daily driving without burning any petrol. For commutes up to 120 km, you will still use electric power for the majority of your journey.</p>
              <p>Rule of thumb: choose a PHEV with an electric range at least 20 % greater than your one-way commute distance to account for real-world efficiency losses.</p>
            `
          },
          {
            title: '2. Assess Your Charging Access',
            content: `
              <p>A standard household wall socket (230 V / 10 A) is sufficient to fully recharge most PHEV batteries overnight (typically 5 to 8 hours). For faster charging (2–3 hours), install a 7.4 kW home Wallbox — a one-time cost that pays back quickly in fuel savings.</p>
              <p>If you have access to workplace charging, your effective electric range effectively doubles without any extra effort.</p>
            `
          },
          {
            title: '3. Understand WLTP vs Real-World Range',
            content: `
              <p>Catalogue WLTP figures are measured under standardised lab conditions. In real-world driving, expect:</p>
              <ul>
                <li><strong>Summer (18–25°C):</strong> 85–95 % of WLTP range.</li>
                <li><strong>Winter (below 5°C):</strong> 60–75 % of WLTP range — cold weather reduces battery chemistry efficiency.</li>
                <li><strong>Motorway speeds (110+ km/h):</strong> 70–80 % of WLTP range due to aerodynamic drag.</li>
              </ul>
              <p>Always pick a model whose WLTP range comfortably exceeds your daily need.</p>
            `
          },
          {
            title: '4. Evaluate Total Cost of Ownership (TCO)',
            content: `
              <p>Although PHEVs cost €3,000–€8,000 more upfront than equivalent petrol models, the lower fuel and maintenance costs mean the break-even point is typically reached within 3–4 years for drivers who charge regularly.</p>
              <p>Key savings areas:</p>
              <ul>
                <li>Fuel: 60–80 % reduction in daily fuel spend.</li>
                <li>Brakes: regenerative braking reduces brake wear by up to 50 %.</li>
                <li>Engine wear: petrol engine runs far fewer hours in electric-first operation.</li>
              </ul>
            `
          },
          {
            title: '5. Which PHEV Models to Consider in 2025',
            content: `
              <p>Top-rated PHEVs by segment in Europe:</p>
              <ul>
                <li><strong>Compact / Family (€30k–€45k):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid.</li>
                <li><strong>Mid-size SUV (€45k–€70k):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A5 PHEV, Volvo XC40 Recharge PHEV.</li>
                <li><strong>Premium (€70k+):</strong> BMW 5 Series PHEV, Volvo XC60 PHEV, Mercedes GLE PHEV, Porsche Cayenne E-Hybrid.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-price-ranges', 'phev-range-wltp-calculation', 'phev-charging-times-ac-vs-dc']
    },
    de: {
      title: 'Der vollständige PHEV-Kaufberater',
      category: 'Kaufberater',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Ein praktischer Schritt-für-Schritt-Leitfaden zum Kauf des richtigen PHEV: Pendelstrecke, Lademöglichkeiten, Reichweite und Gesamtkosten.',
        sections: [
          {
            title: '1. Ihre tägliche Pendelstrecke',
            content: `
              <p>Liegt Ihre tägliche Pendelstrecke zwischen 40 und 80 km, deckt ein PHEV nahezu alle Alltagsfahrten rein elektrisch ab. Wählen Sie ein Modell mit einer WLTP-Reichweite, die mindestens 20 % über Ihrer einfachen Pendelstrecke liegt.</p>
            `
          },
          {
            title: '2. Lademöglichkeiten prüfen',
            content: `
              <p>Eine normale Haushaltssteckdose (230 V) reicht aus, um die meisten PHEV-Akkus über Nacht vollständig zu laden (5–8 Stunden). Für schnelleres Laden (2–3 Stunden) empfiehlt sich die Installation einer 7,4-kW-Wallbox.</p>
            `
          },
          {
            title: '3. WLTP vs. Realverbrauch',
            content: `
              <ul>
                <li><strong>Sommer:</strong> 85–95 % der WLTP-Reichweite.</li>
                <li><strong>Winter (unter 5°C):</strong> 60–75 % — Kälte senkt die Batterieeffizienz.</li>
                <li><strong>Autobahn (über 110 km/h):</strong> 70–80 % der WLTP-Angabe.</li>
              </ul>
            `
          },
          {
            title: '4. Gesamtbetriebskosten (TCO)',
            content: `
              <p>Obwohl PHEVs im Kauf teurer sind, amortisieren sich die Mehrkosten durch geringere Kraftstoff- und Wartungskosten in der Regel innerhalb von 3–4 Jahren für regelmäßig ladende Fahrer.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-price-ranges', 'phev-range-wltp-calculation', 'phev-charging-times-ac-vs-dc']
    },
    pl: {
      title: 'Kompleksowy przewodnik zakupu PHEV',
      category: 'Przewodnik zakupu',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Praktyczny przewodnik krok po kroku, jak wybrać odpowiedni PHEV: dojazdy, ładowanie, zasięg i całkowity koszt posiadania.',
        sections: [
          {
            title: '1. Oblicz swój codzienny dojazd',
            content: `
              <p>Jeśli Twój dzienny dojazd wynosi 40–80 km, PHEV może pokryć większość Twoich codziennych podróży czysto elektrycznych. Wybierz model z zasięgiem WLTP o co najmniej 20% większym niż Twój jednostronny dojazd.</p>
            `
          },
          {
            title: '2. Oceń dostęp do ładowania',
            content: `
              <p>Standardowe gniazdko domowe (230 V) wystarczy do pełnego naładowania większości PHEV przez noc (5–8 godzin). Dla szybszego ładowania (2–3 godziny) warto zainstalować Wallbox 7,4 kW.</p>
            `
          },
          {
            title: '3. WLTP vs rzeczywisty zasięg',
            content: `
              <ul>
                <li><strong>Lato:</strong> 85–95% zasięgu WLTP.</li>
                <li><strong>Zima (poniżej 5°C):</strong> 60–75% zasięgu.</li>
                <li><strong>Autostrada (powyżej 110 km/h):</strong> 70–80% zasięgu.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-price-ranges', 'phev-range-wltp-calculation', 'phev-charging-times-ac-vs-dc']
    }
  },
  'phev-price-ranges': {
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
                <li><strong>Giriş &amp; Kompakt Segment (€30.000 - €45.000):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid gibi ulaşılabilir modeller.</li>
                <li><strong>Orta &amp; Premium SUV/Sedan (€45.000 - €75.000):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A3/A5, BMW 3/5 Serisi, Volvo XC60.</li>
                <li><strong>Üst Seviye Lüks &amp; Performans (€75.000+):</strong> Porsche Cayenne E-Hybrid, Range Rover PHEV, Mercedes-Benz GLE PHEV.</li>
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
      relatedQuestions: ['phev-buying-guide', 'phev-maintenance-costs']
    },
    en: {
      title: 'PHEV Price Ranges & Budget Planning',
      category: 'Buying Guide',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV market pricing in Europe spans compact affordable models to premium luxury vehicles. Here is a full breakdown to help you plan your budget.',
        sections: [
          {
            title: 'Price Categories in Europe (2025)',
            content: `
              <ul>
                <li><strong>Compact / Affordable (€30,000–€45,000):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid, Toyota RAV4 PHEV (lower spec).</li>
                <li><strong>Mid-size / Premium SUV & Saloon (€45,000–€75,000):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A5 PHEV, BMW 3 / 5 Series PHEV, Volvo XC60 PHEV.</li>
                <li><strong>Luxury & Performance (€75,000+):</strong> Porsche Cayenne E-Hybrid, Range Rover PHEV, Mercedes-Benz GLE 350e, BMW X5 45e.</li>
              </ul>
            `
          },
          {
            title: 'Total Cost of Ownership (TCO) Example',
            content: `
              <p>Comparing a mid-size PHEV (€52,000) vs equivalent petrol car (€45,000) over 4 years, assuming 15,000 km/year and daily home charging:</p>
              <ul>
                <li><strong>Extra purchase cost:</strong> +€7,000</li>
                <li><strong>Annual fuel saving:</strong> ~€1,400 (70 % reduction)</li>
                <li><strong>Annual brake/maintenance saving:</strong> ~€300</li>
                <li><strong>Break-even point:</strong> ≈ 4 years</li>
              </ul>
              <p>After 4 years, the PHEV owner saves ~€1,700 annually compared to the petrol driver — and drives significantly cleaner.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-buying-guide', 'phev-maintenance-costs']
    },
    de: {
      title: 'PHEV-Preissegmente und Budgetplanung',
      category: 'Kaufberater',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Überblick über die Preiskategorien von PHEV-Modellen in Europa und wie sich die Gesamtbetriebskosten entwickeln.',
        sections: [
          {
            title: 'Preiskategorien in Europa (2025)',
            content: `
              <ul>
                <li><strong>Kompakt / Erschwinglich (€30.000–€45.000):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid.</li>
                <li><strong>Mittelklasse / Premium (€45.000–€75.000):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A5 PHEV, BMW 3er/5er PHEV, Volvo XC60.</li>
                <li><strong>Luxus &amp; Performance (ab €75.000):</strong> Porsche Cayenne E-Hybrid, Mercedes GLE 350e, BMW X5 45e, Range Rover PHEV.</li>
              </ul>
            `
          },
          {
            title: 'Beispiel Gesamtbetriebskosten (TCO)',
            content: `
              <p>Vergleich eines PHEV (€52.000) mit einem Benziner (€45.000) über 4 Jahre bei 15.000 km/Jahr und täglichem Heimladen:</p>
              <ul>
                <li><strong>Mehrpreis beim Kauf:</strong> +€7.000</li>
                <li><strong>Jährliche Kraftstoffersparnis:</strong> ~€1.400</li>
                <li><strong>Amortisationszeit:</strong> ≈ 4 Jahre</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-buying-guide', 'phev-maintenance-costs']
    },
    pl: {
      title: 'Przedziały cenowe PHEV i planowanie budżetu',
      category: 'Przewodnik zakupu',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Przegląd kategorii cenowych hybryd plug-in w Europie oraz analiza całkowitego kosztu posiadania.',
        sections: [
          {
            title: 'Kategorie cenowe w Europie (2025)',
            content: `
              <ul>
                <li><strong>Kompaktowe / przystępne (€30 000–€45 000):</strong> MG HS PHEV, Peugeot 308 PHEV, Ford Kuga PHEV, SEAT Leon e-Hybrid.</li>
                <li><strong>Średnia klasa / premium (€45 000–€75 000):</strong> VW Tiguan eHybrid, Skoda Kodiaq iV, Audi A5 PHEV, BMW serii 3/5 PHEV, Volvo XC60.</li>
                <li><strong>Luksusowe (€75 000+):</strong> Porsche Cayenne E-Hybrid, Mercedes GLE 350e, BMW X5 45e.</li>
              </ul>
            `
          },
          {
            title: 'Całkowity koszt posiadania (TCO)',
            content: `
              <p>Porównanie PHEV (€52 000) z odpowiednikiem benzynowym (€45 000) przez 4 lata przy 15 000 km/rok i codziennym ładowaniu w domu:</p>
              <ul>
                <li><strong>Wyższy koszt zakupu:</strong> +€7 000</li>
                <li><strong>Roczne oszczędności na paliwie:</strong> ~€1 400</li>
                <li><strong>Punkt zwrotu:</strong> ≈ 4 lata</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-buying-guide', 'phev-maintenance-costs']
    }
  },
  'phev-range-wltp-calculation': {
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
                <li><strong>İklimlendirme (Klima &amp; Isıtma):</strong> Kabin ısıtması elektrik bataryasından güç çektiği için menzili etkiler.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-times-ac-vs-dc', 'phev-battery-life-degradation']
    },
    en: {
      title: 'PHEV Range, WLTP & Real-World Calculation',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV electric range is determined by usable battery capacity (kWh) and real-world energy consumption (kWh/100 km). This guide explains how to interpret WLTP figures and plan around them.',
        sections: [
          {
            title: 'What is WLTP?',
            content: `
              <p>WLTP (Worldwide Harmonised Light Vehicles Test Procedure) is the global standard used since 2017 to measure vehicle emissions and range under controlled lab conditions. It replaced the older, less realistic NEDC test.</p>
              <p>Modern PHEVs offer WLTP electric ranges of <strong>60–130 km</strong>, depending on battery size (10–25 kWh) and vehicle weight.</p>
            `
          },
          {
            title: 'How to Calculate Your Effective Range',
            content: `
              <p>Formula: <strong>Electric range = Usable battery capacity (kWh) ÷ Energy consumption (kWh/100km) × 100</strong></p>
              <p>Example — Skoda Kodiaq iV: 25.7 kWh usable ÷ 20 kWh/100km × 100 = <strong>~128 km WLTP</strong></p>
              <p>Real-world efficiency factor by conditions:</p>
              <ul>
                <li>🌤 Mild weather, mixed city/suburban: <strong>90–95 %</strong> of WLTP</li>
                <li>❄️ Winter below 0°C: <strong>60–70 %</strong> of WLTP</li>
                <li>🛣 Motorway at 130 km/h: <strong>65–75 %</strong> of WLTP</li>
              </ul>
            `
          },
          {
            title: 'Top PHEVs Ranked by WLTP Electric Range (2025)',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Model</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Battery (kWh)</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">WLTP Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Skoda Kodiaq iV</td><td class="border border-gray-300 dark:border-slate-600 p-3">25.7 kWh</td><td class="border border-gray-300 dark:border-slate-600 p-3">~128 km</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">MG S9 PHEV</td><td class="border border-gray-300 dark:border-slate-600 p-3">38.6 kWh</td><td class="border border-gray-300 dark:border-slate-600 p-3">~115 km</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">VW Tiguan eHybrid</td><td class="border border-gray-300 dark:border-slate-600 p-3">19.7 kWh</td><td class="border border-gray-300 dark:border-slate-600 p-3">~100 km</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">BMW 5 Series PHEV</td><td class="border border-gray-300 dark:border-slate-600 p-3">20.0 kWh</td><td class="border border-gray-300 dark:border-slate-600 p-3">~96 km</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Peugeot 408 PHEV</td><td class="border border-gray-300 dark:border-slate-600 p-3">12.4 kWh</td><td class="border border-gray-300 dark:border-slate-600 p-3">~60 km</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-times-ac-vs-dc', 'phev-battery-life-degradation']
    },
    de: {
      title: 'PHEV-Reichweite, WLTP und Realverbrauch',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Wie die elektrische Reichweite berechnet wird und welche Faktoren im Alltag eine Rolle spielen.',
        sections: [
          {
            title: 'Was bedeutet WLTP?',
            content: `
              <p>WLTP ist seit 2017 der EU-Standard zur Messung von Verbrauch und Reichweite unter kontrollierten Laborbedingungen. Moderne PHEVs erreichen WLTP-Reichweiten von <strong>60–130 km</strong>.</p>
            `
          },
          {
            title: 'Realweltliche Reichweite nach Bedingungen',
            content: `
              <ul>
                <li>🌤 Mildes Wetter, Stadtverkehr: <strong>90–95 %</strong> der WLTP-Angabe</li>
                <li>❄️ Winter unter 0°C: <strong>60–70 %</strong></li>
                <li>🛣 Autobahn bei 130 km/h: <strong>65–75 %</strong></li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-times-ac-vs-dc', 'phev-battery-life-degradation']
    },
    pl: {
      title: 'Obliczanie zasięgu PHEV i standardy WLTP',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Jak mierzy się zasięg elektryczny i co wpływa na jego rzeczywiste wartości w codziennej jeździe.',
        sections: [
          {
            title: 'Co oznacza WLTP?',
            content: `
              <p>WLTP to europejski standard pomiaru emisji i zasięgu od 2017 roku. Nowoczesne PHEVy osiągają zasięg WLTP <strong>60–130 km</strong>.</p>
            `
          },
          {
            title: 'Rzeczywisty zasięg według warunków',
            content: `
              <ul>
                <li>🌤 Lato, ruch miejski: <strong>90–95%</strong> zasięgu WLTP</li>
                <li>❄️ Zima poniżej 0°C: <strong>60–70%</strong></li>
                <li>🛣 Autostrada 130 km/h: <strong>65–75%</strong></li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-times-ac-vs-dc', 'phev-battery-life-degradation']
    }
  },
  'phev-charging-times-ac-vs-dc': {
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
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    en: {
      title: 'PHEV Charging Times: AC vs DC Speed Comparison',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEV charging time depends on battery capacity, charger power output (AC home socket, AC Wallbox, or DC fast charger), and the vehicle\'s onboard charger (OBC) limit.',
        sections: [
          {
            title: 'Charging Methods and Duration',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Charger Type</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Power</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Typical Full Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Home socket</td><td class="border border-gray-300 dark:border-slate-600 p-3">2.3 kW AC</td><td class="border border-gray-300 dark:border-slate-600 p-3">5–9 hours</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">AC Wallbox</td><td class="border border-gray-300 dark:border-slate-600 p-3">7.4 kW AC</td><td class="border border-gray-300 dark:border-slate-600 p-3">2–4 hours</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">AC Wallbox (fast)</td><td class="border border-gray-300 dark:border-slate-600 p-3">11 kW AC</td><td class="border border-gray-300 dark:border-slate-600 p-3">1.5–3 hours</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">DC Fast Charger</td><td class="border border-gray-300 dark:border-slate-600 p-3">50 kW DC</td><td class="border border-gray-300 dark:border-slate-600 p-3">25–35 min (0→80%)</td></tr>
                </tbody>
              </table>
              <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Note: DC fast charging is only available on select PHEV models (e.g. Skoda Kodiaq iV, VW Tiguan eHybrid, MG HS PHEV, Mercedes PHEV).</p>
            `
          },
          {
            title: 'What Limits Charging Speed?',
            content: `
              <p>The onboard charger (OBC) is the bottleneck — even if you connect to a powerful AC Wallbox, the car can only accept as much power as its OBC allows. Common OBC limits:</p>
              <ul>
                <li><strong>3.7 kW OBC:</strong> Most basic PHEVs — full charge in ~4–6 hours from a Wallbox.</li>
                <li><strong>7.4 kW OBC:</strong> Common mid-range PHEVs — full charge in ~2–3 hours.</li>
                <li><strong>11 kW OBC:</strong> Premium PHEVs — full charge in ~1.5–2 hours.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    de: {
      title: 'PHEV-Ladezeiten: AC vs. DC Vergleich',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Ladezeiten an Haushaltssteckdosen, Wallboxen und DC-Schnellladestationen im Vergleich.',
        sections: [
          {
            title: 'Übersicht Ladezeiten',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Ladertyp</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Leistung</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Volle Ladedauer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Haushaltssteckdose</td><td class="border border-gray-300 dark:border-slate-600 p-3">2,3 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">5–9 Stunden</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">AC-Wallbox</td><td class="border border-gray-300 dark:border-slate-600 p-3">7,4 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">2–4 Stunden</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">DC-Schnelllader</td><td class="border border-gray-300 dark:border-slate-600 p-3">50 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">25–35 Min. (0→80%)</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    pl: {
      title: 'Czas ładowania PHEV: AC vs DC',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Czas ładowania PHEV z gniazdka domowego, stacji Wallbox i szybkich ładowarek DC.',
        sections: [
          {
            title: 'Porównanie czasu ładowania',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Typ ładowarki</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Moc</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Pełne ładowanie</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Gniazdko domowe</td><td class="border border-gray-300 dark:border-slate-600 p-3">2,3 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">5–9 godzin</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Wallbox AC</td><td class="border border-gray-300 dark:border-slate-600 p-3">7,4 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">2–4 godziny</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Szybka ładowarka DC</td><td class="border border-gray-300 dark:border-slate-600 p-3">50 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">25–35 min (0→80%)</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    }
  },
  'phev-battery-life-degradation': {
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
      relatedQuestions: ['phev-range-wltp-calculation', 'phev-maintenance-costs']
    },
    en: {
      title: 'PHEV Battery Life & Degradation: What to Expect',
      category: 'Technical Specs',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Modern PHEV lithium-ion battery packs are engineered to last the lifetime of the vehicle. With liquid thermal management and advanced BMS, degradation is far slower than many drivers expect.',
        sections: [
          {
            title: 'Expected Battery Lifespan',
            content: `
              <p>Under normal driving and charging habits, PHEV batteries typically retain over 80 % of their original capacity after <strong>10 years or 200,000 km</strong>.</p>
              <p>Most manufacturers offer a battery warranty of <strong>8 years / 160,000 km at 70 % capacity</strong>. Some premium brands (e.g. BMW, Volvo) extend this to 10 years.</p>
            `
          },
          {
            title: 'What Causes Degradation?',
            content: `
              <ul>
                <li><strong>High Temperature:</strong> Prolonged parking in extreme heat (>40°C) accelerates lithium-ion chemical ageing. Park in shade or a garage during summer.</li>
                <li><strong>Deep Discharge:</strong> Repeatedly draining the battery to 0 % stresses the cells. Most modern PHEVs automatically maintain a 10–15 % buffer to protect against this.</li>
                <li><strong>Frequent DC Fast Charging:</strong> While DC charging is convenient, repeated high-rate charging generates more heat inside the cells. Use AC charging for daily top-ups.</li>
                <li><strong>Extreme Cold:</strong> Cold temperatures slow lithium-ion reactions, causing temporary capacity loss — but this reverses as the battery warms up.</li>
              </ul>
            `
          },
          {
            title: 'Tips to Maximise Battery Health',
            content: `
              <ul>
                <li>Charge to 80–90 % for daily use; reserve 100 % charge for long trips.</li>
                <li>Use scheduled charging to complete charging just before you leave (avoids long periods at 100 %).</li>
                <li>Avoid leaving the battery fully depleted for extended periods.</li>
                <li>Pre-condition the cabin while still plugged in during winter — reduces the load on the battery when driving.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-range-wltp-calculation', 'phev-maintenance-costs']
    },
    de: {
      title: 'Batterie-Lebensdauer und Degradation beim PHEV',
      category: 'Technische Daten',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Moderne PHEV-Akkus sind für die Lebensdauer des Fahrzeugs ausgelegt. Mit flüssigkeitsgekühltem Thermomanagement und BMS ist die Degradation deutlich geringer als viele Fahrer erwarten.',
        sections: [
          {
            title: 'Erwartete Lebensdauer',
            content: `
              <p>Unter normalen Bedingungen behalten PHEV-Akkus nach <strong>10 Jahren oder 200.000 km</strong> noch über 80 % ihrer ursprünglichen Kapazität.</p>
              <p>Die meisten Hersteller bieten eine Batteriegarantie von <strong>8 Jahren / 160.000 km bei 70 % Kapazität</strong>.</p>
            `
          },
          {
            title: 'Ursachen für Degradation',
            content: `
              <ul>
                <li><strong>Hohe Temperaturen:</strong> Dauerhaftes Parken in extremer Hitze beschleunigt die chemische Alterung.</li>
                <li><strong>Tiefentladung:</strong> Häufiges Entladen auf 0 % belastet die Zellen. Moderne PHEVs halten automatisch einen Puffer von 10–15 %.</li>
                <li><strong>Häufiges DC-Schnellladen:</strong> Erzeugt mehr Wärme — für den Alltag besser AC-Laden verwenden.</li>
              </ul>
            `
          },
          {
            title: 'Tipps für maximale Akkugesundheit',
            content: `
              <ul>
                <li>Im Alltag auf 80–90 % laden; 100 % nur für lange Fahrten.</li>
                <li>Vortemperierung des Innenraums im Winter bei angestecktem Fahrzeug nutzen.</li>
                <li>Akku nicht längere Zeit vollständig entleert lassen.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-range-wltp-calculation', 'phev-maintenance-costs']
    },
    pl: {
      title: 'Żywotność baterii PHEV i degradacja',
      category: 'Specyfikacja techniczna',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Nowoczesne akumulatory PHEV są zaprojektowane na cały okres eksploatacji pojazdu. Degradacja jest znacznie wolniejsza, niż większość kierowców się spodziewa.',
        sections: [
          {
            title: 'Oczekiwana żywotność',
            content: `
              <p>Przy normalnym użytkowaniu akumulatory PHEV zachowują ponad 80% pierwotnej pojemności po <strong>10 latach lub 200 000 km</strong>.</p>
              <p>Większość producentów oferuje gwarancję na baterię przez <strong>8 lat / 160 000 km przy 70% pojemności</strong>.</p>
            `
          },
          {
            title: 'Jak dbać o akumulator?',
            content: `
              <ul>
                <li>Ładuj do 80–90% na co dzień; 100% tylko przed długimi trasami.</li>
                <li>Unikaj pozostawiania baterii całkowicie rozładowanej przez dłuższy czas.</li>
                <li>W zimie podgrzewaj kabinę podczas gdy auto jest podłączone do ładowarki.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-range-wltp-calculation', 'phev-maintenance-costs']
    }
  },
  'phev-charging-types-connectors': {
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
      relatedQuestions: ['phev-home-charging-wallbox-vs-outlet', 'phev-find-charging-stations']
    },
    en: {
      title: 'PHEV Charging Types & Connector Standards',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'A complete guide to charging connector standards used for PHEVs across European charging networks — from home sockets to public fast chargers.',
        sections: [
          {
            title: 'European Connector Standards',
            content: `
              <ul>
                <li><strong>Type 2 (Mennekes IEC 62196-2):</strong> The universal EU standard for AC charging at home Wallboxes and public AC points. Supports 3.7 kW to 22 kW. All new PHEVs sold in Europe include a Type 2 inlet.</li>
                <li><strong>CCS Combo 2 (Combined Charging System):</strong> Adds DC fast-charging capability to the Type 2 connector. Used by an increasing number of PHEVs (e.g. Skoda Kodiaq iV, VW Tiguan, BMW) for 50 kW DC charging.</li>
                <li><strong>Schuko / Mode 2 (Domestic socket):</strong> Standard household plug with an in-cable control box (ICCB) for safe home charging at 2.3 kW. Included with most PHEVs as the emergency charging cable.</li>
              </ul>
            `
          },
          {
            title: 'Charging Mode Explained (Mode 1–4)',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Mode</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Type</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Max Power</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Use Case</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Mode 1</td><td class="border border-gray-300 dark:border-slate-600 p-3">Domestic socket (no ICCB)</td><td class="border border-gray-300 dark:border-slate-600 p-3">2.3 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">Not recommended for EV/PHEV</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Mode 2</td><td class="border border-gray-300 dark:border-slate-600 p-3">Domestic socket + ICCB</td><td class="border border-gray-300 dark:border-slate-600 p-3">2.3 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">Emergency / occasional home charging</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Mode 3</td><td class="border border-gray-300 dark:border-slate-600 p-3">Type 2 AC Wallbox</td><td class="border border-gray-300 dark:border-slate-600 p-3">3.7–22 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">Daily home / workplace charging</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Mode 4</td><td class="border border-gray-300 dark:border-slate-600 p-3">CCS / CHAdeMO DC</td><td class="border border-gray-300 dark:border-slate-600 p-3">50–350 kW</td><td class="border border-gray-300 dark:border-slate-600 p-3">Public fast charging on the road</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-home-charging-wallbox-vs-outlet', 'phev-find-charging-stations']
    },
    de: {
      title: 'Ladetypen und Steckersysteme für PHEVs',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Übersicht über Typ 2, CCS Combo 2 und Haushaltsstecker — die wichtigsten Ladestandards für PHEVs in Europa.',
        sections: [
          {
            title: 'Europäische Steckerstandards',
            content: `
              <ul>
                <li><strong>Typ 2 (Mennekes):</strong> EU-Standardstecker für AC-Laden an Wallboxen und öffentlichen Ladesäulen (3,7–22 kW). Alle in Europa verkauften PHEVs haben eine Typ-2-Buchse.</li>
                <li><strong>CCS Combo 2:</strong> Erweitert den Typ-2-Stecker um DC-Schnellladen (50 kW). Zunehmend in PHEVs verbaut (z.B. Skoda Kodiaq iV, VW Tiguan).</li>
                <li><strong>Schuko / Mode 2:</strong> Haushaltssteckdose mit Steuerkabel (ICCB) für sicheres Heimladen mit 2,3 kW.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-home-charging-wallbox-vs-outlet', 'phev-find-charging-stations']
    },
    pl: {
      title: 'Typy ładowania i złącza PHEV',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Przegląd standardów złączy Type 2, CCS Combo 2 i gniazdek domowych stosowanych w PHEVach w Europie.',
        sections: [
          {
            title: 'Europejskie standardy złączy',
            content: `
              <ul>
                <li><strong>Type 2 (Mennekes):</strong> Europejski standard AC do ładowania w Wallboxach i publicznych stacjach (3,7–22 kW). Wszystkie nowe PHEVy w Europie mają gniazdo Type 2.</li>
                <li><strong>CCS Combo 2:</strong> Rozszerzenie Type 2 o szybkie ładowanie DC (50 kW). Coraz częściej stosowane w PHEVach (np. Skoda Kodiaq iV, VW Tiguan).</li>
                <li><strong>Schuko / Mode 2:</strong> Standardowe gniazdko domowe z kablem sterującym (ICCB) do ładowania z mocą 2,3 kW.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-home-charging-wallbox-vs-outlet', 'phev-find-charging-stations']
    }
  },
  'phev-home-charging-wallbox-vs-outlet': {
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
      relatedQuestions: ['phev-charging-types-connectors', 'phev-find-charging-stations']
    },
    en: {
      title: 'Home Charging for PHEVs: Wallbox vs Domestic Outlet',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Do you need a dedicated home Wallbox for a PHEV, or is plugging into a standard household socket enough? Here is an honest comparison to help you decide.',
        sections: [
          {
            title: 'Standard Outlet (Mode 2) — Sufficient for Most PHEV Owners',
            content: `
              <p>PHEV battery packs are typically <strong>10–25 kWh</strong> — much smaller than a BEV. This means a standard household socket (230 V / 10 A, 2.3 kW) can fully recharge most PHEVs in <strong>5–8 hours overnight</strong>.</p>
              <p>This is a perfectly viable long-term charging solution if:</p>
              <ul>
                <li>You charge every night and your commute is under 80 km.</li>
                <li>You have a dedicated, properly earthed socket in your garage or carport.</li>
                <li>You use the manufacturer-supplied Mode 2 in-cable control box (ICCB).</li>
              </ul>
            `
          },
          {
            title: 'AC Wallbox (Mode 3) — Recommended for Convenience & Speed',
            content: `
              <p>A dedicated 7.4 kW home Wallbox cuts full recharge time to <strong>2–3 hours</strong>, giving you a full battery after a short lunch break or a few hours at home. Additional benefits:</p>
              <ul>
                <li><strong>Safer:</strong> Rated for continuous EV charging loads — standard domestic circuits are not.</li>
                <li><strong>Smart charging:</strong> Schedule charging for off-peak electricity tariffs.</li>
                <li><strong>Cable management:</strong> Fixed tethered cable or locking socket — no fumbling with portable leads.</li>
                <li><strong>Eco feedback:</strong> Track energy usage and CO₂ savings via companion app.</li>
              </ul>
              <p>Typical installed cost of a 7.4 kW Wallbox: <strong>€500–€1,200</strong> (hardware + installation), often subsidised by employer or local energy scheme.</p>
            `
          },
          {
            title: 'Which Should You Choose?',
            content: `
              <p><strong>Standard outlet:</strong> Fine if you charge nightly and have a dedicated, safe socket. No upfront cost.</p>
              <p><strong>Wallbox:</strong> Best for daily drivers wanting faster, safer, smarter charging. Pays for itself in convenience within the first year of ownership.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-find-charging-stations']
    },
    de: {
      title: 'Heimladen: Wallbox vs. Haushaltssteckdose',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Reicht eine Haushaltssteckdose für das tägliche Laden eines PHEVs aus, oder lohnt sich die Investition in eine Wallbox?',
        sections: [
          {
            title: 'Haushaltssteckdose — für die meisten PHEV-Besitzer ausreichend',
            content: `
              <p>PHEV-Akkus (10–25 kWh) sind deutlich kleiner als BEV-Akkus. Eine normale Haushaltssteckdose (230 V / 2,3 kW) kann die meisten PHEVs in <strong>5–8 Stunden über Nacht</strong> vollständig aufladen.</p>
              <p>Voraussetzung: Eine ordnungsgemäß geerdete Steckdose mit dem beiliegenden ICCB-Kabel des Herstellers verwenden.</p>
            `
          },
          {
            title: 'Wallbox — empfehlenswert für Komfort und Sicherheit',
            content: `
              <ul>
                <li><strong>Schneller:</strong> 7,4 kW Wallbox lädt in 2–3 Stunden vollständig.</li>
                <li><strong>Sicherer:</strong> Für Dauerbelastung durch EV-Laden ausgelegt.</li>
                <li><strong>Smart:</strong> Ladezeiten planen, Energie tracken, günstige Tarife nutzen.</li>
              </ul>
              <p>Typische Installationskosten: <strong>€500–€1.200</strong> inkl. Montage.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-find-charging-stations']
    },
    pl: {
      title: 'Ładowanie domowe: Wallbox vs gniazdko',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Czy do codziennego ładowania PHEV wystarczy zwykłe gniazdko, czy warto zainwestować w Wallbox?',
        sections: [
          {
            title: 'Gniazdko domowe — wystarczy dla większości właścicieli PHEV',
            content: `
              <p>Akumulatory PHEV (10–25 kWh) są znacznie mniejsze niż w BEVach. Standardowe gniazdko (230 V / 2,3 kW) w pełni naładuje większość PHEVów w <strong>5–8 godzin przez noc</strong>.</p>
            `
          },
          {
            title: 'Wallbox — wygoda i bezpieczeństwo',
            content: `
              <ul>
                <li><strong>Szybciej:</strong> 7,4 kW Wallbox ładuje w 2–3 godziny.</li>
                <li><strong>Bezpieczniej:</strong> Przeznaczony do ciągłego ładowania EV.</li>
                <li><strong>Inteligentnie:</strong> Harmonogramowanie ładowania, tanie taryfy nocne.</li>
              </ul>
              <p>Koszt instalacji: <strong>€500–€1 200</strong> łącznie z montażem.</p>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-find-charging-stations']
    }
  },
  'phev-find-charging-stations': {
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
                <li><strong>PlugShare &amp; Shell Recharge:</strong> Avrupa genelinde yüz binlerce şarj noktasını, istasyon durumunu ve soket tiplerini gösterir.</li>
                <li><strong>Google Maps &amp; Apple Maps:</strong> Harita aramasına "EV charging" yazarak çevredeki şarj istasyonlarına ulaşabilirsiniz.</li>
                <li><strong>Araç İçi Navigasyon:</strong> Birçok modern PHEV modeli rotanız üzerindeki şarj istasyonlarını canlı olarak haritada gösterir.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    en: {
      title: 'Finding Charging Stations: Apps & Tips',
      category: 'Charging & Infrastructure',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'How to locate public AC and DC charging points across Europe using dedicated apps, in-car navigation, and smart planning tools.',
        sections: [
          {
            title: 'Best Apps for Finding Charging Stations',
            content: `
              <ul>
                <li><strong>PlugShare:</strong> The largest community-powered charging map worldwide. Shows real-time charger status, reviews, and photos. Free.</li>
                <li><strong>ChargePoint &amp; Shell Recharge:</strong> Major European networks with in-app payment and live availability. Good for planned motorway routes.</li>
                <li><strong>ABRP (A Better Route Planner):</strong> Intelligent route planner that integrates PHEV data and suggests charging stops based on your battery state. Ideal for long trips.</li>
                <li><strong>Google Maps:</strong> Simply search "EV charger near me" — pulls live availability data from major networks.</li>
                <li><strong>In-car navigation:</strong> Most modern PHEVs (VW, BMW, Volvo, Mercedes) show live charger availability along your route directly on the central display.</li>
              </ul>
            `
          },
          {
            title: 'Tips for Hassle-Free Public Charging',
            content: `
              <ul>
                <li><strong>Check compatibility first:</strong> Confirm the station has a Type 2 AC or CCS DC socket before departing.</li>
                <li><strong>Have a backup RFID card:</strong> Network-specific apps can sometimes fail — an RFID card for major networks (Ionity, Shell Recharge, ChargePoint) ensures you can always charge.</li>
                <li><strong>Use roaming platforms:</strong> Services like Plugsurfing or Chargemap give access to multiple networks with a single account.</li>
                <li><strong>Plan around 80 % charging:</strong> For DC fast chargers, charging slows significantly above 80 % — it is more efficient to leave at 80 % and stop again later.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    de: {
      title: 'Ladestationen finden: Apps und Tipps',
      category: 'Laden & Infrastruktur',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Die besten Apps und Tipps zum Finden von öffentlichen Ladestationen in Europa.',
        sections: [
          {
            title: 'Empfohlene Apps',
            content: `
              <ul>
                <li><strong>PlugShare:</strong> Größte Community-Ladekarte — Echtzeit-Status, Bewertungen und Fotos.</li>
                <li><strong>ChargePoint &amp; Shell Recharge:</strong> Große europäische Netzwerke mit App-Zahlung und Liveverfügbarkeit.</li>
                <li><strong>ABRP (A Better Route Planner):</strong> Intelligenter Routenplaner für PHEV/EV mit Ladeplanung.</li>
                <li><strong>Google Maps:</strong> Suche "EV-Ladestation" für Echtzeit-Verfügbarkeit.</li>
                <li><strong>Fahrzeugnavigation:</strong> Viele PHEVs zeigen Ladestation-Verfügbarkeit direkt im Display.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    },
    pl: {
      title: 'Wyszukiwanie stacji ładowania: aplikacje i porady',
      category: 'Ładowanie i infrastruktura',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'Jak znajdować publiczne stacje ładowania w Europie za pomocą aplikacji mobilnych i systemów nawigacji.',
        sections: [
          {
            title: 'Najlepsze aplikacje',
            content: `
              <ul>
                <li><strong>PlugShare:</strong> Największa mapa ładowania z danymi społecznościowymi — status na żywo, recenzje.</li>
                <li><strong>ChargePoint &amp; Shell Recharge:</strong> Duże europejskie sieci z płatnością w aplikacji.</li>
                <li><strong>ABRP:</strong> Inteligentny planer tras dla PHEV/EV z planowaniem ładowania.</li>
                <li><strong>Google Maps:</strong> Wyszukaj "stacja ładowania EV" — pokazuje dostępność na żywo.</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-charging-types-connectors', 'phev-home-charging-wallbox-vs-outlet']
    }
  },
  'phev-maintenance-costs': {
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
      relatedQuestions: ['phev-battery-life-degradation', 'phev-benefits-and-advantages']
    },
    en: {
      title: 'PHEV Maintenance Costs & Long-Term Savings',
      category: 'Maintenance & Service',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs have lower long-term maintenance costs than conventional ICE vehicles. Here is a breakdown of where you save — and what still needs regular attention.',
        sections: [
          {
            title: 'Lower Brake Wear via Regenerative Braking',
            content: `
              <p>Regenerative braking handles a significant portion of all deceleration, converting kinetic energy back into electricity. As a result, mechanical brake pads and discs last <strong>up to twice as long</strong> as on a comparable petrol car.</p>
              <p>Real-world data from fleet operators shows PHEV brake replacement intervals extending from the typical 40,000–60,000 km on ICE vehicles to 80,000–120,000 km on PHEVs.</p>
            `
          },
          {
            title: 'Reduced Petrol Engine Wear',
            content: `
              <p>In electric-first mode, the petrol engine only runs when needed — typically on motorway stretches or when the battery is depleted. This means the engine accumulates far fewer operating hours than a conventional vehicle covering the same mileage, leading to:</p>
              <ul>
                <li>Less frequent oil changes (many manufacturers extend PHEV service intervals to 20,000–30,000 km).</li>
                <li>Reduced wear on timing chains, pistons, and turbochargers.</li>
                <li>Potentially lower risk of engine-related failures over the vehicle's life.</li>
              </ul>
            `
          },
          {
            title: 'What Still Needs Regular Servicing',
            content: `
              <ul>
                <li><strong>Engine oil &amp; filter:</strong> Required at manufacturer-specified intervals (typically 15,000–30,000 km or annually).</li>
                <li><strong>Coolant (battery circuit):</strong> The battery thermal management system has its own coolant loop — check every 2–3 years.</li>
                <li><strong>Brake fluid:</strong> Replace every 2 years regardless of mileage — moisture ingress affects performance.</li>
                <li><strong>Tyre rotation:</strong> PHEVs are heavier — rotate tyres every 10,000–15,000 km to ensure even wear.</li>
                <li><strong>12V auxiliary battery:</strong> Replaced on the same cycle as any conventional car (typically every 4–6 years).</li>
              </ul>
            `
          },
          {
            title: 'Estimated Annual Maintenance Cost Comparison',
            content: `
              <table class="w-full border-collapse border border-gray-300 dark:border-slate-600">
                <thead>
                  <tr class="bg-gray-50 dark:bg-slate-700">
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Cost Item</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">Petrol Car</th>
                    <th class="border border-gray-300 dark:border-slate-600 p-3 text-left">PHEV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Annual service</td><td class="border border-gray-300 dark:border-slate-600 p-3">€250–€400</td><td class="border border-gray-300 dark:border-slate-600 p-3">€280–€450</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Brake pads (4 yr)</td><td class="border border-gray-300 dark:border-slate-600 p-3">€300–€500</td><td class="border border-gray-300 dark:border-slate-600 p-3">€0–€150</td></tr>
                  <tr><td class="border border-gray-300 dark:border-slate-600 p-3">Fuel cost (annual)</td><td class="border border-gray-300 dark:border-slate-600 p-3">€1,800–€2,400</td><td class="border border-gray-300 dark:border-slate-600 p-3">€400–€800</td></tr>
                  <tr class="bg-green-50 dark:bg-green-900/20 font-semibold"><td class="border border-gray-300 dark:border-slate-600 p-3">Annual saving (PHEV)</td><td class="border border-gray-300 dark:border-slate-600 p-3">—</td><td class="border border-gray-300 dark:border-slate-600 p-3">~€1,100–€1,800</td></tr>
                </tbody>
              </table>
            `
          }
        ]
      },
      relatedQuestions: ['phev-battery-life-degradation', 'phev-benefits-and-advantages']
    },
    de: {
      title: 'PHEV-Wartungskosten und langfristige Einsparungen',
      category: 'Wartung & Service',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVs haben geringere langfristige Wartungskosten als reine Verbrenner. Ein Überblick, wo Sie sparen — und was regelmäßig gewartet werden muss.',
        sections: [
          {
            title: 'Weniger Bremsverschleiß dank Rekuperation',
            content: `
              <p>Durch Rekuperationsbremsen arbeiten die mechanischen Bremsen deutlich seltener. Die Bremsbeläge halten bei PHEVs typischerweise <strong>doppelt so lange</strong> wie bei reinen Verbrennern — bis zu 80.000–120.000 km statt 40.000–60.000 km.</p>
            `
          },
          {
            title: 'Weniger Motorverschleiß',
            content: `
              <p>Im Electric-First-Betrieb läuft der Benzinmotor deutlich seltener. Das führt zu:</p>
              <ul>
                <li>Seltenerem Ölwechsel (viele Hersteller verlängern auf 20.000–30.000 km).</li>
                <li>Geringerem Verschleiß an Steuerkette, Kolben und Turbolader.</li>
              </ul>
            `
          },
          {
            title: 'Was weiterhin regelmäßig gewartet werden muss',
            content: `
              <ul>
                <li>Motoröl und Filter (laut Herstellerplan).</li>
                <li>Kühlmittel des Akkukreislaufs (alle 2–3 Jahre).</li>
                <li>Bremsflüssigkeit (alle 2 Jahre).</li>
                <li>Reifenrotation (alle 10.000–15.000 km).</li>
                <li>12-V-Hilfsbatterie (alle 4–6 Jahre).</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-battery-life-degradation', 'phev-benefits-and-advantages']
    },
    pl: {
      title: 'Koszty utrzymania PHEV i oszczędności długoterminowe',
      category: 'Konserwacja i serwis',
      lastUpdated: '2025-01-27',
      content: {
        overview: 'PHEVy mają niższe koszty utrzymania niż tradycyjne samochody spalinowe. Sprawdź, gdzie oszczędzasz i co nadal wymaga regularnego serwisu.',
        sections: [
          {
            title: 'Mniejsze zużycie hamulców dzięki rekuperacji',
            content: `
              <p>Hamulce regeneracyjne przejmują dużą część hamowania, co oznacza, że klocki hamulcowe wytrzymują nawet <strong>dwa razy dłużej</strong> niż w samochodzie spalinowym — do 80 000–120 000 km.</p>
            `
          },
          {
            title: 'Mniejsze zużycie silnika benzynowego',
            content: `
              <ul>
                <li>Rzadsze wymiany oleju (producenci często wydłużają do 20 000–30 000 km).</li>
                <li>Mniejsze zużycie łańcucha rozrządu, tłoków i turbosprężarki.</li>
              </ul>
            `
          },
          {
            title: 'Co nadal wymaga serwisu',
            content: `
              <ul>
                <li>Olej silnikowy i filtr (zgodnie z harmonogramem producenta).</li>
                <li>Ciecz chłodząca układu akumulatora (co 2–3 lata).</li>
                <li>Płyn hamulcowy (co 2 lata).</li>
                <li>Rotacja opon (co 10 000–15 000 km).</li>
                <li>Akumulator 12V (co 4–6 lat).</li>
              </ul>
            `
          }
        ]
      },
      relatedQuestions: ['phev-battery-life-degradation', 'phev-benefits-and-advantages']
    }
  }
}

export function getFaqData(slug: string, locale: 'tr' | 'en' | 'de' | 'pl' = 'en') {
  const faq = faqData[slug as keyof typeof faqData]
  if (!faq) return null
  
  return faq[locale] || faq.en
}
