# Blog Görselleri Rehberi

## 📁 Klasör Yapısı

Blog görselleri her haber için **ayrı klasörlerde** organize edilmelidir. Her klasör adı, `blog.json` dosyasındaki `slug` değeriyle aynı olmalıdır.

```
public/
  └── images/
      └── blog/
          ├── phev-market-growth-europe-2025/
          │   ├── featured.jpg (veya .png, .webp)
          │   └── gallery/ (isteğe bağlı ek görseller)
          │       ├── 1.jpg
          │       └── 2.jpg
          ├── bmw-x5-xdrive45e-2025-review/
          │   └── featured.jpg
          ├── phev-charging-infrastructure-europe-2025/
          │   └── featured.jpg
          ├── phev-vs-bev-2025-comparison-guide/
          │   └── featured.jpg
          ├── mercedes-e-class-300-de-phev-2025-launch/
          │   └── featured.jpg
          └── phev-tax-incentives-europe-2025/
              └── featured.jpg
```

## 📋 Gerekli Görseller Listesi

Her haber için **featured.jpg** (veya .png, .webp) dosyası **zorunludur**.

### Mevcut Haberler ve Görsel Yolları

1. **Avrupa PHEV Pazarı 2025**
   - Klasör: `phev-market-growth-europe-2025/`
   - Görsel: `featured.jpg`
   - Konu: PHEV pazar büyümesi, grafik, istatistik

2. **BMW X5 xDrive45e 2025 İnceleme**
   - Klasör: `bmw-x5-xdrive45e-2025-review/`
   - Görsel: `featured.jpg`
   - Konu: BMW X5 profesyonel fotoğrafı

3. **Avrupa'da PHEV Şarj Altyapısı 2025**
   - Klasör: `phev-charging-infrastructure-europe-2025/`
   - Görsel: `featured.jpg`
   - Konu: Şarj istasyonları, harita veya grafik

4. **PHEV vs BEV 2025 Karşılaştırma Rehberi**
   - Klasör: `phev-vs-bev-2025-comparison-guide/`
   - Görsel: `featured.jpg`
   - Konu: Side-by-side görsel veya infografik

5. **Mercedes-Benz E-Class 300 de PHEV 2025**
   - Klasör: `mercedes-e-class-300-de-phev-2025-launch/`
   - Görsel: `featured.jpg`
   - Konu: Mercedes E-Class profesyonel fotoğrafı

6. **Avrupa'da PHEV Vergi Teşvikleri 2025**
   - Klasör: `phev-tax-incentives-europe-2025/`
   - Görsel: `featured.jpg`
   - Konu: İnfografik veya rehber görseli

## 📐 Görsel Özellikleri

### Featured Image (Ana Görsel)

- **Boyut:** 1200x630px (Open Graph standardı - 16:9 oranı)
- **Format:** JPG, PNG veya WebP
- **Kalite:** 80-85% (JPG için)
- **Renk Profili:** sRGB
- **Maksimum Dosya Boyutu:** 200-300 KB (optimize edilmiş)
- **Dosya Adı:** `featured.jpg` (veya `featured.png`, `featured.webp`)

### Gallery Görselleri (İsteğe Bağlı)

İçerikte kullanılmak üzere ek görseller ekleyebilirsiniz:
- Klasör: `{slug}/gallery/`
- Dosya adları: `1.jpg`, `2.jpg`, `3.jpg` veya anlamlı isimler
- Boyut: 800-1200px genişlik (yükseklik otomatik)
- Format: JPG, PNG veya WebP

## 📤 Yükleme Adımları

1. **Klasör Oluşturma:**
   - Yeni bir blog yazısı eklediğinizde, `slug` değeriyle bir klasör oluşturun
   - Örnek: `public/images/blog/yeni-haber-slug/`

2. **Featured Image Yükleme:**
   - Ana görseli `featured.jpg` adıyla klasöre koyun
   - Dosya adı tam olarak `featured.jpg` olmalıdır

3. **Gallery Görselleri (İsteğe Bağlı):**
   - Ek görseller için `gallery/` alt klasörü oluşturun
   - Görselleri bu klasöre yükleyin

4. **blog.json Güncelleme:**
   - `featured_image` path'ini güncelleyin: `/images/blog/{slug}/featured.jpg`

