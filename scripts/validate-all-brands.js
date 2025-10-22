const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Marka bazında analiz ve sorun tespiti
function analyzeBrands(cars) {
  const brandStats = {};
  const issues = [];
  
  cars.forEach(car => {
    if (!brandStats[car.brand]) {
      brandStats[car.brand] = {
        count: 0,
        models: new Map(),
        years: new Set()
      };
    }
    
    brandStats[car.brand].count++;
    brandStats[car.brand].years.add(car.year);
    
    // Model bazında analiz
    if (!brandStats[car.brand].models.has(car.model)) {
      brandStats[car.brand].models.set(car.model, []);
    }
    brandStats[car.brand].models.get(car.model).push(car);
  });
  
  // Sorun tespiti
  Object.keys(brandStats).forEach(brand => {
    const stats = brandStats[brand];
    
    // 1. İsim duplikasyonu kontrolü
    stats.models.forEach((models, modelName) => {
      if (modelName.includes(`${brand} ${brand}`)) {
        issues.push({
          type: 'duplicate_name',
          brand,
          model: modelName,
          message: `İsim duplikasyonu: "${modelName}"`
        });
      }
      
      if (modelName.startsWith(brand + ' ')) {
        issues.push({
          type: 'brand_in_model',
          brand,
          model: modelName,
          message: `Model isminde marka adı: "${modelName}"`
        });
      }
    });
    
    // 2. Aynı modelin farklı yılları kontrolü
    stats.models.forEach((models, modelName) => {
      if (models.length > 1) {
        const years = models.map(m => m.year).sort();
        const uniqueYears = [...new Set(years)];
        
        if (uniqueYears.length > 1) {
          issues.push({
            type: 'multiple_years',
            brand,
            model: modelName,
            years: uniqueYears,
            message: `Aynı model farklı yıllarda: ${modelName} (${uniqueYears.join(', ')})`
          });
        }
      }
    });
    
    // 3. Geçersiz veri kontrolü
    stats.models.forEach((models, modelName) => {
      models.forEach(model => {
        if (model.year < 2020 || model.year > 2030) {
          issues.push({
            type: 'invalid_year',
            brand,
            model: modelName,
            year: model.year,
            message: `Geçersiz yıl: ${modelName} - ${model.year}`
          });
        }
        
        if (model.model && (model.model.includes('\t') || model.model.includes('US mpg'))) {
          issues.push({
            type: 'invalid_model_name',
            brand,
            model: modelName,
            message: `Geçersiz model ismi: "${modelName}"`
          });
        }
      });
    });
  });
  
  return { brandStats, issues };
}

// Analiz yap
const { brandStats, issues } = analyzeBrands(carsData);

// Sonuçları göster
console.log('\n=== MARKA BAZINDA ÖZET ===');
Object.keys(brandStats).forEach(brand => {
  const stats = brandStats[brand];
  console.log(`\n${brand}:`);
  console.log(`  Toplam araç: ${stats.count}`);
  console.log(`  Model sayısı: ${stats.models.size}`);
  console.log(`  Yıllar: ${Array.from(stats.years).sort().join(', ')}`);
});

// Sorunları göster
console.log('\n=== TESPİT EDİLEN SORUNLAR ===');
if (issues.length === 0) {
  console.log('✅ Hiç sorun bulunamadı!');
} else {
  const issueTypes = {};
  issues.forEach(issue => {
    if (!issueTypes[issue.type]) {
      issueTypes[issue.type] = [];
    }
    issueTypes[issue.type].push(issue);
  });
  
  Object.keys(issueTypes).forEach(type => {
    console.log(`\n${type.toUpperCase()} (${issueTypes[type].length} adet):`);
    issueTypes[type].forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
  });
}

// Öneriler
console.log('\n=== ÖNERİLER ===');
if (issues.length > 0) {
  console.log('1. clean-duplicate-models.js scriptini çalıştırın');
  console.log('2. Manuel kontrol yapın');
  console.log('3. Veri kaynaklarını gözden geçirin');
} else {
  console.log('✅ Tüm veriler temiz görünüyor!');
}

// Marka bazında detaylı rapor
console.log('\n=== MARKA BAZINDA DETAY ===');
Object.keys(brandStats).forEach(brand => {
  const stats = brandStats[brand];
  console.log(`\n${brand} (${stats.count} araç):`);
  
  stats.models.forEach((models, modelName) => {
    const years = models.map(m => m.year).sort();
    const uniqueYears = [...new Set(years)];
    
    if (uniqueYears.length > 1) {
      console.log(`  ⚠️  ${modelName}: ${uniqueYears.join(', ')} (${models.length} versiyon)`);
    } else {
      console.log(`  ✅ ${modelName}: ${uniqueYears[0]} (${models.length} versiyon)`);
    }
  });
});
