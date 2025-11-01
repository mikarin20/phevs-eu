const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Platform/varsayım bazlı eklenen modeller (resmi kaynak yok)
// Scriptteki yorumlardan: "Kuga ile aynı platform", "Captur ile benzer", "RAV4 ile aynı platform", "Golf ile aynı", "genelde kullanır"

const unverifiedModels = [];

data.forEach(car => {
  if (car.charging_capabilities?.ac_power && car.brand) {
    const slug = car.slug;
    const brand = car.brand.toLowerCase();
    
    // Kesinlikle kontrol edilmesi gerekenler:
    const needsVerification = 
      // Çin markaları - hiç resmi kaynak yok
      ['byd', 'chery', 'jaecoo', 'mg'].includes(brand) ||
      // Platform/varsayım bazlı eklenenler
      (brand === 'ford' && ['ranger', 'tourneo', 'fusion', 'c-max'].some(m => slug.includes(m))) ||
      (brand === 'renault' && slug.includes('rafale')) ||
      (brand === 'mazda' && slug.includes('mx30')) ||
      (brand === 'mini' && slug.includes('countryman')) ||
      (brand === 'suzuki' && slug.includes('across')) ||
      // Web araştırmasından bulunan ama net doğrulanmamış
      (brand === 'toyota' && ['prius', 'c-hr', 'crown'].some(m => slug.includes(m))) ||
      (brand === 'lexus') ||
      (brand === 'volvo') ||
      (brand === 'jeep') ||
      (brand === 'porsche') ||
      (brand === 'land rover') ||
      (brand === 'mitsubishi') ||
      // SEAT - VW Group platform varsayımı (ama resmi kontrol gerekli)
      (brand === 'seat' && !['leon iv', 'leon-1-4', 'leon-1-5'].some(m => slug.includes(m.toLowerCase())));
    
    if (needsVerification) {
      unverifiedModels.push({
        brand: car.brand,
        model: car.model,
        year: car.year,
        slug: slug,
        ac_power: car.charging_capabilities.ac_power,
        reason: getReason(brand, slug)
      });
    }
  }
});

function getReason(brand, slug) {
  if (['byd', 'chery', 'jaecoo', 'mg'].includes(brand.toLowerCase())) {
    return 'Çin markası - resmi kaynak bulunamadı';
  }
  if (brand.toLowerCase() === 'ford' && ['ranger', 'tourneo', 'fusion', 'c-max'].some(m => slug.includes(m))) {
    return 'Platform varsayımı (Kuga ile aynı)';
  }
  if (brand.toLowerCase() === 'renault' && slug.includes('rafale')) {
    return 'Varsayım (Captur ile benzer)';
  }
  if (brand.toLowerCase() === 'mazda' && slug.includes('mx30')) {
    return 'Genel varsayım';
  }
  if (brand.toLowerCase() === 'suzuki' && slug.includes('across')) {
    return 'Platform varsayımı (RAV4 ile aynı)';
  }
  if (brand.toLowerCase() === 'mini' && slug.includes('countryman')) {
    return 'Genel varsayım';
  }
  if (['toyota', 'lexus'].includes(brand.toLowerCase())) {
    return 'Web araştırması - resmi site doğrulaması gerekli';
  }
  if (['volvo', 'jeep', 'porsche', 'land rover', 'mitsubishi'].includes(brand.toLowerCase())) {
    return 'Web araştırması - resmi site doğrulaması gerekli';
  }
  return 'Kontrol edilmeli';
}

console.log('=== KESINLIKLE WEB SİTESİNDEN KONTROL EDİLMESİ GEREKEN MODELLER ===\n');
console.log(`Toplam: ${unverifiedModels.length} model\n`);

const byBrand = {};
unverifiedModels.forEach(m => {
  if (!byBrand[m.brand]) {
    byBrand[m.brand] = [];
  }
  byBrand[m.brand].push(m);
});

for (const brand in byBrand) {
  console.log(`\n${brand.toUpperCase()} (${byBrand[brand].length} model):`);
  byBrand[brand].forEach(m => {
    console.log(`  - ${m.model} (${m.year}) → ${m.ac_power} kW`);
    console.log(`    Slug: ${m.slug}`);
    console.log(`    Neden: ${m.reason}`);
  });
}

console.log('\n\n=== ÖNCELİK SIRASI ===\n');
console.log('1. ÇİN MARKALARI (BYD, Chery, Jaecoo, MG) - Hiç resmi kaynak yok');
console.log('2. FORD (Ranger, Tourneo, Fusion, C-Max) - Platform varsayımı');
console.log('3. TOYOTA/LEXUS - Web araştırması, resmi site doğrulaması gerekli');
console.log('4. VOLVO/JEEP/PORSCHE/LAND ROVER/MITSUBISHI - Web araştırması, resmi site doğrulaması gerekli');
console.log('5. DİĞER (Renault Rafale, Mazda, MINI, Suzuki) - Varsayım bazlı');

