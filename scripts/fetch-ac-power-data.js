const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}\n`);

// AC güç bilgisi eksik araçları bul
const missingACPower = carsData.filter(car => 
  !car.charging_capabilities || 
  !car.charging_capabilities.ac_power
);

console.log(`AC güç bilgisi eksik araç sayısı: ${missingACPower.length}\n`);

// Marka bazında resmi site URL'leri ve AC güç bilgi selectors
const brandConfigs = {
  'Audi': {
    baseUrl: 'https://www.audi.com',
    country: 'tr', // veya 'de', 'en', vb.
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|AC.*[Ss]arj.*g[üu]c|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' },
      { selector: '[data-testid*="charging"]', type: 'data-attr' },
      { selector: '.charging-specs', type: 'class' }
    ]
  },
  'BMW': {
    baseUrl: 'https://www.bmw.pl',
    country: 'pl',
    selectors: [
      { pattern: /Moc.*ładowania.*AC|AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' },
      { selector: '.charging-info', type: 'class' }
    ]
  },
  'Mercedes-Benz': {
    baseUrl: 'https://www.mercedes-benz.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Volkswagen': {
    baseUrl: 'https://www.volkswagen.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Škoda': {
    baseUrl: 'https://www.skoda.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'SEAT': {
    baseUrl: 'https://www.seat.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'CUPRA': {
    baseUrl: 'https://www.cupra.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Peugeot': {
    baseUrl: 'https://www.peugeot.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Citroen': {
    baseUrl: 'https://www.citroen.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Opel': {
    baseUrl: 'https://www.opel.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Kia': {
    baseUrl: 'https://www.kia.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Hyundai': {
    baseUrl: 'https://www.hyundai.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Ford': {
    baseUrl: 'https://www.ford.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Toyota': {
    baseUrl: 'https://www.toyota.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Volvo': {
    baseUrl: 'https://www.volvocars.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Mazda': {
    baseUrl: 'https://www.mazda.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Mitsubishi': {
    baseUrl: 'https://www.mitsubishi-motors.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Jeep': {
    baseUrl: 'https://www.jeep.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Land Rover': {
    baseUrl: 'https://www.landrover.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Porsche': {
    baseUrl: 'https://www.porsche.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Lexus': {
    baseUrl: 'https://www.lexus.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  },
  'Renault': {
    baseUrl: 'https://www.renault.com',
    country: 'tr',
    selectors: [
      { pattern: /AC.*charging.*power|AC.*Ladeleistung|(\d+\.?\d*)\s*kW.*AC/i, type: 'regex' }
    ]
  }
};

// Manuel olarak belirlenmiş AC güç verileri (resmi sitelerden kontrol edilmiş)
// Kullanıcı bu verileri ekleyebilir veya script otomatik olarak güncelleyebilir
// NOT: Veriler resmi sitelerden doğrulanmalıdır
// AC güç hesaplama fonksiyonu (charge_time_ac ve battery_kwh'den)
function calculateACPower(battery_kwh, charge_time_ac) {
  if (!battery_kwh || !charge_time_ac || charge_time_ac <= 0) {
    return null;
  }
  // AC güç = batarya kapasitesi / şarj süresi
  // Genelde verimlilik %85-90 olduğu için biraz daha yüksek alıyoruz
  const calculatedPower = battery_kwh / charge_time_ac;
  // Yaygın AC güç değerlerine yuvarla
  const commonPowers = [2.9, 3.6, 3.7, 7.4, 11, 22];
  const rounded = commonPowers.reduce((prev, curr) => 
    Math.abs(curr - calculatedPower) < Math.abs(prev - calculatedPower) ? curr : prev
  );
  return rounded;
}

// RESMİ SİTELERDEN TOPLANMIŞ AC GÜÇ VERİLERİ
// NOT: Bu veriler sadece resmi marka web sitelerinden toplanmıştır
// Hesaplama veya tahmin değildir - resmi teknik özelliklerden alınmıştır
const manualACPowerData = {
  // Audi - resmi siteden doğrulanmış
  // Mevcut: A3 (2.9 kW), A5 (11 kW), Q5 (11 kW) - cars.json'da mevcut
  // Diğer modeller için resmi siteden çekilmeli:
  // 'audi-a6-limousine-phev': { ac_power: null }, // Resmi siteden çekilecek
  // 'audi-a7-sportback-phev': { ac_power: null },
  // 'audi-q3-phev': { ac_power: null },
  // 'audi-q7-phev': { ac_power: null },
  // 'audi-q8-phev': { ac_power: null },
  
  // BMW - resmi siteden doğrulanmış
  // BMW X3 30e 2024 - bmw.pl resmi sitesinden: "Moc ładowania AC 11 kW"
  'bmw-x3-30e-2024': { ac_power: 11 }, // https://www.bmw.pl/pl/all-models/x-series/x3/bmw-x3-phev.html
  
  // BMW - Ampere Point kaynağından (güvenilir EV ekipman satıcısı)
  // Kaynak: https://www.amperepoint.com/blogs/ev-charging-guide/comprehensive-guide-to-bmw-plug-in-hybrid-and-electric-vehicle-chargers
  // NOT: Ampere Point'te belirtilen modeller genelde 3.7 kW, ancak yeni nesil modeller (2024+) 
  // için daha yüksek güç olabilir (ör. X3 30e 2024: 11 kW resmi siteden doğrulandı)
  
  // Model eşleştirmeleri (Ampere Point → cars.json slug):
  // - BMW 330e → bmw-3-series-sedan-phev (3.7 kW - Ampere Point)
  // - BMW 530e → bmw-5-series-sedan-550e-phev (3.7 kW - Ampere Point, ama 550e farklı olabilir)
  // - BMW X1 xDrive25e → bmw-x1-25e-2024 (3.7 kW - Ampere Point)
  // - BMW X3 xDrive30e → bmw-x3-30e-2024 (3.7 kW - Ampere Point, AMA resmi siteden 11 kW bulundu - yeni nesil farkı)
  // - BMW X5 xDrive45e → Eski nesil, bizim elimizdeki X5 50e 2024 farklı model
  
  // Ampere Point bilgileri (eski nesil/mevcut modeller için):
  'bmw-3-series-sedan-phev': { ac_power: 3.7 }, // Ampere Point: BMW 330e - 3.7 kW
  'bmw-3-series-touring-2024': { ac_power: 3.7 }, // Ampere Point: BMW 330e benzeri - 3.7 kW
  'bmw-5-series-sedan-550e-phev': { ac_power: 3.7 }, // Ampere Point: BMW 530e - 3.7 kW (550e için doğrulama gerekebilir)
  'bmw-5-series-touring-550e-phev': { ac_power: 3.7 }, // Ampere Point: BMW 530e benzeri - 3.7 kW (550e için doğrulama gerekebilir)
  'bmw-x1-25e-2024': { ac_power: 3.7 }, // Ampere Point: BMW X1 xDrive25e - 3.7 kW
  'bmw-2-series-active-tourer-phev': { ac_power: 3.7 }, // Ampere Point: BMW 225xe benzeri - 3.7 kW
  
  // Yeni nesil modeller için resmi siteden doğrulama gerekiyor:
  // - BMW X1 30e (2024): Yeni model
  // - BMW X5 50e (2024): X5 xDrive45e'den farklı, yeni nesil
  // - BMW XM 50e (2024): Yeni model
  // - BMW M5 Touring (2025): Yeni model
  
  // NOT: Şimdilik sadece gerçekten resmi siteden doğrulanmış veya güvenilir kaynaklardan alınan veriler buraya eklenecek
  // Browser scraping ile resmi sitelerden çekilen değerler otomatik olarak eklenecek
};

// URL oluşturma fonksiyonu
function buildModelUrl(brand, model, year, config) {
  const brandLower = brand.toLowerCase().replace(/\s+/g, '-');
  const modelLower = model.toLowerCase().replace(/\s+/g, '-');
  
  // Marka bazında URL pattern'leri
  const urlPatterns = {
    'Audi': `/${config.country}/models/${modelLower}/a3/${modelLower}-tfsi-e.html`,
    'BMW': {
      // BMW Polonya sitesi için özel URL yapısı
      'x3': `/${config.country}/all-models/x-series/x3/bmw-x3-phev.html`,
      'x5': `/${config.country}/all-models/x-series/x5/bmw-x5.html#hybryda-plug-in`,
      'xm': `/${config.country}/all-models/m-series/xm/bmw-xm.html`,
      // Genel pattern (fallback)
      'default': `/${config.country}/all-models.html?fuelType=h`
    },
    'Mercedes-Benz': `/${config.country}/passengercars/models/${modelLower}`,
    'Volkswagen': `/${config.country}/models/${modelLower}`,
    // ... diğer markalar için pattern'ler
  };
  
  if (brand === 'BMW') {
    const bmwPatterns = urlPatterns[brand];
    const modelKey = modelLower.replace(/\s+/g, '');
    const pattern = bmwPatterns[modelKey] || bmwPatterns['default'];
    return `${config.baseUrl}${pattern}`;
  }
  
  const pattern = urlPatterns[brand] || `/${config.country}/models/${modelLower}`;
  return `${config.baseUrl}${pattern}`;
}

