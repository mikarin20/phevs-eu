# Segment Güncelleme Scripti
Write-Host "🚗 Segment sistemini güncelleniyor..." -ForegroundColor Green

# Mevcut veriyi oku
$cars = Get-Content "data\cars.json" | ConvertFrom-Json

# Segment mapping - A, B, C, D yerine anlaşılır kategoriler
$segmentMapping = @{
    "A - Mini" = "Hatchback"
    "B - Kompakt" = "Hatchback" 
    "C - Kompakt SUV" = "SUV"
    "D - Orta Segment" = "Sedan"
    "D - Orta Segment SUV" = "SUV"
    "E - Üst Segment" = "Sedan"
    "F - Lüks Segment" = "Sedan"
    "S - Spor" = "Coupe"
    "M - MPV" = "Station/Estate"
    "J - SUV" = "SUV"
}

Write-Host "📊 Mevcut segmentler:" -ForegroundColor Yellow
$currentSegments = $cars | Select-Object -ExpandProperty segment | Sort-Object -Unique
$currentSegments | ForEach-Object { Write-Host "  - $_" }

Write-Host "`n🔄 Segmentler güncelleniyor..." -ForegroundColor Yellow

# Her aracı güncelle
$updatedCount = 0
foreach ($car in $cars) {
    $oldSegment = $car.segment
    $newSegment = $segmentMapping[$oldSegment]
    
    if ($newSegment) {
        $car.segment = $newSegment
        $updatedCount++
        Write-Host "  ✓ $($car.brand) $($car.model): '$oldSegment' → '$newSegment'" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ $($car.brand) $($car.model): '$oldSegment' (mapping bulunamadı)" -ForegroundColor Red
    }
}

Write-Host "`n📈 Güncellenen araç sayısı: $updatedCount" -ForegroundColor Cyan

# Yeni segmentleri göster
Write-Host "`n🎯 Yeni segmentler:" -ForegroundColor Yellow
$newSegments = $cars | Select-Object -ExpandProperty segment | Sort-Object -Unique
$newSegments | ForEach-Object { Write-Host "  - $_" }

# Dosyayı kaydet
$cars | ConvertTo-Json -Depth 10 | Set-Content "data\cars.json" -Encoding UTF8

Write-Host "`n✅ Segment güncelleme tamamlandı!" -ForegroundColor Green
Write-Host "📁 data\cars.json dosyası güncellendi" -ForegroundColor Cyan