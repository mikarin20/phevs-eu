const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Diğer markalarda genel model sorunlarını tespit et
function checkOtherBrands(cars) {
  const brandModels = {};
  const potentialIssues = [];
  
  // Marka bazında modelleri grupla
  cars.forEach(car => {
    if (!brandModels[car.brand]) {
      brandModels[car.brand] = new Map();
    }
    
    if (!brandModels[car.brand].has(car.model)) {
      brandModels[car.brand].set(car.model, []);
    }
    brandModels[car.brand].get(car.model).push(car);
  });
  
  // Her marka için analiz yap
  Object.keys(brandModels).forEach(brand => {
    const models = brandModels[brand];
    const modelNames = Array.from(models.keys());
    
    // Genel model tespiti
    modelNames.forEach(modelName => {
      // Eğer bir model ismi başka bir model isminin parçasıysa, genel model olabilir
      const isGeneralModel = modelNames.some(otherModel => {
        if (otherModel === modelName) return false;
        return otherModel.includes(modelName) && otherModel.length > modelName.length;
      });
      
      if (isGeneralModel) {
        const detailedModels = modelNames.filter(m => 
          m !== modelName && m.includes(modelName) && m.length > modelName.length
        );
        
        potentialIssues.push({
          brand,
          generalModel: modelName,
          detailedModels,
          count: models.get(modelName).length
        });
      }
    });
  });
  
  return potentialIssues;
}

// Analiz yap
const issues = checkOtherBrands(carsData);

console.log('\n=== DİĞER MARKALARDA TESPİT EDİLEN SORUNLAR ===');

if (issues.length === 0) {
  console.log('✅ Diğer markalarda genel model sorunu bulunamadı!');
} else {
  issues.forEach(issue => {
    console.log(`\n${issue.brand}:`);
    console.log(`  Genel model: "${issue.generalModel}" (${issue.count} adet)`);
    console.log(`  Detaylı modeller:`);
    issue.detailedModels.forEach(model => {
      console.log(`    - ${model}`);
    });
  });
}

// Marka bazında özet
console.log('\n=== MARKA BAZINDA ÖZET ===');
const brandStats = {};
carsData.forEach(car => {
  if (!brandStats[car.brand]) {
    brandStats[car.brand] = { count: 0, models: new Set() };
  }
  brandStats[car.brand].count++;
  brandStats[car.brand].models.add(car.model);
});

Object.keys(brandStats).forEach(brand => {
  const stats = brandStats[brand];
  console.log(`${brand}: ${stats.count} araç, ${stats.models.size} model`);
});

// Öneriler
console.log('\n=== ÖNERİLER ===');
if (issues.length > 0) {
  console.log('1. Yukarıdaki genel modelleri kaldırmayı düşünün');
  console.log('2. Detaylı versiyonları zaten mevcut');
  console.log('3. Genel modeller gereksiz duplikasyon yaratıyor');
} else {
  console.log('✅ Tüm markalar temiz görünüyor!');
}
