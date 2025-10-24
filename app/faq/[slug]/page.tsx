import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeftIcon, ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { notFound } from 'next/navigation'

// FAQ verilerini burada tanımlayalım
const faqData = {
  'phev-nedir-nasil-calisir': {
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
  'phev-bev-farki-nedir': {
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
        },
        {
          title: 'Hangi Durumda PHEV Tercih Edilmeli?',
          content: `
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <h4 class="font-semibold">Uzun mesafe seyahatler</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">Şarj altyapısı endişesi olmadan uzun yolculuklar</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <h4 class="font-semibold">Evde şarj imkanı yok</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">Apartman veya şehir merkezi yaşamı</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <div>
                  <h4 class="font-semibold">Bütçe kısıtı</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">BEV'den daha uygun fiyat seçenekleri</p>
                </div>
              </div>
            </div>
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
  'phev-avantajlari-nelerdir': {
    title: 'PHEV\'in avantajları nelerdir?',
    category: 'Genel Sorular',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV\'ler, elektrikli araçların çevre dostu özelliklerini geleneksel araçların pratikliği ile birleştirerek benzersiz avantajlar sunar.',
      sections: [
        {
          title: 'Çevresel Avantajlar',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">Emisyon Azaltma</h4>
                <ul class="space-y-2 text-green-700 dark:text-green-300">
                  <li>• Günlük kullanımda sıfır emisyon</li>
                  <li>• %40-60 daha az CO2 salınımı</li>
                  <li>• Hava kalitesine katkı</li>
                  <li>• Sürdürülebilir ulaşım</li>
                </ul>
              </div>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">Enerji Verimliliği</h4>
                <ul class="space-y-2 text-blue-700 dark:text-blue-300">
                  <li>• Rejeneratif frenleme</li>
                  <li>• Akıllı enerji yönetimi</li>
                  <li>• Düşük enerji kaybı</li>
                  <li>• Optimize edilmiş güç dağılımı</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          title: 'Ekonomik Avantajlar',
          content: `
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <h4 class="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">Maliyet Tasarrufu</h4>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">%40-60</div>
                  <div class="text-sm text-yellow-700 dark:text-yellow-300">Yakıt Tasarrufu</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">€500-1000</div>
                  <div class="text-sm text-yellow-700 dark:text-yellow-300">Yıllık Tasarruf</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">%30</div>
                  <div class="text-sm text-yellow-700 dark:text-yellow-300">Bakım Maliyeti</div>
                </div>
              </div>
            </div>
          `
        },
        {
          title: 'Pratik Avantajlar',
          content: `
            <div class="space-y-4">
              <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-blue-600 dark:text-blue-400">🚗</span>
                </div>
                <div>
                  <h4 class="font-semibold">Menzil Esnekliği</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">Elektrik + benzin ile 600+ km kesintisiz sürüş</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 dark:text-green-400">⚡</span>
                </div>
                <div>
                  <h4 class="font-semibold">Şarj Altyapısı Bağımsızlığı</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">Şarj istasyonu bulamadığınızda benzin ile devam edin</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-purple-600 dark:text-purple-400">🔧</span>
                </div>
                <div>
                  <h4 class="font-semibold">Düşük Bakım</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm">Daha az fren ve motor bakımı gereksinimi</p>
                </div>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-nedir-nasil-calisir',
      'phev-bev-farki-nedir',
      'phev-bakim-maliyeti-nedir'
    ]
  },
  'phev-satin-alma-rehberi': {
    title: 'PHEV satın alırken nelere dikkat etmeliyim?',
    category: 'Satın Alma Rehberi',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV satın alırken dikkat edilmesi gereken temel faktörler ve değerlendirme kriterleri.',
      sections: [
        {
          title: 'Temel Değerlendirme Kriterleri',
          content: `
            <div class="space-y-6">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">1. Elektrik Menzili</h4>
                <p class="text-blue-700 dark:text-blue-300 mb-3">Günlük kullanımınıza uygun menzil seçin:</p>
                <ul class="text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Şehir içi: 30-50 km yeterli</li>
                  <li>• Banliyö: 50-70 km ideal</li>
                  <li>• Uzun mesafe: 70+ km tercih edin</li>
                </ul>
              </div>
              
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">2. Şarj Altyapısı</h4>
                <p class="text-green-700 dark:text-green-300 mb-3">Şarj imkanlarınızı değerlendirin:</p>
                <ul class="text-green-700 dark:text-green-300 space-y-1">
                  <li>• Evde şarj imkanı var mı?</li>
                  <li>• İş yerinde şarj noktası var mı?</li>
                  <li>• Bölgede halka açık şarj istasyonları yeterli mi?</li>
                </ul>
              </div>
              
              <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 class="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">3. Bütçe ve Maliyet</h4>
                <p class="text-purple-700 dark:text-purple-300 mb-3">Toplam sahip olma maliyetini hesaplayın:</p>
                <ul class="text-purple-700 dark:text-purple-300 space-y-1">
                  <li>• Satın alma fiyatı</li>
                  <li>• Yakıt tasarrufu</li>
                  <li>• Bakım maliyetleri</li>
                  <li>• Sigorta ve vergiler</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          title: 'Marka ve Model Seçimi',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold mb-3">Popüler PHEV Markaları</h4>
                <ul class="space-y-2">
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>BMW - Lüks segment</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Toyota - Güvenilirlik</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Volkswagen - Geniş model yelpazesi</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Hyundai/Kia - Uygun fiyat</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 class="font-semibold mb-3">Model Kategorileri</h4>
                <ul class="space-y-2">
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>SUV - Aile kullanımı</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Sedan - Konfor</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Hatchback - Şehir kullanımı</span>
                  </li>
                  <li class="flex items-center space-x-2">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                    <span>Station Wagon - Pratiklik</span>
                  </li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-fiyat-araligi-nedir',
      'phev-tesvikler-hangi-ulkelerde',
      'phev-menzil-hesaplama-nasil'
    ]
  },
  'phev-fiyat-araligi-nedir': {
    title: 'PHEV fiyat aralığı nedir?',
    category: 'Satın Alma Rehberi',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV fiyatları, model, marka ve özelliklere göre değişiklik gösterir. Genel olarak geleneksel benzinli araçlardan daha pahalı olsa da, uzun vadede yakıt tasarrufu ile bu fark kapanır.',
      sections: [
        {
          title: 'Fiyat Aralıkları',
          content: `
            <div class="grid md:grid-cols-3 gap-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-semibold text-green-800">Giriş Seviyesi</h4>
                <p class="text-2xl font-bold text-green-600">€25,000 - €35,000</p>
                <ul class="text-sm text-green-700 mt-2">
                  <li>• Kia Niro PHEV</li>
                  <li>• Hyundai IONIQ PHEV</li>
                  <li>• Toyota Prius Prime</li>
                </ul>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-blue-800">Orta Segment</h4>
                <p class="text-2xl font-bold text-blue-600">€35,000 - €50,000</p>
                <ul class="text-sm text-blue-700 mt-2">
                  <li>• BMW 3 Series PHEV</li>
                  <li>• Audi A3 e-tron</li>
                  <li>• Mercedes C-Class PHEV</li>
                </ul>
              </div>
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="font-semibold text-purple-800">Lüks Segment</h4>
                <p class="text-2xl font-bold text-purple-600">€50,000+</p>
                <ul class="text-sm text-purple-700 mt-2">
                  <li>• BMW X5 PHEV</li>
                  <li>• Porsche Cayenne PHEV</li>
                  <li>• Range Rover PHEV</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          title: 'Fiyatı Etkileyen Faktörler',
          content: `
            <ul class="space-y-3">
              <li><strong>Batarya Kapasitesi:</strong> Daha büyük batarya = daha yüksek fiyat</li>
              <li><strong>Elektrik Menzili:</strong> Uzun menzil = premium fiyat</li>
              <li><strong>Marka Prestiji:</strong> Lüks markalar daha pahalı</li>
              <li><strong>Donanım Seviyesi:</strong> Premium donanım ek maliyet</li>
              <li><strong>Ülke Vergileri:</strong> Vergi oranları fiyatı etkiler</li>
            </ul>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-satin-alma-rehberi',
      'phev-tesvikler-hangi-ulkelerde',
      'phev-bakim-maliyeti-nedir'
    ]
  },
  'phev-tesvikler-hangi-ulkelerde': {
    title: 'PHEV teşvikleri hangi ülkelerde mevcut?',
    category: 'Satın Alma Rehberi',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'Avrupa ülkelerinde PHEV satın alımını teşvik etmek için çeşitli devlet teşvikleri ve vergi indirimleri bulunmaktadır.',
      sections: [
        {
          title: 'Avrupa Ülkeleri Teşvikleri',
          content: `
            <div class="space-y-4">
              <div class="border-l-4 border-green-500 pl-4">
                <h4 class="font-semibold">🇩🇪 Almanya</h4>
                <p>• Çevre bonusu: €4,500 (2023 sonrası €3,000)</p>
                <p>• KDV indirimi: %19'dan %7'ye</p>
                <p>• Motorlu taşıt vergisi muafiyeti</p>
              </div>
              <div class="border-l-4 border-blue-500 pl-4">
                <h4 class="font-semibold">🇫🇷 Fransa</h4>
                <p>• Bonus écologique: €2,000 - €5,000</p>
                <p>• Prime à la conversion: €1,000 - €4,000</p>
                <p>• CO2 vergisi indirimi</p>
              </div>
              <div class="border-l-4 border-red-500 pl-4">
                <h4 class="font-semibold">🇳🇱 Hollanda</h4>
                <p>• BPM vergisi muafiyeti</p>
                <p>• Şirket araçları için vergi avantajı</p>
                <p>• Şehir merkezi giriş ücretsiz</p>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-satin-alma-rehberi',
      'phev-fiyat-araligi-nedir',
      'phev-bakim-maliyeti-nedir'
    ]
  },
  'phev-menzil-hesaplama-nasil': {
    title: 'PHEV menzil hesaplama nasıl yapılır?',
    category: 'Teknik Özellikler',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV menzil hesaplama, WLTP standartlarına göre yapılır ve gerçek sürüş koşullarından farklı olabilir.',
      sections: [
        {
          title: 'WLTP Standartları',
          content: `
            <p>WLTP (Worldwide Harmonized Light Vehicles Test Procedure), PHEV menzilini standart koşullarda test eder:</p>
            <ul>
              <li>• Sıcaklık: 23°C</li>
              <li>• Rüzgar: Yok</li>
              <li>• Yol yüzeyi: Düz</li>
              <li>• Hız: Şehir içi + otoyol karışımı</li>
            </ul>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-nedir-nasil-calisir',
      'phev-sarj-sureleri-ne-kadar',
      'phev-batarya-omru-ne-kadar'
    ]
  },
  'phev-sarj-sureleri-ne-kadar': {
    title: 'PHEV şarj süreleri ne kadar?',
    category: 'Teknik Özellikler',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV şarj süreleri, şarj türü ve batarya kapasitesine göre değişir.',
      sections: [
        {
          title: 'Şarj Süreleri',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4>AC Şarj (Ev/İş)</h4>
                <ul>
                  <li>• 3.7 kW: 4-6 saat</li>
                  <li>• 7.4 kW: 2-3 saat</li>
                  <li>• 11 kW: 1.5-2 saat</li>
                </ul>
              </div>
              <div>
                <h4>DC Hızlı Şarj</h4>
                <ul>
                  <li>• 50 kW: 30-45 dakika</li>
                  <li>• 150 kW: 15-20 dakika</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-sarj-tipleri-nelerdir',
      'phev-menzil-hesaplama-nasil',
      'phev-batarya-omru-ne-kadar'
    ]
  },
  'phev-batarya-omru-ne-kadar': {
    title: 'PHEV batarya ömrü ne kadar?',
    category: 'Teknik Özellikler',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV bataryaları genellikle 8-10 yıl veya 150,000-200,000 km ömre sahiptir.',
      sections: [
        {
          title: 'Batarya Ömrü Faktörleri',
          content: `
            <ul>
              <li>• Sıcaklık kontrolü</li>
              <li>• Şarj alışkanlıkları</li>
              <li>• Kullanım sıklığı</li>
              <li>• Kalite ve teknoloji</li>
            </ul>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-sarj-sureleri-ne-kadar',
      'phev-bakim-maliyeti-nedir',
      'phev-garanti-suresi-ne-kadar'
    ]
  },
  'phev-sarj-tipleri-nelerdir': {
    title: 'PHEV şarj tipleri nelerdir?',
    category: 'Şarj ve Altyapı',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV\'ler farklı şarj tiplerini destekler. En yaygın olanları Type 2 AC ve CCS DC\'dir.',
      sections: [
        {
          title: 'Şarj Tipleri',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4>AC Şarj (Alternatif Akım)</h4>
                <ul>
                  <li>• Type 2 (Mennekes) - En yaygın</li>
                  <li>• Ev şarj cihazları</li>
                  <li>• İş yeri şarj noktaları</li>
                  <li>• 3.7 kW - 22 kW güç</li>
                </ul>
              </div>
              <div>
                <h4>DC Şarj (Doğru Akım)</h4>
                <ul>
                  <li>• CCS Combo 2 - Hızlı şarj</li>
                  <li>• CHAdeMO - Japon standardı</li>
                  <li>• Hızlı şarj istasyonları</li>
                  <li>• 50 kW - 350 kW güç</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-sarj-sureleri-ne-kadar',
      'ev-phev-sarj-cihazi-gerekli-mi',
      'phev-sarj-istasyonu-nasil-bulunur'
    ]
  },
  'ev-phev-sarj-cihazi-gerekli-mi': {
    title: 'EV/PHEV şarj cihazı gerekli mi?',
    category: 'Şarj ve Altyapı',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV sahipleri için ev şarj cihazı zorunlu değildir, ancak konfor ve hız açısından önerilir.',
      sections: [
        {
          title: 'Şarj Seçenekleri',
          content: `
            <div class="space-y-4">
              <div class="border-l-4 border-green-500 pl-4">
                <h4 class="font-semibold">Ev Şarj Cihazı (Önerilen)</h4>
                <p>• 7.4 kW güç</p>
                <p>• 2-3 saatte tam şarj</p>
                <p>• Gece şarjı için ideal</p>
                <p>• Maliyet: €800-1,500</p>
              </div>
              <div class="border-l-4 border-blue-500 pl-4">
                <h4 class="font-semibold">Standart Ev Prizı</h4>
                <p>• 2.3 kW güç</p>
                <p>• 6-8 saatte tam şarj</p>
                <p>• Acil durumlar için</p>
                <p>• Ek maliyet yok</p>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-sarj-tipleri-nelerdir',
      'phev-sarj-istasyonu-nasil-bulunur',
      'phev-sarj-sureleri-ne-kadar'
    ]
  },
  'phev-sarj-istasyonu-nasil-bulunur': {
    title: 'PHEV şarj istasyonu nasıl bulunur?',
    category: 'Şarj ve Altyapı',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV şarj istasyonları çeşitli uygulamalar ve haritalar ile kolayca bulunabilir.',
      sections: [
        {
          title: 'Şarj İstasyonu Bulma Yöntemleri',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4>Mobil Uygulamalar</h4>
                <ul>
                  <li>• PlugShare - En kapsamlı</li>
                  <li>• ChargePoint - ABD odaklı</li>
                  <li>• EVgo - Hızlı şarj</li>
                  <li>• Tesla Supercharger</li>
                </ul>
              </div>
              <div>
                <h4>Web Siteleri</h4>
                <ul>
                  <li>• OpenChargeMap.org</li>
                  <li>• Zap-Map (İngiltere)</li>
                  <li>• GoingElectric.de (Almanya)</li>
                  <li>• ChargeFinder (Avrupa)</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-sarj-tipleri-nelerdir',
      'ev-phev-sarj-cihazi-gerekli-mi',
      'phev-sarj-sureleri-ne-kadar'
    ]
  },
  'phev-bakim-maliyeti-nedir': {
    title: 'PHEV bakım maliyeti nedir?',
    category: 'Bakım ve Servis',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV bakım maliyetleri geleneksel araçlara göre genellikle daha düşüktür.',
      sections: [
        {
          title: 'Bakım Maliyetleri',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4>Düşük Maliyetli Bakım</h4>
                <ul>
                  <li>• Fren balata değişimi az</li>
                  <li>• Motor yağı değişimi az</li>
                  <li>• Egzoz sistemi bakımı yok</li>
                  <li>• Daha az aşınma</li>
                </ul>
              </div>
              <div>
                <h4>Yüksek Maliyetli Bakım</h4>
                <ul>
                  <li>• Batarya değişimi (8-10 yıl)</li>
                  <li>• Elektrik sistemi bakımı</li>
                  <li>• Özel servis gereksinimi</li>
                  <li>• Yedek parça maliyeti</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-garanti-suresi-ne-kadar',
      'phev-servis-aglari-yeterli-mi',
      'phev-batarya-omru-ne-kadar'
    ]
  },
  'phev-garanti-suresi-ne-kadar': {
    title: 'PHEV garanti süresi ne kadar?',
    category: 'Bakım ve Servis',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV garantileri genellikle 3-8 yıl arasında değişir ve batarya garantisi ayrıdır.',
      sections: [
        {
          title: 'Garanti Türleri',
          content: `
            <div class="space-y-4">
              <div class="border-l-4 border-green-500 pl-4">
                <h4 class="font-semibold">Araç Garantisi</h4>
                <p>• 3-5 yıl veya 100,000 km</p>
                <p>• Motor ve şanzıman</p>
                <p>• Elektrik sistemi</p>
              </div>
              <div class="border-l-4 border-blue-500 pl-4">
                <h4 class="font-semibold">Batarya Garantisi</h4>
                <p>• 8 yıl veya 160,000 km</p>
                <p>• Kapasite garantisi (%70-80)</p>
                <p>• Ücretsiz değişim</p>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-bakim-maliyeti-nedir',
      'phev-servis-aglari-yeterli-mi',
      'phev-batarya-omru-ne-kadar'
    ]
  },
  'phev-servis-aglari-yeterli-mi': {
    title: 'PHEV servis ağları yeterli mi?',
    category: 'Bakım ve Servis',
    lastUpdated: '2025-01-27',
    content: {
      overview: 'PHEV servis ağları hızla gelişmekte ve çoğu büyük şehirde yeterli kapsama sahiptir.',
      sections: [
        {
          title: 'Servis Ağı Durumu',
          content: `
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4>Gelişmiş Servis</h4>
                <ul>
                  <li>• BMW, Mercedes, Audi</li>
                  <li>• Toyota, Lexus</li>
                  <li>• Volkswagen, Skoda</li>
                  <li>• Kapsamlı ağ</li>
                </ul>
              </div>
              <div>
                <h4>Gelişen Servis</h4>
                <ul>
                  <li>• Kia, Hyundai</li>
                  <li>• MG, BYD</li>
                  <li>• Hızla büyüyen ağ</li>
                  <li>• Özel servis merkezleri</li>
                </ul>
              </div>
            </div>
          `
        }
      ]
    },
    relatedQuestions: [
      'phev-bakim-maliyeti-nedir',
      'phev-garanti-suresi-ne-kadar',
      'phev-satin-alma-rehberi'
    ]
  }
}

interface FAQDetailProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: FAQDetailProps): Promise<Metadata> {
  const faq = faqData[params.slug as keyof typeof faqData]
  
  if (!faq) {
    return {
      title: 'Sayfa Bulunamadı | PHEVs.eu',
    }
  }

  return {
    title: `${faq.title} | PHEVs.eu`,
    description: `PHEV hakkında detaylı bilgi: ${faq.title}. Uzman ekibimiz tarafından hazırlanan kapsamlı rehber.`,
    keywords: [
      'PHEV',
      'plug-in hibrit',
      faq.title.toLowerCase(),
      'hibrit araç',
      'elektrikli araç'
    ],
    openGraph: {
      title: `${faq.title} | PHEVs.eu`,
      description: `PHEV hakkında detaylı bilgi: ${faq.title}`,
      type: 'article',
    },
  }
}

export default function FAQDetail({ params }: FAQDetailProps) {
  const faq = faqData[params.slug as keyof typeof faqData]

  if (!faq) {
    notFound()
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {
      "@type": "Question",
      "name": faq.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.content.overview
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Ana Sayfa</Link>
            <ChevronRightIcon className="h-4 w-4" />
            <Link href="/faq" className="hover:text-gray-700 dark:hover:text-gray-300">SSS</Link>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white">{faq.category}</span>
          </nav>

          {/* Back Button */}
          <Link
            href="/faq"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Tüm Sorulara Dön
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                {faq.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {faq.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {faq.content.overview}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Son güncelleme: {new Date(faq.lastUpdated).toLocaleDateString('tr-TR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
            <div className="p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {faq.content.sections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                      {section.title}
                    </h2>
                    <div 
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Questions */}
          {faq.relatedQuestions.length > 0 && (
            <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                İlgili Sorular
              </h3>
              <div className="space-y-3">
                {faq.relatedQuestions.map((relatedSlug) => {
                  const relatedFaq = faqData[relatedSlug as keyof typeof faqData]
                  if (!relatedFaq) return null
                  
                  return (
                    <Link
                      key={relatedSlug}
                      href={`/faq/${relatedSlug}`}
                      className="block p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {relatedFaq.title}
                        </h4>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Hala Sorunuz mu Var?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Uzman ekibimiz size yardımcı olmaya hazır. Sorularınızı bize iletin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                İletişime Geçin
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-slate-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Araç Karşılaştır
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Static generation için gerekli
export async function generateStaticParams() {
  return Object.keys(faqData).map((slug) => ({
    slug,
  }))
}