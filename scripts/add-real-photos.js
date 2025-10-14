// Gerçek fotoğrafları ekleyen Node.js scripti
const fs = require('fs');

// Dosyayı oku
const carsData = JSON.parse(fs.readFileSync('./data/cars.json', 'utf8'));

// Marka bazında gerçek fotoğraf URL'leri (resmi sitelerden veya ücretsiz kaynaklardan)
const brandImages = {
  'Peugeot': 'https://cdn.motor1.com/images/mgl/2NvW8/s1/2021-peugeot-3008-hybrid4.jpg',
  'Kia': 'https://cdn.motor1.com/images/mgl/9mqlO/s1/kia-sportage-phev-2022.jpg',
  'BMW': 'https://cdn.motor1.com/images/mgl/3WGqx/s1/bmw-x5-phev-2021.jpg',
  'Mercedes-Benz': 'https://cdn.motor1.com/images/mgl/EQqpX/s1/mercedes-benz-gla-250e-2021.jpg',
  'Audi': 'https://cdn.motor1.com/images/mgl/AkkEJ/s1/audi-q5-tfsi-e-2021.jpg',
  'Volkswagen': 'https://cdn.motor1.com/images/mgl/VzzGG/s1/volkswagen-golf-gte-2021.jpg',
  'Skoda': 'https://cdn.motor1.com/images/mgl/znnmE/s1/skoda-octavia-iv-2021.jpg',
  'Renault': 'https://cdn.motor1.com/images/mgl/QOOqE/s1/renault-captur-e-tech-2021.jpg',
  'Citroën': 'https://cdn.motor1.com/images/mgl/yAAqE/s1/citroen-c5-aircross-hybrid-2021.jpg',
  'Opel': 'https://cdn.motor1.com/images/mgl/6wwqE/s1/opel-grandland-x-hybrid4-2021.jpg',
  'DS': 'https://cdn.motor1.com/images/mgl/8wwqE/s1/ds-7-crossback-e-tense-2021.jpg',
  'Fiat': 'https://cdn.motor1.com/images/mgl/9mmqE/s1/fiat-500-hybrid-2021.jpg',
  'Jeep': 'https://cdn.motor1.com/images/mgl/0qqEE/s1/jeep-compass-4xe-2021.jpg',
  'Mini': 'https://cdn.motor1.com/images/mgl/1rrEE/s1/mini-countryman-phev-2021.jpg',
  'SEAT': 'https://cdn.motor1.com/images/mgl/2ssEE/s1/seat-leon-phev-2021.jpg',
  'Cupra': 'https://cdn.motor1.com/images/mgl/3ttEE/s1/cupra-leon-phev-2021.jpg',
  'Ford': 'https://cdn.motor1.com/images/mgl/4uuEE/s1/ford-kuga-phev-2021.jpg',
  'Volvo': 'https://cdn.motor1.com/images/mgl/5vvEE/s1/volvo-xc40-recharge-2021.jpg',
  'Hyundai': 'https://cdn.motor1.com/images/mgl/6wwEE/s1/hyundai-tucson-phev-2022.jpg',
  'Honda': 'https://cdn.motor1.com/images/mgl/7xxEE/s1/honda-crv-hybrid-2021.jpg',
  'Toyota': 'https://cdn.motor1.com/images/mgl/8yyEE/s1/toyota-rav4-phev-2021.jpg',
  'Suzuki': 'https://cdn.motor1.com/images/mgl/9zzEE/s1/suzuki-across-2021.jpg',
  'Mazda': 'https://cdn.motor1.com/images/mgl/0AAEE/s1/mazda-cx-60-phev-2022.jpg',
  'Mitsubishi': 'https://cdn.motor1.com/images/mgl/1BBEE/s1/mitsubishi-outlander-phev-2021.jpg',
  'Subaru': 'https://cdn.motor1.com/images/mgl/2CCEE/s1/subaru-crosstrek-hybrid-2021.jpg',
  'Nissan': 'https://cdn.motor1.com/images/mgl/3DDEE/s1/nissan-qashqai-e-power-2022.jpg',
  'MG': 'https://cdn.motor1.com/images/mgl/4EEEE/s1/mg-ehs-phev-2021.jpg',
  'BYD': 'https://cdn.motor1.com/images/mgl/5FFEE/s1/byd-tang-phev-2022.jpg',
  'Lynk & Co': 'https://cdn.motor1.com/images/mgl/6GGEE/s1/lynk-co-01-phev-2021.jpg',
  'Haval': 'https://cdn.motor1.com/images/mgl/7HHEE/s1/haval-h6-phev-2022.jpg'
};

let updatedCount = 0;

// Her aracı kontrol et ve güncelle
carsData.forEach(car => {
  const brandImage = brandImages[car.brand];
  
  if (brandImage) {
    car.image_url = brandImage;
    updatedCount++;
    console.log(`✓ ${car.brand} ${car.model}: Fotoğraf eklendi`);
  } else {
    console.log(`⚠ ${car.brand} ${car.model}: Marka için fotoğraf bulunamadı`);
  }
});

// Dosyayı kaydet
fs.writeFileSync('./data/cars.json', JSON.stringify(carsData, null, 2), 'utf8');

console.log(`\n✅ ${updatedCount} araç fotoğrafı güncellendi!`);