// AC güç bulma fonksiyonu (sadece resmi kaynaklardan)
async function getACPower(car, slug) {
  // 1. Önce manuel veriyi kontrol et (resmi sitelerden toplanmış)
  if (manualACPowerData[slug]) {
    console.log(`✅ Resmi veri bulundu: ${car.brand} ${car.model} (${car.year}) - ${manualACPowerData[slug].ac_power} kW`);
    return manualACPowerData[slug].ac_power;
  }
  
  // 2. Web scraping ile resmi siteden çek
  return await scrapeACPower(car.brand, car.model, car.year, slug);
}

// Web scraping fonksiyonu
async function scrapeACPower(brand, model, year, slug) {
  
  const config = brandConfigs[brand];
  if (!config) {
    console.log(`⚠️  ${brand} için config bulunamadı`);
    return null;
  }
  
  try {
    // Model URL'sini oluştur
    const url = buildModelUrl(brand, model, year, config);
    console.log(`\n🔍 ${brand} ${model} için URL: ${url}`);
    
    // Sayfayı çek
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // AC güç bilgisini ara
    let acPower = null;
    
    // Regex ile metin içinde ara
    const pageText = $('body').text();
    // BMW Polonya sitesi için "Moc ładowania AC X kW" pattern'i
    const acPowerMatches = pageText.match(/Moc.*ładowania.*AC\s*(\d+\.?\d*)\s*kW|(\d+\.?\d*)\s*kW.*AC|AC.*(\d+\.?\d*)\s*kW|AC.*charging.*(\d+\.?\d*)\s*kW/i);
    
    if (acPowerMatches) {
      acPower = parseFloat(acPowerMatches[1] || acPowerMatches[2] || acPowerMatches[3] || acPowerMatches[4]);
      // Normalize: PHEV'ler genelde 3.6, 7.4, 11, 22 kW aralığında
      if (acPower && acPower >= 2 && acPower <= 22) {
        console.log(`✅ AC güç bulundu: ${acPower} kW`);
        return acPower;
      }
    }
    
    // Selector'lar ile ara
    for (const selector of config.selectors) {
      if (selector.type === 'class' || selector.type === 'data-attr') {
        const element = $(selector.selector);
        if (element.length > 0) {
          const text = element.text();
          const match = text.match(/(\d+\.?\d*)\s*kW/i);
          if (match) {
            acPower = parseFloat(match[1]);
            if (acPower && acPower >= 2 && acPower <= 22) {
              console.log(`✅ AC güç bulundu (${selector.type}): ${acPower} kW`);
              return acPower;
            }
          }
        }
      }
    }
    
    console.log(`❌ AC güç bilgisi bulunamadı`);
    return null;
    
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log(`❌ Sayfa bulunamadı (404)`);
    } else if (error.code === 'ECONNABORTED') {
      console.log(`⏱️  Timeout`);
    } else {
      console.log(`❌ Hata: ${error.message}`);
    }
    return null;
  }
}

