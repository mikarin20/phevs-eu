# PHEVs.eu — Proje Analizi ve Yeniden Aktivasyon Yol Haritası

**Analiz tarihi:** 2026-09-17
**Durum:** Site ~6 aydır (kuruluşundan beri) aktif geliştirme görmedi. Bu doküman mevcut yapıyı çıkarır ve önceliklendirilmiş bir yol haritası sunar.

---

## 1. Özet

PHEVs.eu, Avrupa'daki plug-in hibrit (PHEV) araçları karşılaştırmak için kurulmuş, Next.js tabanlı, Vercel üzerinde barındırılan çok dilli (EN/TR/DE/PL) bir karşılaştırma sitesi. Teknik SEO temeli (structured data, sitemap, hreflang) sağlam kurulmuş ve `docs/` altında Ocak 2025 tarihli, organik trafik → AdSense → ücretli reklam sıralı büyüme stratejisi belgeleri mevcut. Ancak kuruluştan bu yana içerik üretimi ve teknik bakım durmuş: bağımlılıklar eski, veri Ekim 2024/Ocak 2025'ten itibaren güncellenmemiş, kod tabanında ciddi tekrar (duplication) ve tek parça (monolithic) dosyalar var.

---

## 2. Teknoloji Yığını

| Bileşen | Sürüm | Not |
|---|---|---|
| Next.js | 14.0.0 | App Router kullanılıyor; güncel majör sürüm 15.x mevcut |
| React / React DOM | ^18.0.0 | React 19 mevcut ama Next 14 ile uyum gerektirir |
| TypeScript | ^5.0.0 | Güncel |
| Tailwind CSS | ^3.0.0 | Güncel majör (v4 mevcut, geçiş maliyetli olabilir) |
| @heroicons/react | ^2.0.0 | Aktif kullanılıyor |
| lucide-react | ^0.292.0 | Kullanım noktası doğrulanmadı — muhtemelen atıl bağımlılık |
| html2canvas | ^1.4.1 | Karşılaştırma ekran görüntüsü/paylaşım özelliği için |
| axios, cheerio, puppeteer, image-size | çeşitli | Sadece `scripts/` altındaki veri toplama/scraping araçlarında kullanılıyor, runtime uygulamasının parçası değil |
| ESLint, PostCSS, Autoprefixer | güncel majör | — |

**Build/dev scriptleri:** `dev`, `build`, `start`, `lint`, `update-blog-images`, `watch-blog-images`. Test scripti yok, CI/CD konfigürasyonu (GitHub Actions vb.) repo içinde bulunamadı — dağıtım muhtemelen doğrudan Vercel git entegrasyonu üzerinden.

---

## 3. Klasör / Route Yapısı

```
app/
  page.tsx                 → Ana sayfa: filtre, arama, karşılaştırma seçici, hero, quick-compare kartları
                              (~1500+ satır, tek 'use client' bileşeni — büyük ve monolitik)
  layout.tsx                → Kök layout, header/footer, JSON-LD, GA script yeri
  sitemap.ts                → Dinamik sitemap: statik rotalar + marka + segment + FAQ + araç + blog URL'leri
  compare/
    [cars]/                 → Dinamik karşılaştırma sayfası (id1-vs-id2 veya id1,id2 formatı destekleniyor)
    <30+ statik klasör>/     → Her biri belirli bir araç çifti için elle yazılmış, hardcoded sayfa
                              (örn. land-rover-defender-110-phev-vs-...), Türkçe metinlerle
  models/[id]/               → Araç detay sayfası + generateStaticParams (SSG)
  blog/  ,  blog/[slug]/      → Çok dilli blog listesi ve detay (veri data/blog.json'dan)
  faq/  ,  faq/[slug]/        → PHEV rehberi, lib/faq-data.ts'den içerik çekiyor
  about/, demo/, privacy/, terms/, cookies/
data/
  cars.json                 → ~90+ araç kaydı, zengin nested şema (batarya, şarj, EuroNCAP, simülatör verisi)
  blog.json                 → Blog yazıları, 4 dilde alan (title/excerpt/content + _en/_de/_pl varyantları)
lib/
  i18n.ts + locales/*.json   → EN/TR/DE/PL çeviri sözlükleri
  faq-data.ts                → FAQ içerikleri (büyük, hardcoded HTML string'ler dahil)
components/                  → RangeSimulator, ComparisonChart, FilterModal, ImageGallery, EuroNCAPStars,
                              SuggestModelForm, CompareInfoBar, vb. — çoğu `next/dynamic` ile lazy-load ediliyor
scripts/                     → ~30 Node.js yardımcı script (veri temizleme, görsel indirme, NCAP/AC-power
                              fetch, doğrulama) — build'in parçası değil, elle çalıştırılıyor
public/                      → images/, data/, robots.txt, manifest.json, ads.txt, sw.js
docs/                        → Halihazırda yazılmış Türkçe strateji notları (bkz. Bölüm 5)
outputs/                     → CSV/JSON veri dökümü (all_phev_data_merged.csv, image-report.json)
```

