# AC Güç Bilgilerini Toplama Rehberi

Bu rehber, PHEV araçların AC şarj güç bilgilerini resmi sitelerden nasıl toplayacağınızı açıklar.

## Durum

- **Toplam araç sayısı**: 141
- **AC güç bilgisi olan**: 14 (Alfa Romeo, bazı Audi ve SEAT modelleri)
- **AC güç bilgisi eksik**: 127 araç

## Nasıl Çalışır?

### 1. Kontrol Scripti
Eksik AC güç bilgilerini görmek için:
```bash
node scripts/check-missing-ac-power.js
```

### 2. Veri Ekleme Scripti
Manuel verileri eklemek için:
```bash
node scripts/fetch-ac-power-data.js
```

## Resmi Sitelerden Veri Toplama

### Marka Bazında Resmi Siteler

#### Alman Markaları

**Audi** (https://www.audi.com)
- AC güç bilgisi genelde teknik özellikler sayfasında
- Model sayfası → "Teknik Özellikler" → "Şarj" bölümü
- Örnek: A3, A5, Q5 için veriler mevcut (2.9 kW, 11 kW)

**BMW** (https://www.bmw.com)
- Model sayfası → "Özellikler" → "Elektrikli Performans" → "AC Şarj"
- Genelde: 3.7 kW veya 7.4 kW

**Mercedes-Benz** (https://www.mercedes-benz.com)
- Model sayfası → "Teknik Veriler" → "Şarj"
- Genelde: 3.7 kW, 7.4 kW veya 11 kW

**Volkswagen** (https://www.volkswagen.com)
- Model sayfası → "Teknik Özellikler" → "Şarj Özellikleri"
- Genelde: 3.6 kW veya 7.4 kW

**Škoda** (https://www.skoda.com)
- Model sayfası → "Özellikler" → "Şarj"
- Genelde: 3.6 kW veya 7.4 kW

**SEAT** (https://www.seat.com)
- Model sayfası → "Características" → "Carga"
- Bazı modeller için veriler mevcut (3.6 kW, 7.4 kW)

**CUPRA** (https://www.cupra.com)
- Model sayfası → "Özellikler" → "Şarj"

#### Fransız Markaları

**Peugeot** (https://www.peugeot.com)
- Model sayfası → "Teknik Özellikler" → "Elektrikli Performans"
- Genelde: 3.7 kW veya 7.4 kW

**Citroen** (https://www.citroen.com)
- Model sayfası → "Özellikler" → "Şarj"

**Opel** (https://www.opel.com)
- Model sayfası → "Teknik Veriler" → "Şarj"

**DS** (https://www.dsautomobiles.com)
- Model sayfası → "Özellikler" → "Şarj"

**Renault** (https://www.renault.com)
- Model sayfası → "Teknik Özellikler" → "E-TECH Şarj"

#### Kore Markaları

**Kia** (https://www.kia.com)
- Model sayfası → "Özellikler" → "Elektrikli Performans" → "AC Şarj"
- Genelde: 3.6 kW veya 7.4 kW

**Hyundai** (https://www.hyundai.com)
- Model sayfası → "Teknik Özellikler" → "Şarj"
- Genelde: 3.6 kW veya 7.4 kW

#### Diğer Markalar

**Ford** (https://www.ford.com)
- Model sayfası → "Özellikler" → "Elektrikli Performans"

**Toyota** (https://www.toyota.com)
- Model sayfası → "Teknik Özellikler" → "Şarj"

**Volvo** (https://www.volvocars.com)
- Model sayfası → "Özellikler" → "Elektrikli Performans"

**Mazda** (https://www.mazda.com)
- Model sayfası → "Teknik Özellikler" → "Şarj"

**Mitsubishi** (https://www.mitsubishi-motors.com)
- Model sayfası → "Özellikler" → "PHEV Şarj"

**Jeep** (https://www.jeep.com)
- Model sayfası → "4xe" → "Şarj Özellikleri"

**Land Rover** (https://www.landrover.com)
- Model sayfası → "PHEV" → "Şarj"

**Porsche** (https://www.porsche.com)
- Model sayfası → "E-Performance" → "Şarj"

**Lexus** (https://www.lexus.com)
- Model sayfası → "450h+" → "Şarj Özellikleri"

## Manuel Veri Ekleme

### Script'i Düzenleme

`scripts/fetch-ac-power-data.js` dosyasındaki `manualACPowerData` objesine yeni veriler ekleyin:

```javascript
const manualACPowerData = {
  'audi-a6-limousine-phev': { ac_power: 7.4 },
  'bmw-x5-50e-2024': { ac_power: 7.4 },
  // ... diğer araçlar
};
```

### Slug Nasıl Bulunur?

Araç slug'ı şu formatta:
```
{brand}-{model}-{year}
```

Örnek:
- `audi-a3-sportback-phev`
- `bmw-x5-50e-2024`
- `mercedes-benz-c-class-phev`

Slug'ı bulmak için `scripts/check-missing-ac-power.js` çalıştırın.

## Veri Doğrulama

AC güç değerleri genelde şu aralıklardadır:
- **Düşük**: 2.9 kW - 3.7 kW (ev tipi şarj)
- **Orta**: 7.4 kW (wallbox)
- **Yüksek**: 11 kW - 22 kW (üç fazlı)

## Adım Adım İşlem

1. **Eksik araçları listele**:
   ```bash
   node scripts/check-missing-ac-power.js
   ```

2. **Resmi siteye git** ve AC güç bilgisini bul

3. **Veriyi script'e ekle**:
   - `scripts/fetch-ac-power-data.js` dosyasını aç
   - `manualACPowerData` objesine ekle

4. **Script'i çalıştır**:
   ```bash
   node scripts/fetch-ac-power-data.js
   ```

5. **Doğrula**:
   - `data/cars.json` dosyasını kontrol et
   - AC güç bilgisinin eklendiğini doğrula

## Önemli Notlar

- ⚠️ **Veriler resmi sitelerden doğrulanmalıdır**
- ⚠️ **Tahmin yapmayın**, sadece resmi veriler kullanın
- ⚠️ **Farklı ülke siteleri farklı değerler gösterebilir** (TR, DE, EN)
- ⚠️ **Model yılına dikkat edin** (2024 vs 2025 farklı olabilir)

## Destek

Sorun yaşarsanız:
1. `scripts/check-missing-ac-power.js` ile durumu kontrol edin
2. `data/cars.json` dosyasını yedekleyin
3. Script'i tekrar çalıştırın

