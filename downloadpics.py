# ===============================
# Audi modellerinden görsel çekici
# Her URL için ayrı klasör oluşturur
# ===============================

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time
import os
import requests

# 1️⃣ Link listesi
urls = [
    "https://www.audi.pl/pl/modele/q8/q8-tfsi-e/",
    "https://www.audi.pl/pl/modele/q7/q7-tfsi-e/",
    "https://www.audi.pl/pl/modele/q5/q5-e-hybrid/",
    "https://www.audi.pl/pl/modele/a8/a8-tfsi-e/",
    "https://www.audi.pl/pl/modele/a6/a6-limousine-e-hybrid/",
    "https://www.audi.pl/pl/modele/a5/a5-limousine-e-hybrid/",
    "https://www.audi.pl/pl/modele/a3/a3-sportback-tfsi-e/"
]

# 2️⃣ Çıktı klasörü
base_output = r"C:\Users\ucturgay\OneDrive - GN Store Nord\Desktop\phevs-eu\ImagesTest"
os.makedirs(base_output, exist_ok=True)

# 3️⃣ Selenium WebDriver (Chrome) başlat
driver = webdriver.Chrome()  # ChromeDriver yüklü olmalı ve PATH'te olmalı

for url in urls:
    driver.get(url)
    time.sleep(3)  # sayfanın yüklenmesini bekle

    # 4️⃣ Sayfadaki tüm img taglerini bul
    images = driver.find_elements(By.TAG_NAME, "img")

    # Klasör ismi (URL’den sade isim)
    folder_name = url.rstrip("/").split("/")[-2]
    output_dir = os.path.join(base_output, folder_name)
    os.makedirs(output_dir, exist_ok=True)

    print(f"🔍 {url} için görseller alınıyor...")

    # 5️⃣ Görselleri indir
    i = 1
    for img in images:
        src = img.get_attribute("src")
        if src and src.startswith("http"):
            try:
                r = requests.get(src)
                file_path = os.path.join(output_dir, f"{i:03}.jpg")
                with open(file_path, "wb") as f:
                    f.write(r.content)
                print(f"✅ İndirildi: {i:03}.jpg")
                i += 1
            except Exception as e:
                print(f"❌ Hata: {src} -> {e}")

driver.quit()
print(f"\n🎯 Tamamlandı. Görseller {base_output} dizininde.")