## 🎨 Görsel İçerik Önerileri

### Pazar ve Trend Haberleri
- Grafikler, istatistik görselleri
- Çoklu araç görüntüleri
- Trend çizelgeleri

### Araç İncelemeleri
- Profesyonel araç fotoğrafları
- İç mekan görselleri
- Detay çekimleri

### Rehberler ve Karşılaştırmalar
- İnfografikler
- Side-by-side karşılaştırmalar
- Adım adım görseller

### Altyapı ve Teknoloji
- Şarj istasyonu fotoğrafları
- Haritalar ve grafikler
- Teknoloji görselleri

## 🔧 Optimizasyon

Görselleri optimize etmek için:

### Online Araçlar
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **ImageOptim:** https://imageoptim.com/

### Komut Satırı (Sharp - Node.js)
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 85 })
  .toFile('featured.jpg');
```

### ImageMagick
```bash
convert input.jpg -resize 1200x630^ -gravity center -extent 1200x630 -quality 85 featured.jpg
```

## ✅ Kontrol Listesi

Yeni blog yazısı eklerken:

- [ ] `blog.json`'da `slug` tanımlı mı?
- [ ] `public/images/blog/{slug}/` klasörü oluşturuldu mu?
- [ ] `featured.jpg` dosyası yüklendi mi?
- [ ] Görsel boyutu 1200x630px mi?
- [ ] Dosya boyutu < 300KB mi?
- [ ] `blog.json`'da `featured_image` path'i doğru mu? (`/images/blog/{slug}/featured.jpg`)

## ⚠️ Önemli Notlar

- **Klasör adları** `blog.json`'daki `slug` değeriyle **tam olarak eşleşmelidir**
- **Dosya adı** `featured.jpg` olmalıdır (veya `.png`, `.webp`)
- Görseller bulunamazsa placeholder görsel gösterilir (`/images/placeholder-car.jpg`)
- Tüm görseller `public/` klasörü içinde olduğu için direkt URL ile erişilebilir: `https://phevs.eu/images/blog/{slug}/featured.jpg`
- WebP formatı kullanılırsa, JPG fallback'i de eklenebilir (gelecekte destek için)

## 📝 Örnek Yapı

```
public/images/blog/
├── phev-market-growth-europe-2025/
│   ├── featured.jpg
│   └── gallery/
│       ├── chart-sales-growth.jpg
│       └── market-analysis.png
├── bmw-x5-xdrive45e-2025-review/
│   ├── featured.jpg
│   └── gallery/
│       ├── exterior-front.jpg
│       ├── interior.jpg
│       └── dashboard.jpg
└── README.md
```

## 🔄 Yeni Haber Ekleme

1. `data/blog.json` dosyasına yeni haber ekleyin
2. `slug` değerini not edin
3. `public/images/blog/{slug}/` klasörünü oluşturun
4. `featured.jpg` dosyasını yükleyin
5. **Otomatik güncelleme için:** `npm run update-blog-images` komutunu çalıştırın
   - Script otomatik olarak görselleri bulup `blog.json`'ı güncelleyecektir

### Otomatik Güncelleme Script'i

Script, klasörlere görsel eklediğinizde `blog.json` dosyasını otomatik günceller:

```bash
# Tek seferlik güncelleme
npm run update-blog-images

# Watch mode (dosya değişikliklerini izler)
npm run watch-blog-images
```

**Windows için:**
```bash
scripts\update-blog-images.bat
```

**Nasıl Çalışır?**
1. Script `public/images/blog/` klasöründeki tüm klasörleri tarar
2. Her klasörde `featured.jpg`, `featured.png` veya `featured.webp` arar
3. Bulunan görselleri `blog.json`'daki `slug` değerleriyle eşleştirir
4. `featured_image` path'lerini otomatik günceller

**Watch Mode:**
- Watch mode aktifken script her 2 saniyede bir klasörleri kontrol eder
- Yeni görsel eklendiğinde otomatik olarak `blog.json` güncellenir
- Çıkmak için `Ctrl+C` basın

---

**Son Güncelleme:** 2025-01-31  
**Klasör Yapısı:** Her haber için ayrı klasör (slug bazlı)  
**Otomatik Güncelleme:** ✅ Aktif
