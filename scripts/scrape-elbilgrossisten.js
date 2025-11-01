const https = require('https');
const fs = require('fs');

// Elbilgrossisten sitesinden model bilgilerini çek
// Site yapısı: https://www.elbilgrossisten.no/en/products/{brand}-{model}-plug-in-hybrid

const missingModels = [
  { brand: 'Toyota', models: ['prius', 'rav4', 'c-hr', 'crown'] },
  { brand: 'Lexus', models: ['nx-450h', 'rx-450h', 'es-300h', 'ux-300e'] },
  { brand: 'Volvo', models: ['v60', 'v90', 'xc60', 'xc90'] },
  { brand: 'Land Rover', models: ['defender-110', 'discovery-sport', 'range-rover-evoque', 'range-rover-velar'] },
  { brand: 'Jeep', models: ['compass-4xe', 'wrangler-4xe', 'renegade-4xe'] },
  { brand: 'Porsche', models: ['cayenne', 'panamera', 'macan'] },
  { brand: 'Renault', models: ['rafale', 'captur-e-tech'] },
  { brand: 'Mazda', models: ['mx-30-r-ev'] },
  { brand: 'Mitsubishi', models: ['eclipse-cross', 'outlander'] },
];

function fetchPage(brand, model) {
  return new Promise((resolve, reject) => {
    const url = `https://www.elbilgrossisten.no/en/products/${brand.toLowerCase()}-${model}-plug-in-hybrid`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          resolve(null); // Sayfa bulunamadı
        }
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

function extractACPower(html) {
  // ON-BOARD CHARGER (AC) bölümünü bul
  const chargerMatch = html.match(/ON-BOARD CHARGER \(AC\)[\s\S]*?(\d+[,\.]\d+)\s*kW/);
  if (chargerMatch) {
    const power = parseFloat(chargerMatch[1].replace(',', '.'));
    return power;
  }
  return null;
}

async function scrapeAll() {
  const results = [];
  
  for (const group of missingModels) {
    console.log(`\n${group.brand} modelleri kontrol ediliyor...`);
    
    for (const model of group.models) {
      console.log(`  - ${group.brand} ${model}...`);
      const html = await fetchPage(group.brand, model);
      
      if (html) {
        const acPower = extractACPower(html);
        if (acPower) {
          results.push({
            brand: group.brand,
            model: model,
            ac_power: acPower,
            url: `https://www.elbilgrossisten.no/en/products/${group.brand.toLowerCase()}-${model}-plug-in-hybrid`
          });
          console.log(`    ✓ ${acPower} kW bulundu!`);
        } else {
          console.log(`    ✗ AC güç bilgisi bulunamadı`);
        }
      } else {
        console.log(`    ✗ Sayfa bulunamadı`);
      }
      
      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n=== SONUÇLAR ===\n');
  results.forEach(r => {
    console.log(`${r.brand} ${r.model}: ${r.ac_power} kW`);
  });
  
  fs.writeFileSync('scripts/elbilgrossisten-results.json', JSON.stringify(results, null, 2));
  console.log(`\nToplam ${results.length} model bulundu. Sonuçlar scripts/elbilgrossisten-results.json dosyasına kaydedildi.`);
}

scrapeAll().catch(console.error);

