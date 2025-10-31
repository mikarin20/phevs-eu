# Google Analytics Kurulum Rehberi

## 🎯 Neden Gerekli?

**Google Analytics olmadan:**
- ❌ Kaç kişi sitenizi ziyaret etti bilinmez
- ❌ Hangi sayfalar popüler bilinmez
- ❌ Nereden trafik geliyor bilinmez
- ❌ Kullanıcı davranışları analiz edilemez

**Google Analytics ile:**
- ✅ Günlük/haftalık/aylık trafik görülür
- ✅ En popüler sayfalar belirlenir
- ✅ Trafik kaynakları analiz edilir (organik, sosyal, doğrudan)
- ✅ Kullanıcı davranışları izlenir
- ✅ Conversion tracking yapılır

## 📝 Kurulum Adımları

### 1. Google Analytics Hesabı Oluşturun

1. [Google Analytics](https://analytics.google.com/) sitesine gidin
2. Hesap oluşturun (eğer yoksa)
3. "Ölçüm" > "Yönetim" > "Veri Akışı" > "Web"
4. Site adı: `PHEVs.eu`
5. URL: `https://phevs.eu`
6. **Ölçüm Kimliği** (G-XXXXXXXXXX formatında) alın

### 2. Analytics Kodunu Ekleyin

`app/layout.tsx` dosyasında şu satırları bulun:

```typescript
{/* Google Analytics 4 (GA4) */}
{/* NOT: Google Analytics ID'nizi aşağıdaki G-XXXXXXXXXX yerine ekleyin */}
```

**Aşağıdaki kodu uncomment edin ve G-XXXXXXXXXX'i kendi ID'nizle değiştirin:**

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### 3. Deploy ve Test

1. Değişiklikleri commit edin ve deploy edin
2. Google Analytics > Raporlar > Gerçek Zamanlı
3. Siteyi ziyaret edin
4. Analytics'te görünüp görünmediğini kontrol edin

## 📊 Trafik Analizi

### İlk Kontroller:

1. **Gerçek Zamanlı:** Canlı ziyaretçi sayısı
2. **Edinme:** Trafik kaynakları
   - Organik Arama (Google'dan)
   - Doğrudan (URL yazarak)
   - Sosyal Medya
   - Referral (diğer sitelerden)
3. **Davranış:** En çok ziyaret edilen sayfalar
4. **Dönüşümler:** Hedef eylemler (karşılaştırma yapma, blog okuma)

## ⚠️ Önemli Notlar

- **GDPR Uyumluluğu:** Cookie banner eklemeyi düşünün (EU için)
- **Gizlilik:** `privacy/page.tsx` dosyasında Analytics bilgisi var mı kontrol edin
- **İlk Veriler:** Analytics verileri 24-48 saat sonra görünür

## 🎯 Beklenen Sonuçlar

**Analytics'i ekledikten sonra:**
- İlk gün: 0-5 görüntüleme (kendiniz test ederseniz)
- İlk hafta: Günlük 5-20 görüntüleme (organik + doğrudan)
- İlk ay: Günlük 20-50 görüntüleme

**Eğer hiç trafik görünmüyorsa:**
1. Site yeni olabilir (normal)
2. Google henüz indekslememiş olabilir
3. Backlink yok, organik aramada görünmüyor olabilir

---

**Sonraki Adım:** Analytics'i kurduktan sonra, Google Search Console'da indekslenme durumunu kontrol edin.

