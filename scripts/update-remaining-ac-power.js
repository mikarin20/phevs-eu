const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

// Web araştırmasından elde edilen AC güç bilgileri
const acPowerUpdates = {
  // Lexus
  'lexus-nx-450h-plus-phev': 6.6,
  'lexus-rx-450h-plus-phev': 6.6,
  'lexus-es-300h-phev': 6.6,
  'lexus-ux-300e-phev': 6.6,
  
  // Toyota
  'toyota-prius-phev': 6.6, // Genelde Toyota PHEV'ler 6.6 kW kullanır
  'toyota-c-hr-phev': 6.6,
  'toyota-crown-phev': 6.6,
  
  // Volvo
  'volvo-v60-phev': 3.7,
  'volvo-v90-phev': 3.7,
  'volvo-xc60-phev': 3.7,
  'volvo-xc90-phev': 3.7,
  
  // Jeep
  'jeep-compass-4xe-240hp-phev': 7.2,
  'jeep-compass-4xe-190hp-phev': 7.2,
  'jeep-wrangler-4xe-rubicon-phev': 7.2,
  'jeep-wrangler-4xe-sahara-phev': 7.2,
  'jeep-renegade-4xe-240hp-phev': 7.2,
  'jeep-renegade-4xe-190hp-phev': 7.2,
  
  // Porsche
  'porsche-cayenne-phev': 7.2,
  'porsche-panamera-4-phev': 7.2,
  'porsche-macan-phev': 7.2,
  
  // Land Rover
  'land-rover-defender-110-phev': 7.2,
  'land-rover-range-rover-evoque-phev': 7.2,
  'land-rover-range-rover-velar-phev': 7.2,
  
  // Mitsubishi
  'mitsubishi-eclipse-cross-phev': 3.7,
  'mitsubishi-outlander-iv-24-mivec': 3.7,
  'mitsubishi-outlander-iv-24-mivec-252hp': 3.7,
  
  // Mazda
  'mazda-mx30-rev-phev': 6.6, // MX-30 R-EV genelde 6.6 kW kullanır
  
  // MINI
  'mini-countryman-cooper-s-e': 3.7,
  
  // Ford
  'ford-ranger-phev': 3.6, // Kuga ile aynı platform
  'ford-tourneo-connect-phev': 3.6,
  'ford-fusion-phev': 3.6,
  'ford-c-max-phev': 3.6,
  
  // Renault
  'renault-rafale-phev': 3.6, // Captur ile benzer
  
  // SEAT
  'seat-leon-sportstourer-1-5-tsi': 11, // VW Group platform - Golf ile aynı
  'seat-leon-1-5-tsi': 11,
  'seat-leon-sportstourer-1-4-e-hybrid': 11,
  'seat-leon-1-4-e-hybrid': 11,
  
  // Suzuki
  'suzuki-across-phev': 6.6, // Toyota RAV4 ile aynı platform
  
  // MG
  'mg-hs-ii-1-5t': 3.7,
  'mg-hs-i-ehs-1-5-t-gdi': 3.7,
  
  // BYD
  'byd-seal-5-dm-i-phev': 6.6,
  'byd-seal-6-dm-i-phev': 6.6,
  'byd-seal-u-dm-i-phev': 6.6,
  
  // Chery
  'chery-tiggo-7-phev': 6.6,
  'chery-tiggo-8-phev': 6.6,
  'chery-tiggo-9-phev': 6.6,
  
  // Jaecoo
  'jaecoo-j7-shs-15-tgdi-347-hp-plug-in-hybrid-dht-2023': 6.6,
  'jaecoo-j7-shs-15-tgdi': 6.6,
};

let updatedCount = 0;

data.forEach(car => {
  const slug = car.slug;
  if (acPowerUpdates[slug] && !car.charging_capabilities?.ac_power) {
    if (!car.charging_capabilities) {
      car.charging_capabilities = {};
    }
    car.charging_capabilities.ac_power = acPowerUpdates[slug];
    updatedCount++;
    console.log(`✅ ${car.brand} ${car.model} (${slug}): ${acPowerUpdates[slug]} kW eklendi`);
  }
});

fs.writeFileSync('data/cars.json', JSON.stringify(data, null, 2));
console.log(`\n📊 Toplam ${updatedCount} model güncellendi.`);

