# PHEV Sitesi için JSON dosyalarını oluşturan script
# C:\Users\ucturgay\OneDrive - GN Store Nord\Desktop\phevs-eu

Write-Host "PHEV Sitesi JSON dosyaları oluşturuluyor..." -ForegroundColor Green

# data klasörünü oluştur
$dataPath = "data"
if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath
    Write-Host "data klasörü oluşturuldu" -ForegroundColor Yellow
}

# cars.json dosyasını oluştur
$carsJson = @'
[
  {
    "id": "1",
    "brand": "BMW",
    "model": "X5 xDrive45e",
    "year": 2025,
    "ev_range_km": 87,
    "fuel_consumption": 2.1,
    "battery_kwh": 24,
    "price_eur": 78900,
    "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"
  },
  {
    "id": "2",
    "brand": "Mercedes-Benz",
    "model": "GLE 350e",
    "year": 2025,
    "ev_range_km": 103,
    "fuel_consumption": 1.8,
    "battery_kwh": 31.2,
    "price_eur": 72900,
    "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
  },
  {
    "id": "3",
    "brand": "Audi",
    "model": "Q7 55 TFSI e",
    "year": 2025,
    "ev_range_km": 56,
    "fuel_consumption": 2.4,
    "battery_kwh": 17.9,
    "price_eur": 68900,
    "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
  },
  {
    "id": "4",
    "brand": "Volvo",
    "model": "XC60 Recharge",
    "year": 2025,
    "ev_range_km": 64,
    "fuel_consumption": 1.9,
    "battery_kwh": 18.8,
    "price_eur": 62900,
    "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
  },
  {
    "id": "5",
    "brand": "Kia",
    "model": "Niro PHEV",
    "year": 2025,
    "ev_range_km": 65,
    "fuel_consumption": 1.5,
    "battery_kwh": 13.8,
    "price_eur": 42000,
    "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"
  },
  {
    "id": "6",
    "brand": "Hyundai",
    "model": "Tucson PHEV",
    "year": 2025,
    "ev_range_km": 58,
    "fuel_consumption": 1.7,
    "battery_kwh": 13.8,
    "price_eur": 38900,
    "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
  },
  {
    "id": "7",
    "brand": "Toyota",
    "model": "RAV4 Prime",
    "year": 2025,
    "ev_range_km": 75,
    "fuel_consumption": 1.2,
    "battery_kwh": 18.1,
    "price_eur": 45900,
    "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
  },
  {
    "id": "8",
    "brand": "Mitsubishi",
    "model": "Outlander PHEV",
    "year": 2025,
    "ev_range_km": 54,
    "fuel_consumption": 1.8,
    "battery_kwh": 20,
    "price_eur": 39900,
    "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400"
  },
  {
    "id": "9",
    "brand": "Peugeot",
    "model": "3008 Hybrid4",
    "year": 2025,
    "ev_range_km": 59,
    "fuel_consumption": 1.6,
    "battery_kwh": 13.2,
    "price_eur": 42900,
    "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
  },
  {
    "id": "10",
    "brand": "Volkswagen",
    "model": "Tiguan eHybrid",
    "year": 2025,
    "ev_range_km": 55,
    "fuel_consumption": 1.9,
    "battery_kwh": 13,
    "price_eur": 44900,
    "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
  }
]
'@

$carsJson | Out-File -FilePath "$dataPath\cars.json" -Encoding UTF8
Write-Host "cars.json dosyası oluşturuldu" -ForegroundColor Green

# app klasörünü oluştur
$appPath = "app"
if (!(Test-Path $appPath)) {
    New-Item -ItemType Directory -Path $appPath
    Write-Host "app klasörü oluşturuldu" -ForegroundColor Yellow
}

# components klasörünü oluştur
$componentsPath = "components"
if (!(Test-Path $componentsPath)) {
    New-Item -ItemType Directory -Path $componentsPath
    Write-Host "components klasörü oluşturuldu" -ForegroundColor Yellow
}

# public klasörünü oluştur
$publicPath = "public"
if (!(Test-Path $publicPath)) {
    New-Item -ItemType Directory -Path $publicPath
    Write-Host "public klasörü oluşturuldu" -ForegroundColor Yellow
}

Write-Host "Tüm JSON dosyaları ve klasörler oluşturuldu!" -ForegroundColor Green
Write-Host "Şimdi GitHub Desktop'da commit yapabilirsiniz." -ForegroundColor Cyan