---

## 4. Veri Katmanı

- **`data/cars.json`**: Tek büyük JSON dosyası, veritabanı yok. Her araç kaydı opsiyonel alanlarla zenginleştirilmiş (battery_details, charging_capabilities, euroncap_rating, simulator_data) ama doldurulma oranı tutarsız — bazı araçlarda bu alanlar eksik. `updated_at` alanları çoğunlukla 2024-10 tarihli.
- **`data/blog.json`**: Yazılar dört dilde (tr taban + `_en`/`_de`/`_pl` varyantları) hardcoded string olarak tutuluyor; CMS/headless entegrasyonu yok. Son yazı tarihleri Ocak 2025.
- **i18n**: 4 dil (en, tr, de, pl) destekleniyor; ancak bazı statik `compare/<slug>` sayfalarında salt Türkçe metin hardcoded — dinamik `compare/[cars]` rotasındaki çok dilli yapı ile tutarsız.
- Merkezi bir veri kaynağı/CMS olmaması, her içerik güncellemesinin kod değişikliği + yeniden deploy gerektirdiği anlamına geliyor.

---

## 5. SEO / Analytics Mevcut Durumu

Güçlü temel zaten kurulmuş:
- JSON-LD structured data: `WebSite` + `ItemList`/`Vehicle` (ana sayfa), `Product` (statik compare sayfaları), `Article` (blog), `FAQPage` (faq), `Guide` (faq ana sayfa).
- Her sayfada `canonical` + 4 dil için `hreflang` alternates.
- `app/sitemap.ts`: cars.json ve blog.json'dan dinamik olarak marka, segment, FAQ, araç ve blog rotalarını üretiyor.
- `docs/` altında zaten mevcut olan stratejik notlar (Ocak 2025 tarihli):
  - **PRE-ADSENSE-STRATEGY.md**: "önce organik trafik, 3 ay sonra AdSense, 6 ay sonra ücretli reklam" planı — **bugün itibarıyla tam olarak 6+ ay geçmiş durumda**, planın bir sonraki fazına (reklam / gelir optimizasyonu) geçiş değerlendirmesi gerekiyor.
  - **GOOGLE-ANALYTICS-SETUP.md** / **ANALYTICS-TEST.md**: GA4 kurulum adımları ve test talimatı — GA'nın halen canlı veri topladığı doğrulanmalı.
  - **TRAFFIC-ANALYSIS.md**: Beklenen trafik eğrisi (ay 1: 5-20/gün → ay 6-12: 200-1000+/gün) — gerçek Search Console/GA verisiyle kıyaslanmalı.
  - **GEO-TARGETING-OPTIMIZATION.md**, **SEO-BLOG-IMAGES.md**, **SITEMAP-FIX.md**, **GOOGLE-ADS-REKLAM-METINLERI.md**: Ülke hedefleme, görsel SEO ve reklam metni taslakları hazır ama muhtemelen hiç uygulanmadı/test edilmedi.

Bu notlar, sitenin "büyüme fazı" planlandığı ama 6 aydır **uygulanmadığı** görülüyor — analiz + eylem arasında büyük bir boşluk var.

---

## 6. Tespit Edilen Teknik Borç ve Riskler

