# AdSense Kurulum Rehberi

## ✅ Tamamlanan Adımlar

1. **AdSense Script Eklendi** - `app/layout.tsx` dosyasına AdSense script'i eklendi
2. **AdSense Component Oluşturuldu** - `components/AdSense.tsx` ile reklam gösterimi için component hazırlandı
3. **Cookie Consent Entegrasyonu** - Marketing cookie'leri için onay sistemi kuruldu
4. **Reklam Yerleşimleri** - Ana sayfaya reklam yerleşimleri eklendi

## 🔧 Yapılması Gerekenler

### 1. AdSense Panelinde Ad Unit'leri Oluşturun

AdSense panelinde aşağıdaki ad unit'leri oluşturun:

#### Banner Ad (Ana sayfa alt kısmı)
- **Ad Type**: Display
- **Ad Size**: Responsive
- **Name**: "PHEVs.eu - Main Banner"
- **Ad Slot ID**: `YOUR_BANNER_AD_SLOT_ID` yerine gerçek ID'yi koyun

#### In-Feed Ad (Araç kartları arası)
- **Ad Type**: In-feed
- **Ad Size**: Responsive  
- **Name**: "PHEVs.eu - In-Feed"
- **Ad Slot ID**: `YOUR_IN_FEED_AD_SLOT_ID` yerine gerçek ID'yi koyun

### 2. Ad Slot ID'lerini Güncelleyin

`app/page.tsx` dosyasında aşağıdaki yerleri güncelleyin:

```typescript
// Satır 1578 - Banner reklamı
adSlot="YOUR_BANNER_AD_SLOT_ID" 

// Satır 991 - In-feed reklamı  
adSlot="YOUR_IN_FEED_AD_SLOT_ID"
```

### 3. Ek Reklam Yerleşimleri (Opsiyonel)

Daha fazla reklam geliri için şu yerlere reklam ekleyebilirsiniz:

#### Model Detay Sayfası
`app/models/[id]/page.tsx` dosyasına:
```typescript
import AdSense from '@/components/AdSense'

// Sayfa içeriğinden sonra
<AdSense 
  adSlot="YOUR_MODEL_PAGE_AD_SLOT_ID" 
  adFormat="rectangle"
  className="w-full my-8"
  responsive={true}
/>
```

#### Compare Sayfası
`app/compare/page.tsx` dosyasına:
```typescript
import AdSense from '@/components/AdSense'

// Karşılaştırma tablosundan sonra
<AdSense 
  adSlot="YOUR_COMPARE_PAGE_AD_SLOT_ID" 
  adFormat="horizontal"
  className="w-full my-8"
  responsive={true}
/>
```

#### Blog Sayfası
`app/blog/page.tsx` dosyasına:
```typescript
import AdSense from '@/components/AdSense'

// Blog yazıları arasına
<AdSense 
  adSlot="YOUR_BLOG_AD_SLOT_ID" 
  adFormat="horizontal"
  className="w-full my-8"
  responsive={true}
/>
```

### 4. AdSense Onay Süreci

1. **Site İncelemesi**: Google sitenizi inceleyecek (1-7 gün)
2. **İçerik Kontrolü**: Yeterli içerik ve trafik olup olmadığını kontrol eder
3. **Politika Uyumu**: AdSense politikalarına uygunluk kontrolü
4. **Onay**: Tüm kontroller geçerse hesabınız onaylanır

### 5. Performans Optimizasyonu

#### Reklam Yerleşimi Kuralları
- ✅ Reklamlar içerikle ilgili
- ✅ Kullanıcı deneyimini bozmuyor
- ✅ Mobil uyumlu
- ✅ Sayfa yükleme hızını etkilemiyor

#### Önerilen Yerleşimler
- Ana sayfa alt kısmı (banner)
- Araç kartları arası (her 6 kartta bir)
- Model detay sayfası ortası
- Karşılaştırma sayfası alt kısmı
- Blog yazıları arası

### 6. Monitoring ve Optimizasyon

#### AdSense Panelinde İzleyin
- **Earnings**: Günlük gelir
- **Page RPM**: Sayfa başına gelir
- **CTR**: Tıklama oranı
- **Fill Rate**: Reklam doluluk oranı

#### Optimizasyon İpuçları
- Reklam yerleşimlerini A/B test edin
- Farklı ad boyutlarını deneyin
- Mobil performansı kontrol edin
- İçerik kalitesini artırın

## 🚨 Önemli Notlar

1. **AdSense Politikaları**: Tüm AdSense politikalarına uygun kalın
2. **Tıklama Yasağı**: Kendi reklamlarınıza tıklamayın
3. **İçerik Kalitesi**: Düzenli olarak yeni içerik ekleyin
4. **Trafik Artırma**: SEO ve sosyal medya ile trafik artırın
5. **Mobil Optimizasyon**: Mobil deneyimi öncelikli tutun

## 📞 Destek

AdSense ile ilgili sorularınız için:
- AdSense Yardım Merkezi
- Google AdSense Topluluğu
- info@phevs.eu

---

**Son Güncelleme**: 15 Ocak 2025
**Durum**: Kurulum tamamlandı, ad unit'ler bekleniyor
