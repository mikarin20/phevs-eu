const fs = require('fs');
const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));

const brands = {};
cars.forEach(c => {
  const b = c.brand || 'Unknown';
  if (!brands[b]) brands[b] = [];
  brands[b].push(c);
});

const report = [];

// Helper function to add finding
function addFinding(brand, model, id, year, finding, severity = 'WARNING') {
  report.push({ brand, model, id, year, finding, severity });
}

// Check BMW models
brands['BMW']?.forEach(c => {
  // Check XM models
  if (c.model && c.model.includes('XM')) {
    // BMW XM battery is 29.5 gross / 25.7 net kWh. Official WLTP range is 82-88 km (not 60 km!).
    if (c.ev_range_km === 60) {
      addFinding('BMW', c.model, c.id, c.year, `Menzil 60 km girilmiş, ancak BMW resmi WLTP verisi 82 - 88 km (Batarya 29.5 kWh brüt / 25.7 kWh net). Yakıt tüketimi 1.5 L yerine resmi WLTP 1.6 - 1.9 L/100km, CO2 36 - 43 g/km. Ayrıca AC şarj gücü 3.7 kW değil, standart 7.4 kW.`);
    }
  }
  // Check X5 50e
  if (c.model && c.model.includes('X5 50e')) {
    // X5 50e battery is 29.5 gross / 25.7 net kWh. WLTP range is 94 - 110 km (in DB it is 80 km).
    if (c.ev_range_km === 80) {
      addFinding('BMW', c.model, c.id, c.year, `Menzil 80 km girilmiş, resmi BMW WLTP menzili 94 - 110 km. Batarya 29.5 kWh brüt / 25.7 kWh net. AC şarj hızı 7.4 kW (veritabanında 3.7 kW).`);
    }
  }
  // Check X1 25e & 30e
  if (c.model && c.model.includes('X1')) {
    // X1 xDrive25e / 30e battery: 16.3 gross / 14.2 net kWh. WLTP range 78 - 92 km. AC charging 7.4 kW (DB has 3.7 kW).
    if (c.charging_capabilities && c.charging_capabilities.ac_power === 3.7) {
      addFinding('BMW', c.model, c.id, c.year, `AC şarj gücü 3.7 kW görünüyor; güncel BMW X1 PHEV modellerinde dahili şarj kapasitesi 7.4 kW'tır.`);
    }
  }
  // Check X3 30e
  if (c.model && c.model.includes('X3 30e')) {
    // New X3 30e (G45 2024/2025): Battery 22.7 gross / 19.7 net kWh. Range 81 - 90 km. DB has 90 km and 19.7 kWh. AC power is 11 kW in new G45!
    if (c.charging_capabilities && c.charging_capabilities.ac_power === 3.7) {
      addFinding('BMW', c.model, c.id, c.year, `Yeni nesil (G45) X3 30e AC şarj gücü 11 kW'tır (veritabanında 3.7 kW girilmiş).`);
    }
  }
  // Check missing id
  if (!c.id) {
    addFinding('BMW', c.model, 'YOK', c.year, `Araç objesinde 'id' alanı eksik (slug: ${c.slug}).`, 'CRITICAL');
  }
});

// Check Volkswagen
brands['Volkswagen']?.forEach(c => {
  // Passat Variant eHybrid, Golf eHybrid/GTE, Tiguan eHybrid
  if (c.model && (c.model.includes('Passat') || c.model.includes('Tiguan') || c.model.includes('Golf'))) {
    if (c.year >= 2024) {
      // 2024+ MQB evo models have 25.7 gross / 19.7 net kWh battery with 120-143 km range, 50 kW DC charging and 11 kW AC!
      // Let's see what DB has
      if (c.battery_kwh < 20) {
        addFinding('Volkswagen', c.model, c.id, c.year, `Yeni nesil 2024/2025 modellerde batarya 25.7 kWh brüt (19.7 kWh net) ve menzil 120-140 km'dir, eski nesil 13 kWh / 10.4 kWh verileri kalmış.`);
      }
    }
  }
  if (c.model && c.model.includes('Multivan')) {
    // Multivan eHybrid 2024/2025: New Multivan eHybrid 4MOTION has 19.7 kWh net battery and 1.5 TSI! Old had 13 kWh and 1.4 TSI.
    addFinding('Volkswagen', c.model, c.id, c.year, `2025 Multivan eHybrid yeni 1.5 TSI motora ve 19.7 kWh net bataryaya (95 km menzil) geçti, veritabanında eski 13 kWh / 1.4L verileri mevcut.`);
  }
});

// Check Toyota
brands['Toyota']?.forEach(c => {
  // Prius PHEV 2024/2025: Battery is 13.6 kWh, EV Range is 72-86 km (up to 86 km).
  // RAV4 PHEV: Battery 18.1 kWh, Range 75 km, Power 306 hp, 2.5L.
  // C-HR PHEV: Battery 13.6 kWh (in DB it says 18.1 kWh!).
  if (c.model && c.model.includes('C-HR')) {
    if (c.battery_kwh === 18.1) {
      addFinding('Toyota', c.model, c.id, c.year, `Toyota C-HR PHEV bataryası 13.6 kWh'dir. Veritabanında hatalı olarak 18.1 kWh (RAV4 bataryası) yazılmış. Menzil resmi WLTP 66 km.`, 'ERROR');
    }
  }
  if (c.model && c.model.includes('Crown')) {
    // Crown PHEV: In Japan/Global Crown Sport PHEV has 18.1 kWh, 90 km. Weight is missing.
    if (!c.weight_kg) {
      addFinding('Toyota', c.model, c.id, c.year, `Ağırlık (weight_kg) bilgisi eksik (boş).`);
    }
  }
});