1. **Statik karşılaştırma sayfası tekrarı** — `app/compare/` altında dinamik `[cars]` rotasının yanı sıra ~30 elle yazılmış, neredeyse birebir aynı yapıya sahip statik sayfa var. Her yeni karşılaştırma için manuel dosya oluşturma gerekiyor; bakım yükü yüksek ve `[cars]` rotasıyla işlevsel çakışma var.
2. **Monolitik `app/page.tsx`** — Tek 'use client' bileşeninde filtreleme, arama, karşılaştırma, tema, dil, favori state'leri bir arada; okunabilirlik ve test edilebilirlik düşük.
3. **Dil tutarsızlığı** — Bazı statik sayfalarda salt Türkçe metin var, dinamik sayfalarda 4 dilli yapı var.
4. **Eski bağımlılıklar** — Next.js 14 / React 18, güncel majör sürümlerin gerisinde; güvenlik yaması ve performans iyileştirmeleri kaçırılıyor olabilir.
5. **Test ve CI eksikliği** — Otomatik test, lint/build kontrolü yapan CI pipeline'ı bulunamadı; regresyonlar ancak prod'da fark ediliyor.
6. **İçerik bayatlığı** — Araç fiyat/spec verileri ~Ekim 2024, blog yazıları Ocak 2025'te donmuş; 6 aylık PHEV pazarındaki değişiklikleri (yeni modeller, güncel fiyatlar) yansıtmıyor.
7. **`/demo` sayfası** — Tema/palet deneme sayfası, üretim ortamında herkese açık bir rota olarak duruyor; muhtemelen dev artığı.
8. **Kullanılmayan bağımlılık şüphesi** — `lucide-react` ile `@heroicons/react` aynı anda mevcut; ikisinin de kullanım oranı doğrulanmalı.
9. **Stratejinin uygulanmamış olması** — `docs/` içindeki hazır planlar (GA doğrulama, geo-targeting, reklam metinleri) hiç aksiyona dönüşmemiş görünüyor.

---

## 7. Önceliklendirilmiş Yol Haritası

### A. Kısa vade — İçerik/SEO Canlanması (1-4 hafta)
1. Google Analytics'in halen veri topladığını doğrula (Search Console + GA4 gerçek zamanlı rapor).
2. `docs/PRE-ADSENSE-STRATEGY.md` planındaki 6 aylık hedeflerle gerçek trafik/gelir verisini kıyasla; bir sonraki faza (AdSense optimizasyonu veya ücretli reklam) geçiş kararı ver.
3. `data/cars.json`'daki fiyat/spec verilerini güncelle, yeni 2025/2026 PHEV modellerini ekle.
4. Blog içeriğine yeni yazılar ekle (haftada 1-2), mevcut yazıların `updated_at` alanlarını gözden geçir.
5. Sitemap'i Search Console'a yeniden gönder, indekslenme durumunu kontrol et.

### B. Orta vade — Teknik/Performans Yükseltme (1-2 ay)
1. Next.js ve React'i güncel majör sürüme taşımayı değerlendir (breaking change analizi ile).
2. Statik `compare/<slug>` sayfalarını kaldırıp tamamen `compare/[cars]` + `generateStaticParams` ile veri odaklı hale getir — tekrarı ortadan kaldırır.
3. `app/page.tsx`'i state/bölüm bazlı alt bileşenlere ayır (filtre paneli, hero, kart listesi, header ayrı dosyalar).
4. Temel bir CI pipeline'ı ekle (lint + build kontrolü, PR başına).
5. Kullanılmayan bağımlılıkları (`lucide-react` vb.) doğrulayıp kaldır.
6. `/demo` rotasını üretimden kaldır veya noindex + auth arkasına al.

### C. Uzun vade — Büyüme/Özellik (bu tur kapsamı dışında, referans amaçlı)
- Veri katmanını statik JSON'dan hafif bir CMS/headless çözüme taşımak.
- Otomatik test kapsamı eklemek (özellikle karşılaştırma mantığı ve i18n çeviri anahtarları için).
- Geo-targeting ve reklam metni planlarını (`docs/GEO-TARGETING-OPTIMIZATION.md`, `docs/GOOGLE-ADS-REKLAM-METINLERI.md`) canlıya almak.

---

## 8. Bu Hafta Yapılacaklar (öneri)

- [ ] GA4 gerçek zamanlı veri kontrolü
- [ ] Search Console indeksleme durumu kontrolü
- [ ] `cars.json` içinde en az 5-10 güncel olmayan fiyat/spec kaydını güncelle
- [ ] 1 yeni blog yazısı yayınla
- [ ] `package.json` bağımlılıklarının güncel sürümlerle farkını çıkar (`npm outdated`)

---

*Bu belge yalnızca analiz ve öneri amaçlıdır; bu tur kapsamında kod veya veri değişikliği yapılmamıştır.*
