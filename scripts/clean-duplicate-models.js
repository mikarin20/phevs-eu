const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// 1. İsim duplikasyonu düzeltme
function fixDuplicateNames(cars) {
  return cars.map(car => {
    // "BMW BMW" gibi duplikasyonları düzelt
    if (car.model && car.model.includes(`${car.brand} ${car.brand}`)) {
      car.model = car.model.replace(`${car.brand} ${car.brand}`, car.brand);
      console.log(`Düzeltildi: ${car.brand} ${car.model}`);
    }
    
    // Model isminde marka adı varsa kaldır
    if (car.model && car.model.startsWith(car.brand + ' ')) {
      car.model = car.model.replace(car.brand + ' ', '');
      console.log(`Marka adı kaldırıldı: ${car.brand} ${car.model}`);
    }
    
    return car;
  });
}

// 2. Geçersiz veri temizleme
function cleanInvalidData(cars) {
  return cars.filter(car => {
    // Geçersiz yıl değerlerini filtrele
    if (car.year < 2020 || car.year > 2030) {
      console.log(`Geçersiz yıl filtrelendi: ${car.brand} ${car.model} - Yıl: ${car.year}`);
      return false;
    }
    
    // Garip model isimlerini filtrele
    if (car.model && (car.model.includes('\t') || car.model.includes('US mpg') || car.model.includes('UK mpg'))) {
      console.log(`Geçersiz model ismi filtrelendi: ${car.brand} ${car.model}`);
      return false;
    }
    
    return true;
  });
}

// 3. Duplikasyon temizleme
function removeDuplicates(cars) {
  const seen = new Map();
  const cleaned = [];
  
  cars.forEach(car => {
    // Benzersiz anahtar oluştur: brand + model + year
    const key = `${car.brand}-${car.model}-${car.year}`;
    
    if (!seen.has(key)) {
      seen.set(key, true);
      cleaned.push(car);
    } else {
      console.log(`Duplikasyon kaldırıldı: ${car.brand} ${car.model} ${car.year}`);
    }
  });
  
  return cleaned;
}

// 4. Marka bazında analiz
function analyzeByBrand(cars) {
  const brandStats = {};
  
  cars.forEach(car => {
    if (!brandStats[car.brand]) {
      brandStats[car.brand] = {
        count: 0,
        models: new Set(),
        years: new Set()
      };
    }
    
    brandStats[car.brand].count++;
    brandStats[car.brand].models.add(car.model);
    brandStats[car.brand].years.add(car.year);
  });
  
  // Set'leri array'e çevir
  Object.keys(brandStats).forEach(brand => {
    brandStats[brand].models = Array.from(brandStats[brand].models);
    brandStats[brand].years = Array.from(brandStats[brand].years).sort();
  });
  
  return brandStats;
}

// Temizleme işlemlerini uygula
console.log('\n=== İsim duplikasyonu düzeltiliyor ===');
let cleanedCars = fixDuplicateNames(carsData);

console.log('\n=== Geçersiz veriler temizleniyor ===');
cleanedCars = cleanInvalidData(cleanedCars);

console.log('\n=== Duplikasyonlar kaldırılıyor ===');
cleanedCars = removeDuplicates(cleanedCars);

console.log(`\nTemizleme sonrası araç sayısı: ${cleanedCars.length}`);

// Marka bazında analiz
console.log('\n=== Marka Bazında Analiz ===');
const brandStats = analyzeByBrand(cleanedCars);

Object.keys(brandStats).forEach(brand => {
  const stats = brandStats[brand];
  console.log(`\n${brand}:`);
  console.log(`  Toplam araç: ${stats.count}`);
  console.log(`  Model sayısı: ${stats.models.length}`);
  console.log(`  Yıllar: ${stats.years.join(', ')}`);
  
  // Duplikasyon kontrolü
  const modelCounts = {};
  stats.models.forEach(model => {
    modelCounts[model] = (modelCounts[model] || 0) + 1;
  });
  
  const duplicates = Object.keys(modelCounts).filter(model => modelCounts[model] > 1);
  if (duplicates.length > 0) {
    console.log(`  ⚠️  Duplikasyon var: ${duplicates.join(', ')}`);
  }
});

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-cleaned.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanedCars, null, 2));
console.log(`\nTemizlenmiş veri kaydedildi: ${outputPath}`);

// Orijinal dosyayı yedekle ve temizlenmiş versiyonu kullan
const backupPath = path.join(__dirname, '../data/cars.json.backup');
fs.copyFileSync(path.join(__dirname, '../data/cars.json'), backupPath);
console.log(`Orijinal dosya yedeklendi: ${backupPath}`);

fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Temizlenmiş veri ana dosyaya kopyalandı');
