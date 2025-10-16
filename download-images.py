# ===============================
# Otomatik Gorsel Cekici v2.0 - models.txt'den
# models.txt dosyasindan tum URL'leri okur
# public/images/cars/brands/ altinda klasor olusturur
# 
# v2.0 Yenilikler:
# - 3x retry mekanizmasi
# - Background-image CSS destegi
# - 13 farkli lazy-load attribute
# - Ozel galeri/slider selektorleri
# - Anti-bot bypass teknikleri
# - Gelismis smooth scroll
# - Referer header destegi
# ===============================

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time
import os
import requests
from urllib.parse import urlparse
import re

# 1️⃣ models.txt dosyasini oku
models_file = r"C:\Users\ucturgay\OneDrive - GN Store Nord\Desktop\phevs-eu\models.txt"
print(f"[OKUMA] models.txt dosyasi okunuyor: {models_file}")

with open(models_file, 'r', encoding='utf-8') as f:
    urls = [line.strip() for line in f if line.strip() and line.strip().startswith('http')]

print(f"[BULUNDU] {len(urls)} URL bulundu\n")

# 2️⃣ Ana cikti klasoru - BRANDS altinda
base_output = r"C:\Users\ucturgay\OneDrive - GN Store Nord\Desktop\phevs-eu\public\images\cars\brands"
os.makedirs(base_output, exist_ok=True)

def get_brand_from_url(url):
    """URL'den marka adini algilar"""
    domain = urlparse(url).netloc.lower()
    
    # Domain'den marka cikart - TUM MARKALAR
    if 'audi' in domain:
        return 'audi'
    elif 'bmw' in domain:
        return 'bmw'
    elif 'byd' in domain or 'cichy-zasada' in domain:
        return 'byd'
    elif 'chery' in domain:
        return 'chery'
    elif 'citroen' in domain:
        return 'citroen'
    elif 'cupra' in domain:
        return 'cupra'
    elif 'dsautomobiles' in domain:
        return 'ds-automobiles'
    elif 'ford' in domain or 'plichta-auto' in domain:
        return 'ford'
    elif 'hyundai' in domain:
        return 'hyundai'
    elif 'jaecoo' in domain:
        return 'jaecoo'
    elif 'jeep' in domain or 'nivette' in domain:
        return 'jeep'
    elif 'kia' in domain:
        return 'kia'
    elif 'landrover' in domain:
        return 'land-rover'
    elif 'mazda' in domain:
        return 'mazda'
    elif 'mercedes' in domain or 'mercedes-benz' in domain:
        return 'mercedes-benz'
    elif 'mg' in domain or 'mgmotor' in domain or 'mgplaza' in domain:
        return 'mg'
    elif 'mini' in domain:
        return 'mini'
    elif 'mitsubishi' in domain:
        return 'mitsubishi'
    elif 'omoda' in domain:
        return 'omoda'
    elif 'opel' in domain or 'pgd.pl' in domain:
        return 'opel'
    elif 'peugeot' in domain:
        return 'peugeot'
    elif 'porsche' in domain:
        return 'porsche'
    elif 'renault' in domain:
        return 'renault'
    elif 'seat' in domain:
        return 'seat'
    elif 'skoda' in domain:
        return 'skoda'
    elif 'toyota' in domain:
        return 'toyota'
    elif 'volkswagen' in domain or 'vw.com' in domain or 'binekarac.vw' in domain:
        return 'volkswagen'
    elif 'volvo' in domain:
        return 'volvo'
    else:
        return 'other'

