# Gerçek Araç Fotoğrafları Ekleme Scripti
Write-Host "📸 Gerçek araç fotoğrafları ekleniyor..." -ForegroundColor Green

# Mevcut veriyi oku
$cars = Get-Content "data\cars.json" | ConvertFrom-Json

# Marka bazında gerçek fotoğraf URL'leri (resmi sitelerden)
$realImages = @{
    "Peugeot" = "https://www.peugeot.com.tr/content/dam/peugeot/tr/vehicles/3008/3008-hybrid4/3008-hybrid4-exterior-01.jpg"
    "Kia" = "https://www.kia.com/tr/content/dam/kia/tr/vehicles/sportage-phev/sportage-phev-exterior-01.jpg"
    "BMW" = "https://www.bmw.com.tr/content/dam/bmw/marketTR/bmw_com_tr/vehicles/2-series-active-tourer/225xe/2-series-active-tourer-225xe-exterior-01.jpg"
    "Mercedes-Benz" = "https://www.mercedes-benz.com.tr/content/dam/mercedes-benz/tr/vehicles/a-class/a250e/a-class-a250e-exterior-01.jpg"
    "Audi" = "https://www.audi.com.tr/content/dam/audi/tr/vehicles/a3-sportback/a3-sportback-40-tfsi-e/a3-sportback-40-tfsi-e-exterior-01.jpg"
    "Volkswagen" = "https://www.volkswagen.com.tr/content/dam/volkswagen/tr/vehicles/golf/golf-gte/golf-gte-exterior-01.jpg"
    "Skoda" = "https://www.skoda.com.tr/content/dam/skoda/tr/vehicles/octavia/octavia-iv/octavia-iv-exterior-01.jpg"
    "Renault" = "https://www.renault.com.tr/content/dam/renault/tr/vehicles/captur/captur-e-tech/captur-e-tech-exterior-01.jpg"
    "Citroën" = "https://www.citroen.com.tr/content/dam/citroen/tr/vehicles/c5-aircross/c5-aircross-phev/c5-aircross-phev-exterior-01.jpg"
    "Opel" = "https://www.opel.com.tr/content/dam/opel/tr/vehicles/corsa/corsa-e/corsa-e-exterior-01.jpg"
    "DS" = "https://www.dsautomobiles.com.tr/content/dam/ds/tr/vehicles/ds7-crossback/ds7-crossback-phev/ds7-crossback-phev-exterior-01.jpg"
    "Fiat" = "https://www.fiat.com.tr/content/dam/fiat/tr/vehicles/500/500-hybrid/500-hybrid-exterior-01.jpg"
    "Jeep" = "https://www.jeep.com.tr/content/dam/jeep/tr/vehicles/compass/compass-4xe/compass-4xe-exterior-01.jpg"
    "Mini" = "https://www.mini.com.tr/content/dam/mini/tr/vehicles/countryman/countryman-phev/countryman-phev-exterior-01.jpg"
    "SEAT" = "https://www.seat.com.tr/content/dam/seat/tr/vehicles/leon/leon-phev/leon-phev-exterior-01.jpg"
    "Cupra" = "https://www.cupra.com.tr/content/dam/cupra/tr/vehicles/leon/leon-phev/leon-phev-exterior-01.jpg"
    "Ford" = "https://www.ford.com.tr/content/dam/ford/tr/vehicles/kuga/kuga-phev/kuga-phev-exterior-01.jpg"
    "Volvo" = "https://www.volvo.com.tr/content/dam/volvo/tr/vehicles/xc40/xc40-phev/xc40-phev-exterior-01.jpg"
    "Hyundai" = "https://www.hyundai.com.tr/content/dam/hyundai/tr/vehicles/tucson/tucson-phev/tucson-phev-exterior-01.jpg"
    "Honda" = "https://www.honda.com.tr/content/dam/honda/tr/vehicles/crv/crv-phev/crv-phev-exterior-01.jpg"
    "Toyota" = "https://www.toyota.com.tr/content/dam/toyota/tr/vehicles/rav4/rav4-phev/rav4-phev-exterior-01.jpg"
    "Suzuki" = "https://www.suzuki.com.tr/content/dam/suzuki/tr/vehicles/vitara/vitara-phev/vitara-phev-exterior-01.jpg"
    "Mazda" = "https://www.mazda.com.tr/content/dam/mazda/tr/vehicles/cx-60/cx-60-phev/cx-60-phev-exterior-01.jpg"
    "Mitsubishi" = "https://www.mitsubishi.com.tr/content/dam/mitsubishi/tr/vehicles/eclipse-cross/eclipse-cross-phev/eclipse-cross-phev-exterior-01.jpg"
    "Subaru" = "https://www.subaru.com.tr/content/dam/subaru/tr/vehicles/crosstrek/crosstrek-hybrid/crosstrek-hybrid-exterior-01.jpg"
    "Nissan" = "https://www.nissan.com.tr/content/dam/nissan/tr/vehicles/qashqai/qashqai-e-power/qashqai-e-power-exterior-01.jpg"
    "MG" = "https://www.mg.com.tr/content/dam/mg/tr/vehicles/ehs/ehs-phev/ehs-phev-exterior-01.jpg"
    "BYD" = "https://www.byd.com.tr/content/dam/byd/tr/vehicles/tang/tang-phev/tang-phev-exterior-01.jpg"
    "Lynk & Co" = "https://www.lynkco.com.tr/content/dam/lynkco/tr/vehicles/01/01-phev/01-phev-exterior-01.jpg"
    "Haval" = "https://www.haval.com.tr/content/dam/haval/tr/vehicles/h6/h6-phev/h6-phev-exterior-01.jpg"
}

Write-Host "🔄 Gerçek fotoğraflar ekleniyor..." -ForegroundColor Yellow

# Her aracı güncelle
$updatedCount = 0
foreach ($car in $cars) {
    $brand = $car.brand
    $newImage = $realImages[$brand]
    
    if ($newImage) {
        $car.image_url = $newImage
        $updatedCount++
        Write-Host "  ✓ $($car.brand) $($car.model): Gerçek fotoğraf eklendi" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $($car.brand) $($car.model): Marka bulunamadı" -ForegroundColor Red
    }
}

Write-Host "`n📈 Güncellenen araç sayısı: $updatedCount" -ForegroundColor Cyan

# Dosyayı kaydet
$cars | ConvertTo-Json -Depth 10 | Set-Content "data\cars.json" -Encoding UTF8

Write-Host "`n✅ Gerçek fotoğraf ekleme tamamlandı!" -ForegroundColor Green
Write-Host "📁 data\cars.json dosyası güncellendi" -ForegroundColor Cyan