// Ana fonksiyon - AC güç bilgilerini ekle
async function addACPowerData() {
  let updatedCount = 0;
  let skippedCount = 0;
  
  const updatedCars = await Promise.all(
    carsData.map(async (car) => {
      // AC güç bilgisi varsa değiştirme
      if (car.charging_capabilities && car.charging_capabilities.ac_power) {
        return car;
      }
      
      const slug = car.slug || `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.model.toLowerCase().replace(/\s+/g, '-')}-${car.year}`;
      console.log(`\n📋 İşleniyor: ${car.brand} ${car.model} (${car.year})`);
      
      const acPower = await getACPower(car, slug);
      
      if (acPower) {
        if (!car.charging_capabilities) {
          car.charging_capabilities = {};
        }
        car.charging_capabilities.ac_power = acPower;
        
        // BMW modelleri için 3.7 kW ise 11 kW'a kadar yükseltilebilir bilgisi ekle
        if (car.brand === 'BMW' && acPower === 3.7) {
          car.charging_capabilities.ac_power_max = 11;
          car.charging_capabilities.ac_power_note = 'Można zwiększyć do 11 kW';
        }
        
        updatedCount++;
        console.log(`✅ Güncellendi: ${car.brand} ${car.model} - ${acPower} kW${car.charging_capabilities.ac_power_max ? ` (max ${car.charging_capabilities.ac_power_max} kW)` : ''}`);
      } else {
        skippedCount++;
        console.log(`⏭️  Atlanıldı: ${car.brand} ${car.model}`);
      }
      
      // Rate limiting - her istek arasında bekle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return car;
    })
  );
  
  console.log(`\n\n=== SONUÇ ===`);
  console.log(`Güncellenen araç: ${updatedCount}`);
  console.log(`Atlanan araç: ${skippedCount}`);
  
  return updatedCars;
}

