# Google Analytics Test Rehberi

## 🔍 "Veri Toplama Etkin Değil" Uyarısı

Bu uyarı normaldir. Analytics kodunun çalışıp çalışmadığını test etmek için:

## ✅ Hızlı Test (Local Dev)

### 1. Siteyi Çalıştırın
```bash
npm run dev
```

### 2. Siteyi Tarayıcıda Açın
- `http://localhost:3000` adresine gidin
- Birkaç sayfaya tıklayın (homepage, blog, FAQ)

### 3. Real-time Reports Kontrol
1. Google Analytics'e gidin: https://analytics.google.com/
2. Sol menüden: **Raporlar** > **Gerçek Zamanlı**
3. Siteyi ziyaret ettikten 30-60 saniye sonra görünmelisiniz
4. "1 aktif kullanıcı" görmelisiniz

### 4. Browser Console Kontrol
1. Tarayıcıda F12 basın (Developer Tools)
2. **Console** sekmesine gidin
3. Şu komutları çalıştırın:
   ```javascript
   // Google Analytics yüklendi mi?
   window.dataLayer
   
   // gtag fonksiyonu var mı?
   typeof gtag
   
   // ID doğru mu?
   gtag('get', 'G-KBE5R47P25', 'client_id')
   ```
4. Hata mesajı görüyorsanız, kod çalışmıyor demektir

## 🚀 Production Test (Gerçek Site)

### 1. Deploy Edin
Siteyi production'a deploy ettikten sonra:

### 2. Gerçek Siteyi Ziyaret Edin
- `https://phevs.eu` adresine gidin
- Birkaç sayfa gezdirin

### 3. Analytics Kontrol
- 24-48 saat içinde veriler görünmeye başlar
- Real-time reports anında çalışır (test için)

## 🐛 Sorun Giderme

### Kod çalışmıyor mu?

1. **Browser Console'da hata var mı?**
   - F12 > Console
   - Kırmızı hata mesajları var mı kontrol edin

2. **Script yükleniyor mu?**
   - F12 > Network sekmesi
   - `gtag/js?id=G-KBE5R47P25` isteğini bulun
   - Status 200 olmalı

3. **Ad blocker var mı?**
   - Ad blocker Analytics'i engelleyebilir
   - Gizli modda (Incognito) test edin

4. **Doğru ID kullanılıyor mu?**
   - `app/layout.tsx` dosyasında `G-KBE5R47P25` olmalı
   - İki yerde de aynı ID olmalı

## 📊 Beklenen Sonuçlar

### İlk Test (Local):
- ✅ Real-time'da 1 aktif kullanıcı görmelisiniz
- ✅ Browser console'da hata olmamalı
- ✅ Network tab'de `gtag.js` yüklü olmalı

### Production (48 saat sonra):
- ✅ Günlük/haftalık raporlar dolmaya başlar
- ✅ Trafik kaynakları görünür
- ✅ Sayfa görüntülemeleri takip edilir

## ⚠️ Önemli Notlar

1. **Local dev'de Analytics çalışır** ama gerçek veri toplama için production'da olmalı
2. **Real-time reports** test için en hızlı yöntem
3. **İlk veriler** 24-48 saat içinde görünür
4. **"Veri toplama etkin değil" uyarısı** site ziyaret edilmeden önce normaldir

## 🎯 Sonraki Adımlar

1. ✅ Kod eklendi (`app/layout.tsx`)
2. 🔄 Siteyi test edin (local)
3. 🚀 Production'a deploy edin
4. 📊 Analytics'te verileri kontrol edin (24-48 saat)

---
**Son Güncelleme:** 2025-01-31

