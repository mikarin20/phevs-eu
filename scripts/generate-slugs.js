const fs = require('fs');
const path = require('path');

// Ana cars.json dosyasını oku
const carsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/cars.json'), 'utf8'));

console.log(`Toplam araç sayısı: ${carsData.length}`);

// Slug oluşturma fonksiyonu
function generateSlug(brand, model, year) {
  // Türkçe karakterleri değiştir
  const turkishChars = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  let slug = `${brand}-${model}-${year}`;
  
  // Türkçe karakterleri değiştir
  Object.keys(turkishChars).forEach(char => {
    slug = slug.replace(new RegExp(char, 'g'), turkishChars[char]);
  });
  
  // Özel karakterleri temizle ve küçük harfe çevir
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
    .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
    .replace(/^-|-$/g, ''); // Başta ve sonda tire varsa kaldır
  
  return slug;
}

// Slug'ları oluştur ve ekle
console.log('\n=== Slug\'lar oluşturuluyor ===');
let updatedCount = 0;

const updatedCars = carsData.map(car => {
  if (!car.slug) {
    car.slug = generateSlug(car.brand, car.model, car.year);
    console.log(`Slug oluşturuldu: ${car.brand} ${car.model} -> ${car.slug}`);
    updatedCount++;
  } else {
    console.log(`Slug zaten mevcut: ${car.brand} ${car.model} -> ${car.slug}`);
  }
  return car;
});

console.log(`\nToplam ${updatedCount} slug oluşturuldu`);

// Benzersizlik kontrolü
const slugs = updatedCars.map(car => car.slug);
const uniqueSlugs = [...new Set(slugs)];

if (slugs.length !== uniqueSlugs.length) {
  console.log('\n⚠️  Duplikasyon tespit edildi!');
  
  // Duplikasyonları bul
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  const uniqueDuplicates = [...new Set(duplicates)];
  
  uniqueDuplicates.forEach(duplicateSlug => {
    const duplicateCars = updatedCars.filter(car => car.slug === duplicateSlug);
    console.log(`\nDuplikasyon: "${duplicateSlug}"`);
    duplicateCars.forEach(car => {
      console.log(`  - ${car.brand} ${car.model} (${car.year})`);
    });
    
    // Duplikasyonları çöz - ID ekle
    duplicateCars.forEach((car, index) => {
      if (index > 0) {
        car.slug = `${car.slug}-${car.id}`;
        console.log(`  Düzeltildi: ${car.slug}`);
      }
    });
  });
} else {
  console.log('\n✅ Tüm slug\'lar benzersiz!');
}

// Temizlenmiş veriyi kaydet
const outputPath = path.join(__dirname, '../data/cars-with-slugs.json');
fs.writeFileSync(outputPath, JSON.stringify(updatedCars, null, 2));
console.log(`\nSlug'lu veri kaydedildi: ${outputPath}`);

// Ana dosyayı güncelle
fs.copyFileSync(outputPath, path.join(__dirname, '../data/cars.json'));
console.log('Ana dosya güncellendi');

// Yedek oluştur
const backupPath = path.join(__dirname, '../data/cars-with-slugs-backup.json');
fs.copyFileSync(path.join(__dirname, '../data/cars-final-clean-backup.json'), backupPath);
console.log(`Yedek oluşturuldu: ${backupPath}`);

// Örnek slug'ları göster
console.log('\n=== ÖRNEK SLUG\'LAR ===');
updatedCars.slice(0, 10).forEach(car => {
  console.log(`${car.brand} ${car.model} (${car.year}) -> ${car.slug}`);
});