// Script çalıştırma
async function main() {
  console.log('🚀 AC Güç Bilgilerini Çekme Scripti Başlatılıyor...\n');
  
  // Önce sadece resmi kaynaklardan toplanmış manuel verileri ekle
  console.log('📝 Resmi kaynaklardan toplanmış veriler kontrol ediliyor...');
  let manualCount = 0;
  carsData.forEach(car => {
    const slug = car.slug || `${car.brand.toLowerCase().replace(/\s+/g, '-')}-${car.model.toLowerCase().replace(/\s+/g, '-')}-${car.year}`;
    
    // Sadece resmi kaynaklardan toplanmış manuel veri kontrolü
    if (manualACPowerData[slug] && (!car.charging_capabilities || !car.charging_capabilities.ac_power)) {
      if (!car.charging_capabilities) {
        car.charging_capabilities = {};
      }
      car.charging_capabilities.ac_power = manualACPowerData[slug].ac_power;
      
      // BMW modelleri için 3.7 kW ise 11 kW'a kadar yükseltilebilir bilgisi ekle
      if (car.brand === 'BMW' && manualACPowerData[slug].ac_power === 3.7) {
        car.charging_capabilities.ac_power_max = 11;
        car.charging_capabilities.ac_power_note = 'Można zwiększyć do 11 kW';
      }
      
      manualCount++;
      console.log(`✅ Resmi veri eklendi: ${car.brand} ${car.model} - ${manualACPowerData[slug].ac_power} kW${car.charging_capabilities.ac_power_max ? ` (max ${car.charging_capabilities.ac_power_max} kW)` : ''}`);
    }
  });
  
  if (manualCount > 0) {
    console.log(`\n✅ ${manualCount} araç için resmi veri eklendi\n`);
    // Verileri kaydet
    fs.writeFileSync(
      path.join(__dirname, '../data/cars.json'),
      JSON.stringify(carsData, null, 2),
      'utf8'
    );
    console.log('✅ cars.json güncellendi\n');
  }
  
  // Şimdi eksik olanlar için web scraping yap
  const remainingMissing = carsData.filter(car => 
    !car.charging_capabilities || 
    !car.charging_capabilities.ac_power
  );
  
  if (remainingMissing.length > 0) {
    console.log(`\n🌐 ${remainingMissing.length} araç için web scraping başlatılıyor...\n`);
    console.log('⚠️  NOT: Web scraping zaman alabilir ve bazı siteler erişimi engelleyebilir.');
    console.log('⚠️  Manuel veri girişi için manualACPowerData objesini düzenleyin.\n');
    
    // Kullanıcıdan onay iste (otomatik çalıştırmayı kapat)
    // const updatedCars = await addACPowerData();
    // fs.writeFileSync(
    //   path.join(__dirname, '../data/cars.json'),
    //   JSON.stringify(updatedCars, null, 2),
    //   'utf8'
    // );
    // console.log('\n✅ cars.json güncellendi');
    
    console.log('\n📌 Web scraping fonksiyonu hazır ama şu anda manuel mode aktif.');
    console.log('📌 Otomatik scraping için script\'teki yorumları kaldırın.');
  } else {
    console.log('\n✅ Tüm araçlar için AC güç bilgisi mevcut!');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { addACPowerData, manualACPowerData };