def get_model_from_url(url, brand):
    """URL'den model adini algilar"""
    # URL'den path'i al
    path = urlparse(url).path.lower()
    
    # Gereksiz parcalari cikart
    path = path.replace('/pl/', '').replace('/en/', '').replace('/de/', '')
    path = path.replace('all-models/', '').replace('modele/', '').replace('models/', '').replace('modeli/', '')
    path = path.replace('samochody/', '').replace('cars/', '').replace('electric/', '').replace('plug-in-hybrid/', '')
    path = path.replace('passengercars/', '').replace('passenger/', '')  # Mercedes icin
    
    # Path'i parcalara ayir
    parts = [p for p in path.split('/') if p and p not in ['pl', 'en', 'de', 'html', 'phev', 'hybrid', 'e-hybrid', 'plug-in', 'overview', 'hatchback', 'mpv', 'saloon', 'coupe', 'suv']]
    
    # Model adini bul - genelde son anlamli parca
    if len(parts) >= 1:
        # En son anlamli parcayi al (ama "overview" degilse)
        model_part = parts[-1] if parts[-1] != brand else (parts[-2] if len(parts) >= 2 else 'unknown')
        
        # Temizle
        model_part = model_part.replace('.html', '').replace('#', ' ')
        model_part = re.sub(r'[^a-z0-9-\s]', '', model_part)
        model_part = model_part.strip().replace('  ', ' ')
        
        # Marka adini model adinin icinden cikar
        model_part = model_part.replace(f'{brand}-', '').replace(f'{brand} ', '')
        
        return model_part if model_part else 'unknown-model'
    
    return 'unknown-model'

# 3️⃣ Selenium WebDriver (Chrome) başlat
print("[CHROME] Tarayici baslatiliyor...\n")
options = webdriver.ChromeOptions()
options.add_argument('--log-level=3')  # Hata mesajlarini azalt
options.add_argument('--disable-blink-features=AutomationControlled')  # Bot tespitini zorlaştır
options.add_argument('--disable-dev-shm-usage')  # Linux'ta bellek sorunlarini coz
options.add_argument('--no-sandbox')  # Sandbox devre disi (bazi sistemlerde gerekli)
options.add_experimental_option("excludeSwitches", ["enable-automation"])  # Automation bayrağını kaldır
options.add_experimental_option('useAutomationExtension', False)  # Automation extension'i devre dışı
# Guncel ve gercekci User-Agent
options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
driver = webdriver.Chrome(options=options)
driver.maximize_window()

# WebDriver'in Javascript ile tespit edilmesini engellemek icin
driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

# Istatistikler
success_count = 0
error_count = 0
error_list = []

