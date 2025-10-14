// Tüm segmentleri düzelten Node.js scripti
const fs = require('fs');

// Dosyayı oku
const carsData = JSON.parse(fs.readFileSync('./data/cars.json', 'utf8'));

// Segment mapping
const segmentMap = {
  'A - Mini': 'Hatchback',
  'A - Kompakt': 'Hatchback',
  'A - Kompakt Hatchback': 'Hatchback',
  'A - Kompakt MPV': 'Station/Estate',
  'A - Kompakt SUV': 'SUV',
  'A - Kompakt Coupe': 'Coupe',
  'B - Kompakt': 'Hatchback',
  'B - Kompakt SUV': 'SUV',
  'C - Kompakt SUV': 'SUV',
  'C - Orta Segment Hatchback': 'Hatchback',
  'C - Orta Segment Sedan': 'Sedan',
  'D - Orta Segment': 'Sedan',
  'D - Orta Segment Sedan': 'Sedan',
  'D - Orta Segment SUV': 'SUV',
  'D - Orta Segment Estate': 'Station/Estate',
  'D - Premium Sedan': 'Sedan',
  'D - Premium SUV': 'SUV',
  'D - Premium Estate': 'Station/Estate',
  'D - Premium Fastback': 'Sedan',
  'E - Executive Sedan': 'Sedan',
  'E - Executive SUV': 'SUV',
  'E - Executive Estate': 'Station/Estate',
  'E - Premium SUV': 'SUV',
  'F - Luxury Sedan': 'Sedan',
  'F - Luxury SUV': 'SUV',
  'F - Performance Coupe': 'Coupe',
  'S - Sports Car': 'Coupe',
  'M - MPV': 'Station/Estate',
  'J - SUV': 'SUV',
  'Van - Ticari Araç': 'Station/Estate'
};

let updatedCount = 0;

// Her aracı kontrol et ve güncelle
carsData.forEach(car => {
  if (segmentMap[car.segment]) {
    console.log(`✓ ${car.brand} ${car.model}: '${car.segment}' → '${segmentMap[car.segment]}'`);
    car.segment = segmentMap[car.segment];
    updatedCount++;
  }
});

// Dosyayı kaydet
fs.writeFileSync('./data/cars.json', JSON.stringify(carsData, null, 2), 'utf8');

console.log(`\n✅ ${updatedCount} araç güncellendi!`);

// Benzersiz segmentleri göster
const uniqueSegments = [...new Set(carsData.map(car => car.segment))].sort();
console.log('\n🎯 Güncel segmentler:');
uniqueSegments.forEach(seg => console.log(`  - ${seg}`));

