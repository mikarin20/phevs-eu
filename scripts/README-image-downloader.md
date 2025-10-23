# Kia PHEV Resim İndirici

Bu script, Extract.pics API'sini kullanarak web sitelerinden otomatik olarak resim indirir.

## Kurulum

1. **Extract.pics API Key alın:**
   - [Extract.pics](https://extract.pics) sitesine gidin
   - Hesap oluşturun ve API key alın

2. **API Key'i ayarlayın:**
   ```bash
   # Environment variable olarak
   set EXTRACT_PICS_API_KEY=your_api_key_here
   
   # Veya script içindeki API key'i güncelleyin
   ```

## Kullanım

```bash
node scripts/download-images.js
```

Script sizden şunları isteyecek:
1. **URL**: İndirilecek web sitesi URL'si
2. **Hedef Klasör**: Resimlerin kaydedileceği klasör yolu
3. **Resim Sayısı**: Kaç resim indirileceği (varsayılan: 4)

## Örnek Kullanım

```bash
# Kia Niro için resim indirme
node scripts/download-images.js

# Sorular:
# URL: https://www.kia.com/tr/modeller/niro.html
# Hedef klasör: public/images/cars/brands/kia/niro-i-2019
# Resim sayısı: 4
```

## Özellikler

- ✅ Otomatik resim çıkarma
- ✅ Yüksek kaliteli resim filtreleme (min 300x200)
- ✅ JPG, PNG, WebP format desteği
- ✅ Otomatik dosya adlandırma (main.jpg, 002.jpg, vb.)
- ✅ Hata yönetimi ve ilerleme takibi
- ✅ Renkli konsol çıktıları

## Dosya Yapısı

İndirilen resimler şu şekilde adlandırılır:
```
target-folder/
├── main.jpg      # Ana resim
├── 002.jpg       # İkinci resim
├── 003.jpg       # Üçüncü resim
└── 004.jpg       # Dördüncü resim
```

## API Limitleri

- Extract.pics API'sinin kendi limitleri geçerlidir
- Ücretsiz plan limitleri için [dokümantasyonu](https://extract.pics/docs/api/quickstart) kontrol edin

## Hata Durumları

Script şu durumları yönetir:
- ❌ Geçersiz URL
- ❌ API key hatası
- ❌ Ağ bağlantı sorunları
- ❌ Dosya yazma hataları
- ❌ Timeout durumları

## Desteklenen Siteler

Extract.pics API'si çoğu web sitesini destekler:
- Kia resmi web sitesi
- Otomotiv haber siteleri
- Bayi web siteleri
- Ve daha fazlası...

## Notlar

- İlk resim her zaman `main.jpg` olarak adlandırılır
- Diğer resimler `002.jpg`, `003.jpg` şeklinde numaralandırılır
- Hedef klasör otomatik olarak oluşturulur
- Mevcut dosyalar üzerine yazılır