// Check Volvo
brands['Volvo']?.forEach(c => {
  // Recharge T6 / T8: Battery 18.8 kWh gross / 14.9 kWh net.
  // Range: S60/V60 88-92 km, XC60 78-82 km, XC90 68-73 km!
  // In DB: V60 has 64 km, V90 has 64 km, XC60 has 64 km, XC90 has 64 km.
  if (c.ev_range_km === 64) {
    addFinding('Volvo', c.model, c.id, c.year, `Volvo 18.8 kWh 'Extended Range' bataryalı güncel modellerde menzil XC60 için ~78-82 km, V60/S60 için ~88-92 km, XC90 için ~71-73 km'dir. Veritabanında tüm modellere tek tip 64 km yazılmış.`);
  }
  // Weight missing for Volvo
  if (!c.weight_kg) {
    addFinding('Volvo', c.model, c.id, c.year, `Ağırlık (weight_kg) verisi eksik.`);
  }
  // XC90 power: DB has 192 hp! Real T8 is 455 hp (or T6 350 hp). 192 hp is completely wrong!
  if (c.model && c.model.includes('XC90') && c.power_hp < 300) {
    addFinding('Volvo', c.model, c.id, c.year, `Güç 192 hp olarak girilmiş! Gerçek Volvo XC90 T8 Recharge sistem gücü 455 hp (310 hp benzin + 145 hp elektrik). 192 hp tamamen hatalı.`, 'CRITICAL');
  }
});

// Check Mercedes-Benz
brands['Mercedes-Benz']?.forEach(c => {
  // C-Class / E-Class: 25.4 kWh, 100-115 km range, 55 kW DC!
  // GLC / GLE: 31.2 kWh for GLE (DB has 25.4 kWh for GLE!), GLC has 31.2 kWh battery!
  if (c.model && c.model.includes('GLE') && c.battery_kwh < 30) {
    addFinding('Mercedes-Benz', c.model, c.id, c.year, `Mercedes-Benz GLE 350 de / 400 e bataryası 31.2 kWh'dir. Veritabanında 25.4 kWh olarak kayıtlı. Menzil ~100-109 km.`, 'ERROR');
  }
  if (c.model && c.model.includes('GLC') && c.battery_kwh < 30) {
    addFinding('Mercedes-Benz', c.model, c.id, c.year, `Yeni nesil Mercedes-Benz GLC 300 e / 300 de / 400 e bataryası 31.2 kWh'dir. Veritabanında 25.4 kWh girilmiş. Menzil ~120-130 km.`, 'ERROR');
  }
  if (!c.weight_kg) {
    addFinding('Mercedes-Benz', c.model, c.id, c.year, `Ağırlık (weight_kg) bilgisi eksik.`);
  }
});

// Check Porsche
brands['Porsche']?.forEach(c => {
  // Panamera 2024+: Battery is 25.9 kWh gross / 21.8 kWh net (DB has old 17.9 kWh, 50 km range!).
  // Cayenne 2024+: Battery is 25.9 kWh gross / 21.8 kWh net (DB check).
  if (c.model && c.model.includes('Panamera') && c.battery_kwh < 20) {
    addFinding('Porsche', c.model, c.id, c.year, `2024/2025 yeni nesil Panamera E-Hybrid bataryası 25.9 kWh brüt (21.8 kWh net) ve WLTP menzili 83-93 km'dir. Veritabanında eski nesil 17.9 kWh ve 50 km menzil kalmış.`, 'ERROR');
  }
});

// Check Ford
brands['Ford']?.forEach(c => {
  // Kuga PHEV: 14.4 kWh, 66-69 km range, 2.5L Duratec, 243 hp (2024 facelift).
  // Ranger PHEV: 11.8 kWh net, ~45 km, 2.3L EcoBoost.
  // Tourneo Connect: 19.7 kWh net (VW Caddy twin!), 110 km range. DB has 13 kWh and 2.0L. Engine is 1.5L TSI!
  if (c.model && c.model.includes('Tourneo Connect')) {
    addFinding('Ford', c.model, c.id, c.year, `Tourneo Connect PHEV, VW MQB tabanlıdır; motoru 2.0L değil 1.5L EcoBoost'tur. Bataryası 19.7 kWh net ve menzili ~110 km'dir (DB'de 13 kWh ve 2.0L yazılmış).`, 'ERROR');
  }
});

// Check Kia
brands['Kia']?.forEach(c => {
  if (!c.engine_displacement) {
    addFinding('Kia', c.model, c.id, c.year, `Motor hacmi (engine_displacement) boş/tanımsız.`, 'ERROR');
  }
});

// Check Orphaned/Corrupted objects
const unknownOrphans = cars.filter(c => !c.id || !c.brand || !c.model);
unknownOrphans.forEach(c => {
  addFinding('Bilinmeyen', c.slug || 'Yok', c.id || 'Yok', c.year || 'Yok', `Tamamen eksik veya bozuk araç objesi (Brand/Model boş, SEAT Tarraco kalıntısı).`, 'CRITICAL');
});

console.log('Total specific findings discovered:', report.length);
fs.writeFileSync('detailed_audit_report.json', JSON.stringify(report, null, 2));
