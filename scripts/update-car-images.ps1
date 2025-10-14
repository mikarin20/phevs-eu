# Araç Fotoğraflarını Güncelleme Scripti
Write-Host "📸 Araç fotoğraflarını güncelleniyor..." -ForegroundColor Green

# Mevcut veriyi oku
$cars = Get-Content "data\cars.json" | ConvertFrom-Json

# Marka bazında fotoğraf URL'leri
$brandImages = @{
    "Peugeot" = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
    "Kia" = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
    "BMW" = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop"
    "Mercedes-Benz" = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop"
    "Audi" = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop"
    "Volkswagen" = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    "Skoda" = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
    "Renault" = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
    "Citroën" = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop"
    "Opel" = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop"
    "DS" = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop"
    "Fiat" = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    "Jeep" = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
    "Mini" = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
    "SEAT" = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop"
    "Cupra" = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop"
    "Ford" = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop"
    "Volvo" = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    "Hyundai" = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
    "Honda" = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
    "Toyota" = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop"
    "Suzuki" = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop"
    "Mazda" = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop"
    "Mitsubishi" = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    "Subaru" = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop"
    "Nissan" = "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop"
    "MG" = "https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop"
    "BYD" = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop"
    "Lynk & Co" = "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop"
    "Haval" = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
}

Write-Host "🔄 Fotoğraflar güncelleniyor..." -ForegroundColor Yellow

# Her aracı güncelle
$updatedCount = 0
foreach ($car in $cars) {
    $brand = $car.brand
    $newImage = $brandImages[$brand]
    
    if ($newImage) {
        $car.image_url = $newImage
        $updatedCount++
        Write-Host "  ✓ $($car.brand) $($car.model): Fotoğraf güncellendi" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $($car.brand) $($car.model): Marka bulunamadı" -ForegroundColor Red
    }
}

Write-Host "`n📈 Güncellenen araç sayısı: $updatedCount" -ForegroundColor Cyan

# Dosyayı kaydet
$cars | ConvertTo-Json -Depth 10 | Set-Content "data\cars.json" -Encoding UTF8

Write-Host "`n✅ Fotoğraf güncelleme tamamlandı!" -ForegroundColor Green
Write-Host "📁 data\cars.json dosyası güncellendi" -ForegroundColor Cyan