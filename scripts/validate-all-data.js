const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Veri kalitesi kontrolü
function validateData(cars) {
  const issues = [];
  
  cars.forEach(car => {
    const carIssues = [];
    
    // Kritik veri eksiklikleri
    if (car.fuel_consumption === 0 || car.fuel_consumption === null || car.fuel_consumption === undefined) {
      carIssues.push('Fuel consumption eksik veya 0');
    }
    
    if (car.charge_time_ac === 0 || car.charge_time_ac === null || car.charge_time_ac === undefined) {
      carIssues.push('AC charge time eksik veya 0');
    }
    
    if (!car.engine_displacement || car.engine_displacement === 0) {
      carIssues.push('Engine displacement eksik');
    }
    
    if (car.price_eur === 0 || car.price_eur === null || car.price_eur === undefined) {
      carIssues.push('Price eksik veya 0');
    }
    
    if (car.co2_emission === 0 || car.co2_emission === null || car.co2_emission === undefined) {
      carIssues.push('CO2 emission eksik veya 0');
    }
    
    if (car.trunk_volume === 0 || car.trunk_volume === null || car.trunk_volume === undefined) {
      carIssues.push('Trunk volume eksik veya 0');
    }
    
    if (car.weight_kg === 0 || car.weight_kg === null || car.weight_kg === undefined) {
      carIssues.push('Weight eksik veya 0');
    }
    
    if (car.length_mm === 0 || car.length_mm === null || car.length_mm === undefined) {
      carIssues.push('Length eksik veya 0');
    }
    
    if (car.width_mm === 0 || car.width_mm === null || car.width_mm === undefined) {
      carIssues.push('Width eksik veya 0');
    }
    
    if (car.height_mm === 0 || car.height_mm === null || car.height_mm === undefined) {
      carIssues.push('Height eksik veya 0');
    }
    
    if (!car.battery_chemistry) {
      carIssues.push('Battery chemistry eksik');
    }
    
    if (!car.battery_voltage) {
      carIssues.push('Battery voltage eksik');
    }
    
    if (!car.charging_port) {
      carIssues.push('Charging port bilgisi eksik');
    }
    
    if (!car.emission_standard) {
      carIssues.push('Emission standard eksik');
    }
    
    if (!car.country_availability) {
      carIssues.push('Country availability eksik');
    }
    
    if (carIssues.length > 0) {
      issues.push({
        brand: car.brand,
        model: car.model,
        year: car.year,
        slug: car.slug,
        issues: carIssues
      });
    }
  });
  
  return issues;
}

// Analiz yap
console.log('\n=== VERİ KALİTESİ KONTROLÜ ===');
const dataIssues = validateData(carsData);

if (dataIssues.length === 0) {
  console.log('✅ Tüm veriler tamam!');
} else {
  console.log(`⚠️  ${dataIssues.length} araçta veri sorunu tespit edildi:\n`);
  
  // Marka bazında grupla
  const issuesByBrand = {};
  dataIssues.forEach(issue => {
    if (!issuesByBrand[issue.brand]) {
      issuesByBrand[issue.brand] = [];
    }
    issuesByBrand[issue.brand].push(issue);
  });
  
  Object.keys(issuesByBrand).forEach(brand => {
    console.log(`\n${brand} (${issuesByBrand[brand].length} araç):`);
    issuesByBrand[brand].forEach(issue => {
      console.log(`  - ${issue.model} (${issue.year}): ${issue.issues.join(', ')}`);
    });
  });
  
  // En çok sorun olan markalar
  console.log('\n=== EN ÇOK SORUN OLAN MARKALAR ===');
  const brandIssueCounts = {};
  dataIssues.forEach(issue => {
    brandIssueCounts[issue.brand] = (brandIssueCounts[issue.brand] || 0) + issue.issues.length;
  });
  
  const sortedBrands = Object.keys(brandIssueCounts)
    .sort((a, b) => brandIssueCounts[b] - brandIssueCounts[a])
    .slice(0, 5);
  
  sortedBrands.forEach(brand => {
    console.log(`${brand}: ${brandIssueCounts[brand]} sorun`);
  });
}

// Özet istatistikler
console.log('\n=== ÖZET İSTATİSTİKLER ===');
const totalCars = carsData.length;
const carsWithIssues = dataIssues.length;
const carsWithoutIssues = totalCars - carsWithIssues;

console.log(`Toplam araç: ${totalCars}`);
console.log(`Sorunsuz araç: ${carsWithoutIssues} (${((carsWithoutIssues/totalCars)*100).toFixed(1)}%)`);
console.log(`Sorunlu araç: ${carsWithIssues} (${((carsWithIssues/totalCars)*100).toFixed(1)}%)`);

// En yaygın sorunlar
console.log('\n=== EN YAYGIN SORUNLAR ===');
const allIssues = dataIssues.flatMap(issue => issue.issues);
const issueCounts = {};
allIssues.forEach(issue => {
  issueCounts[issue] = (issueCounts[issue] || 0) + 1;
});

const sortedIssues = Object.keys(issueCounts)
  .sort((a, b) => issueCounts[b] - issueCounts[a])
  .slice(0, 10);

sortedIssues.forEach(issue => {
  console.log(`${issue}: ${issueCounts[issue]} araç`);
});

// Öneriler
console.log('\n=== ÖNERİLER ===');
if (dataIssues.length > 0) {
  console.log('1. Eksik verileri tamamlayın');
  console.log('2. 0 değerlerini gerçek değerlerle değiştirin');
  console.log('3. Veri kaynaklarını kontrol edin');
  console.log('4. Otomatik veri düzeltme scriptleri oluşturun');
} else {
  console.log('✅ Tüm veriler kaliteli!');
}
