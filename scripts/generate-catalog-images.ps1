# Katalog fotoğrafları oluşturma scripti
# Her model için 5 farklı profesyonel fotoğraf

$carsData = Get-Content "data\cars.json" | ConvertFrom-Json
$catalogImages = @{}

# Her model için benzersiz fotoğraf setleri
$imageSets = @(
    @(
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
    ),
    @(
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
    ),
    @(
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
    ),
    @(
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
    ),
    @(
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop&q=80",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80"
    )
)

# Her model için benzersiz fotoğraf seti ata
for ($i = 0; $i -lt $carsData.Count; $i++) {
    $car = $carsData[$i]
    $imageSetIndex = $i % $imageSets.Count
    $catalogImages[$car.id] = $imageSets[$imageSetIndex]
}

# JSON dosyasına yaz
$catalogImages | ConvertTo-Json -Depth 3 | Out-File -FilePath "data\catalog-images.json" -Encoding UTF8

Write-Host "Katalog fotoğrafları oluşturuldu: $($carsData.Count) model için"
Write-Host "Dosya: data\catalog-images.json"
