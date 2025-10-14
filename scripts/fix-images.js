// Daha iyi resim URL'leri ekleyen script
const fs = require('fs');

// Dosyayı oku
const carsData = JSON.parse(fs.readFileSync('./data/cars.json', 'utf8'));

// Daha güvenilir resim URL'leri (Unsplash kullanarak)
const betterImages = {
  'Peugeot': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80',
  'Kia': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80',
  'BMW': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&q=80',
  'Mercedes-Benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&q=80',
  'Audi': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80',
  'Volkswagen': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  'Skoda': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80',
  'Renault': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80',
  'Citroën': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&q=80',
  'Opel': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&q=80',
  'DS': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80',
  'Fiat': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  'Jeep': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80',
  'Mini': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80',
  'SEAT': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&q=80',
  'Cupra': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&q=80',
  'Ford': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80',
  'Volvo': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  'Hyundai': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80',
  'Honda': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80',
  'Toyota': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&q=80',
  'Suzuki': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&q=80',
  'Mazda': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80',
  'Mitsubishi': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80',
  'Subaru': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop&q=80',
  'Nissan': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&q=80',
  'MG': 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop&q=80',
  'BYD': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop&q=80',
  'Lynk & Co': 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&q=80',
  'Haval': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&q=80'
};

let updatedCount = 0;

// Her aracı güncelle
carsData.forEach(car => {
  const brandImage = betterImages[car.brand];
  
  if (brandImage) {
    car.image_url = brandImage;
    updatedCount++;
    console.log(`✓ ${car.brand} ${car.model}: Resim güncellendi`);
  } else {
    console.log(`⚠ ${car.brand} ${car.model}: Marka için resim bulunamadı`);
  }
});

// Dosyayı kaydet
fs.writeFileSync('./data/cars.json', JSON.stringify(carsData, null, 2), 'utf8');

console.log(`\n✅ ${updatedCount} araç resmi güncellendi!`);