for idx, url in enumerate(urls, 1):
    print(f"\n{'='*70}")
    print(f"[{idx}/{len(urls)}] Islem basladi")
    print(f"{'='*70}")
    print(f"URL: {url}")
    
    # Marka ve model adini URL'den al
    brand = get_brand_from_url(url)
    model = get_model_from_url(url, brand)
    
    print(f"Marka: {brand}")
    print(f"Model: {model}")
    
    # Klasor yapisi: brands/bmw/x5/
    brand_folder = os.path.join(base_output, brand)
    model_folder = os.path.join(brand_folder, model)
    
    print(f"Hedef: {model_folder}\n")
    
    # ONCE KLASOR VE GORSEL KONTROLU YAP
    if os.path.exists(model_folder):
        # Klasor varsa icindeki gorsellere bak
        existing_images = [f for f in os.listdir(model_folder) if f.endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if len(existing_images) >= 5:  # 5 veya daha fazla gorsel varsa atla
            print(f"[ATLA] Bu model icin {len(existing_images)} gorsel zaten mevcut - indirme atlaniyor")
            success_count += 1
            continue
        elif len(existing_images) > 0:
            print(f"[AZ GORSEL] Klasorde {len(existing_images)} gorsel var, eksikler tamamlanacak")
        else:
            print(f"[BOS KLASOR] Klasor mevcut ama bos, gorseller indirilecek")
    else:
        # Klasor yoksa olustur
        os.makedirs(model_folder, exist_ok=True)
        print(f"[OLUSTURULDU] Yeni klasor: {model_folder}")
        print(f"[YENI] Bu model icin gorseller ilk kez indirilecek")
    
    try:
        # Sayfayi ac - Timeout kontrolu
        try:
            driver.set_page_load_timeout(60)  # Timeout daha da arttirildi
            driver.get(url)
            print(f"[YUKLENDI] Sayfa yuklendi, JavaScript icin bekleniyor...")
            time.sleep(20)  # JavaScript'in calismasi icin DAHA uzun bekle
            
            # Cookie/GDPR popup'ini kapatmaya calis
            try:
                # Yaygın cookie butonu selector'lari
                cookie_selectors = [
                    "button[id*='accept']",
                    "button[class*='accept']",
                    "button[id*='cookie']",
                    "button[class*='cookie']",
                    "a[class*='accept']",
                    ".cookie-accept",
                    "#onetrust-accept-btn-handler",
                    ".uc-btn-accept-all"
                ]
                for selector in cookie_selectors:
                    try:
                        cookie_btn = driver.find_element(By.CSS_SELECTOR, selector)
                        cookie_btn.click()
                        print(f"[COOKIE] Cookie popup kapatildi")
                        time.sleep(1)
                        break
                    except:
                        continue
            except:
                pass
            
            # Sayfa scrollu (lazy loading icin) - COKLU TEKRAR
            print(f"[SCROLL] Sayfa scroll ediliyor (lazy load icin)...")
            try:
                # Sayfa yuksekligini al
                last_height = driver.execute_script("return document.body.scrollHeight")
                
                # Oncelikle kucuk adimlarla asagi scroll (smooth scroll)
                for i in range(8):  # 8 adim
                    scroll_position = (i + 1) * (last_height // 8)
                    driver.execute_script(f"window.scrollTo({{top: {scroll_position}, behavior: 'smooth'}});")
                    time.sleep(2)  # Her adimda 2 saniye bekle
                
                # En alta git
                driver.execute_script("window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});")
                time.sleep(4)  # Daha uzun bekle
                
                # Tekrar yukari (bazi siteler yukari scroll'da yukler)
                driver.execute_script("window.scrollTo({top: 0, behavior: 'smooth'});")
                time.sleep(3)
                
                # Bir kez daha alta (ekstra yukleme icin)
                driver.execute_script("window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});")
                time.sleep(3)
            except:
                pass
            
        except Exception as e:
            print(f"[HATA] Sayfa yuklenemedi: {str(e)[:100]}")
            error_count += 1
            error_list.append(f"{brand} {model} (Sayfa yuklenemedi)")
            continue
        
        # Sayfadaki tum img taglerini bul
        try:
            images = driver.find_elements(By.TAG_NAME, "img")
            print(f"[INFO] {len(images)} img elementi bulundu")
            
            # Ek olarak picture > source elemanlari da kontrol et (modern web)
            picture_sources = driver.find_elements(By.CSS_SELECTOR, "picture source")
            if picture_sources:
                print(f"[INFO] {len(picture_sources)} picture/source elementi bulundu")
            
            # Background image'leri de kontrol et (CSS)
            bg_elements = driver.find_elements(By.CSS_SELECTOR, "[style*='background-image'], [class*='bg-'], [class*='background']")
            if bg_elements:
                print(f"[INFO] {len(bg_elements)} background image elementi bulundu")
            
            # Ozel marka selektorleri - galeri ve slider gorselleri
            special_selectors = [
                ".gallery img", ".slider img", ".carousel img",
                "[class*='gallery'] img", "[class*='slider'] img",
                "[class*='image-gallery'] img", "[id*='gallery'] img",
                ".swiper-slide img", "[class*='swiper'] img"
            ]
            special_images = []
            for selector in special_selectors:
                try:
                    elems = driver.find_elements(By.CSS_SELECTOR, selector)
                    special_images.extend(elems)
                except:
                    pass
            
            if special_images:
                print(f"[INFO] {len(special_images)} ozel galeri/slider gorseli bulundu")
            
            print(f"[INDIRME] Gorseller indiriliyor...\n")
        except Exception as e:
            print(f"[HATA] Gorsel elemanlari bulunamadi: {str(e)[:50]}")
            error_count += 1
            error_list.append(f"{brand} {model} (Gorsel bulunamadi)")
            continue
        
        # Gorselleri indir
        downloaded = 0
        failed = 0
        skipped = 0
        
        # Tum gorsel kaynaklarini topla (img ve picture/source)
        all_image_sources = []
        
        # Tum img elementlerini birlestirelim (normal + ozel)
        all_imgs = list(images) + special_images
        
        for img in all_imgs:
            # Tum olasi gorsel attributeleri kontrol et
            src = img.get_attribute("src")
            if src:
                all_image_sources.append(src)
            
            # Lazy load attributeleri - genisletilmis liste
            for attr in ["data-src", "data-lazy-src", "data-original", "data-lazyload", 
                         "data-srcset", "data-lazy", "data-bg", "data-background", 
                         "data-image", "data-img", "data-src-retina", "data-fallback-src",
                         "data-desktop-src", "data-mobile-src", "data-source"]:
                attr_val = img.get_attribute(attr)
                if attr_val:
                    all_image_sources.append(attr_val)
        
        # picture > source srcset'leri ekle
        for source in driver.find_elements(By.CSS_SELECTOR, "picture source"):
            srcset = source.get_attribute("srcset")
            if srcset:
                # srcset'ten ilk URL'yi al
                urls = srcset.split(',')
                if urls:
                    url = urls[0].strip().split(' ')[0]
                    all_image_sources.append(url)
        
        # Background image'leri ekle
        for bg_elem in driver.find_elements(By.CSS_SELECTOR, "[style*='background-image'], [class*='bg-'], [class*='background']"):
            style = bg_elem.get_attribute("style")
            if style and 'background-image' in style:
                # CSS'ten URL'yi cikar: url('...')
                import re as regex
                matches = regex.findall(r'url\(["\']?([^"\']+)["\']?\)', style)
                for match in matches:
                    all_image_sources.append(match)
        
        print(f"[TOPLAM] {len(all_image_sources)} benzersiz gorsel kaynagi bulundu")
        
        # Benzersiz URL'leri al
        all_image_sources = list(set(all_image_sources))
        
        # Relative URL'leri absolute'a cevir
        from urllib.parse import urljoin
        cleaned_sources = []
        for src in all_image_sources:
            if src:
                # Relative URL ise absolute yap
                if not src.startswith('http'):
                    src = urljoin(url, src)
                cleaned_sources.append(src)
        
        all_image_sources = cleaned_sources
        print(f"[TEMIZ] {len(all_image_sources)} benzersiz URL hazir")
        
        for src in all_image_sources:
            # Sadece http ile baslayan ve makul boyutta gorselleri al
            # Filtre listesi genisletildi
            skip_keywords = ['icon', 'logo', 'sprite', 'pixel', 'svg', 'favicon', 
                           'thumbnail', 'thumb', 'avatar', 'badge', 'banner-small',
                           'placeholder-', 'loading.', '1x1', 'spacer',
                           'person', 'people', 'portrait', 'team', 'staff', 'employee',
                           'dealer', 'consultant', 'expert', 'advisor', 'representative',
                           'woman', 'man', 'human', 'face', 'headshot']
            
            if src and src.startswith("http") and not any(x in src.lower() for x in skip_keywords):
                try:
                    # Gelismis hata kontrolu ile gorsel indir - RETRY mekanizmasi
                    response = None
                    for retry in range(3):  # 3 deneme
                        try:
                            response = requests.get(src, timeout=15, headers={
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Referer': url  # Bazi siteler referer kontrolu yapar
                            })
                            response.raise_for_status()
                            break  # Basarili ise donguyu kir
                        except (requests.exceptions.Timeout, requests.exceptions.RequestException) as e:
                            if retry < 2:  # Son denemede degil
                                time.sleep(1)  # 1 saniye bekle ve tekrar dene
                                continue
                            else:
                                failed += 1
                                response = None
                                break
                    
                    if response is None:
                        continue
                    
                    # Boyut filtresini daha da dusurduk: 3KB (daha fazla gorsel icin)
                    content_size = len(response.content)
                    if content_size < 3000:
                        skipped += 1
                        continue
                    
                    if content_size > 3000:  # 3KB'dan buyukse
                        # Ilk gorseli "main" olarak kaydet
                        if downloaded == 0:
                            ext = 'jpg'
                            if '.png' in src.lower():
                                ext = 'png'
                            elif '.webp' in src.lower():
                                ext = 'webp'
                            elif '.jpeg' in src.lower() or '.jpg' in src.lower():
                                ext = 'jpg'
                            
                            file_path = os.path.join(model_folder, f"main.{ext}")
                            print(f"[MAIN] Ana gorsel kaydediliyor: main.{ext}")
                        else:
                            # Numara gorseller icin de format kontrolu
                            ext = 'jpg'
                            if '.png' in src.lower():
                                ext = 'png'
                            elif '.webp' in src.lower():
                                ext = 'webp'
                            file_path = os.path.join(model_folder, f"{downloaded:03}.{ext}")
                            print(f"[OK] Gorsel {downloaded} kaydedildi")
                        
                        try:
                            with open(file_path, "wb") as f:
                                f.write(response.content)
                            downloaded += 1
                            
                            # Dosya boyutunu da goster
                            size_kb = content_size / 1024
                            if downloaded % 5 == 0:  # Her 5 gorselde bir bilgi ver
                                print(f"[INFO] {downloaded} gorsel indirildi (son: {size_kb:.1f}KB)")
                        except IOError as e:
                            print(f"[HATA] Dosya yazma hatasi: {str(e)[:50]}")
                            failed += 1
                            continue
                        
                        # Maksimum 20 gorsel indir (15'ten 20'ye cikarildi)
                        if downloaded >= 20:
                            print(f"[INFO] Maksimum gorsel sayisina ulasildi (20)")
                            break
                
                except Exception as e:
                    failed += 1
                    continue
        
        # Sonuc ozeti
        if downloaded > 0:
            print(f"\n[BASARILI] {brand} {model}: {downloaded} gorsel indirildi")
            print(f"[DETAY] Kaynak: {len(all_image_sources)} | Indirilen: {downloaded} | Atlanmis: {skipped} | Basarisiz: {failed}")
            success_count += 1
        else:
            print(f"\n[UYARI] {brand} {model}: Hic gorsel indirilemedi!")
            print(f"[DETAY] Kaynak: {len(all_image_sources)} | Atlanmis: {skipped} (kucuk) | Basarisiz: {failed} (network)")
            if len(all_image_sources) == 0:
                print(f"[SORUN] Sayfada hic gorsel bulunamadi - JavaScript/Lazy load sorunu olabilir")
            error_count += 1
            error_list.append(f"{brand} {model} (Gorsel indirilemedi)")
        
        print(f"[KLASOR] {model_folder}")
    
    except Exception as e:
        print(f"[HATA] {url} islenirken beklenmeyen hata: {str(e)[:100]}")
        error_count += 1
        error_list.append(f"{brand} {model} (Beklenmeyen hata)")
    
    # Sunucuya yuk bindirmemek icin bekleme
    if idx < len(urls):
        print(f"\n[BEKLEME] Sonraki URL icin 2 saniye bekleniyor...")
        time.sleep(2)

driver.quit()
print(f"\n{'='*70}")
print("GENEL OZET")
print(f"{'='*70}")
print(f"\nToplam URL: {len(urls)}")
print(f"Basarili: {success_count}")
print(f"Hatali: {error_count}")

if error_count > 0:
    success_rate = (success_count / len(urls)) * 100
    print(f"Basari Orani: {success_rate:.1f}%")

# Hatali modeller listesi
if error_list:
    print(f"\n[HATALI MODELLER] Toplam {len(error_list)}:")
    for error in error_list:
        print(f"  - {error}")
    
    # Hata dosyasi olustur
    error_file = os.path.join(base_output, "errors.log")
    with open(error_file, "w", encoding="utf-8") as f:
        f.write("HATALI MODELLER\n")
        f.write("="*50 + "\n\n")
        for error in error_list:
            f.write(f"{error}\n")
    print(f"\n[LOG] Hata raporu kaydedildi: {error_file}")

print(f"\n{'='*70}")
print("TAMAMLANDI!")
print(f"{'='*70}")
print(f"[KLASOR] {base_output}")
print("[BILGI] Her model icin 'main' gorseli ana sayfada gosterilecek")

