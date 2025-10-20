#!/usr/bin/env python3
# audi_phev_scraper.py
# Usage: python audi_phev_scraper.py
# Requires: requests, beautifulsoup4, lxml
# Output: outputs/audi_phev_data.csv

import requests
from bs4 import BeautifulSoup
import csv
import os
import time
import urllib.parse
import re
from typing import Dict, List, Optional

# Marka ID'leri (düzeltilmiş)
BRANDS = {
    "Audi": 41,
    "BMW": 86, 
    "Mercedes-Benz": 138,
    "Volkswagen": 80,  # Volvo ID'si aslında VW gösteriyor
    "Volvo": 80,       # Aynı ID
    "Peugeot": 49,     # VW ID'si aslında Peugeot gösteriyor
    "Skoda": 154,      # Yeni eklenen markalar
    "Citroen": 166,
    "MG": 153,
    "Toyota": 40,
    "Kia": 23,         # Yeni eklenen markalar
    "BYD": 116,
    "Cupra": 256
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; AudiPHEVScraper/1.0; +https://yourdomain.example)"
}

def find_phev_models(brand_name: str, brand_id: int) -> List[str]:
    """Marka sayfasından PHEV modellerini bul"""
    url = f"https://www.auto-data.net/en/results?brand={brand_id}&model=0&power1=&power2=&fuel%5B%5D=7"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        
        phev_links = []
        # PHEV modellerini bul (e-hybrid, TFSI e, plug-in)
        for link in soup.find_all("a", href=True):
            text = link.get_text().strip()
            href = link["href"]
            
            if any(keyword in text.lower() for keyword in ["e-hybrid", "tfsi e", "plug-in hybrid", "hybrid"]):
                full_url = urllib.parse.urljoin("https://www.auto-data.net", href)
                phev_links.append((text, full_url, brand_name))
        
        return phev_links
    except Exception as e:
        print(f"ERROR fetching {brand_name} models: {e}")
        return []

def extract_model_data(model_url: str) -> Dict[str, str]:
    """Model sayfasından teknik veri çek"""
    try:
        r = requests.get(model_url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        
        data = {}
        
        # Model adı
        title = soup.find("h1")
        if title:
            data["model"] = title.get_text().strip()
        
        # Teknik özellikler tablosundan veri çek
        tables = soup.find_all("table")
        for table in tables:
            rows = table.find_all("tr")
            for row in rows:
                cells = row.find_all(["td", "th"])
                if len(cells) >= 2:
                    key = cells[0].get_text().strip()
                    value = cells[1].get_text().strip()
                    
                    # Önemli alanları filtrele
                    if any(keyword in key.lower() for keyword in [
                        "price", "engine", "power", "battery", "range", "consumption", 
                        "emission", "acceleration", "top speed", "weight", "length", "width", "height",
                        "charging", "socket", "port", "plug", "connector", "type", "ac", "dc", "ccs", "chademo"
                    ]):
                        data[key] = value
        
        # Fiyat bilgisini özel olarak ara
        price_patterns = [
            r"€\s*([\d,\.]+)",
            r"EUR\s*([\d,\.]+)", 
            r"Price.*?([\d,\.]+)",
            r"Starting.*?([\d,\.]+)"
        ]
        
        page_text = soup.get_text()
        for pattern in price_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                data["price_eur"] = match.group(1).replace(",", "")
                break
        
        # Şarj port tipleri ve soket detayları için özel arama
        charging_keywords = [
            "charging port", "socket", "plug", "connector", "charging type",
            "AC charging", "DC charging", "CCS", "CHAdeMO", "Type 1", "Type 2",
            "charging time", "charging speed", "charging power", "charging location",
            "mennekes", "iec", "j1772", "combo", "fast charging", "slow charging"
        ]
        
        # Sayfa içeriğinde şarj bilgilerini ara
        page_text_lower = page_text.lower()
        for keyword in charging_keywords:
            if keyword.lower() in page_text_lower:
                # İlgili bölümü bul
                for table in tables:
                    rows = table.find_all("tr")
                    for row in rows:
                        cells = row.find_all(["td", "th"])
                        if len(cells) >= 2:
                            key = cells[0].get_text().strip()
                            if keyword.lower() in key.lower():
                                value = cells[1].get_text().strip()
                                if value:
                                    data[key] = value
        
        return data
        
    except Exception as e:
        print(f"ERROR extracting data from {model_url}: {e}")
        return {}

def main():
    """Ana fonksiyon - Tüm markaların PHEV modellerini bul ve veri çek"""
    print("Tüm markaların PHEV modelleri aranıyor...")
    
    # Çıktı klasörünü oluştur
    os.makedirs("outputs", exist_ok=True)
    
    all_data = []
    total_models = 0
    
    # Her marka için PHEV modellerini bul
    for brand_name, brand_id in BRANDS.items():
        print(f"\n{brand_name} PHEV modelleri aranıyor...")
        phev_models = find_phev_models(brand_name, brand_id)
        print(f"Bulunan {brand_name} PHEV modelleri: {len(phev_models)}")
        
        if not phev_models:
            print(f"{brand_name} için PHEV model bulunamadı!")
            continue
        
        # Her model için veri çek
        for idx, (model_name, model_url, brand) in enumerate(phev_models, 1):
            total_models += 1
            print(f"[{total_models}] {brand} - Veri çekiliyor: {model_name[:50]}...")
            
            data = extract_model_data(model_url)
            if data:
                data["url"] = model_url
                data["brand"] = brand
                all_data.append(data)
                print(f"  ✓ {len(data)} alan bulundu")
            else:
                print(f"  ✗ Veri çekilemedi")
            
            time.sleep(1.5)  # Rate limiting
    
    # CSV'ye yaz
    if all_data:
        output_file = "outputs/all_phev_data.csv"
        
        # Tüm alanları topla
        all_fields = set()
        for data in all_data:
            all_fields.update(data.keys())
        
        fieldnames = ["brand", "model", "url"] + sorted([f for f in all_fields if f not in ["brand", "model", "url"]])
        
        with open(output_file, "w", newline='', encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for data in all_data:
                writer.writerow(data)
        
        print(f"\n✓ {len(all_data)} model verisi {output_file} dosyasına yazıldı")
        print(f"✓ Toplam {len(fieldnames)} alan bulundu")
        
        # Marka bazında özet
        brand_counts = {}
        for data in all_data:
            brand = data.get("brand", "Unknown")
            brand_counts[brand] = brand_counts.get(brand, 0) + 1
        
        print("\nMarka bazında özet:")
        for brand, count in brand_counts.items():
            print(f"  {brand}: {count} model")
    else:
        print("✗ Hiç veri çekilemedi!")

if __name__ == "__main__":
    main()