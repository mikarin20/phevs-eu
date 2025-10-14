# =============================
# EV Database Görsel İndirici
# extract.pics API ile
# =============================

# ⚙️ API Key'inizi buraya yazın:
$ApiKey = "sk_live_ABC123"

# 📂 Çıktı klasörü
$BaseFolder = "images"
if (-not (Test-Path $BaseFolder)) { New-Item -ItemType Directory -Path $BaseFolder | Out-Null }

# 📄 Link listesi
$LinksFile = "models.txt"
if (-not (Test-Path $LinksFile)) {
    Write-Host "models.txt bulunamadı! Her satıra bir EV Database linki ekleyin."
    exit
}

# 🕐 Bekleme süresi
$WaitSeconds = 2

# =============================

function Get-SafeFolderName($url) {
    $uri = [uri]$url
    $name = ($uri.Segments[-1]).TrimEnd('/')
    if (-not $name) { $name = "unknown" }
    return ($name -replace '[^a-zA-Z0-9_-]', '_')
}

function Invoke-ExtractPics($url, $apikey) {
    Write-Host "`n🔍 Sayfa işleniyor: $url"
    $headers = @{
        Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$apikey:"))
    }

    try {
        $response = Invoke-RestMethod -Uri "https://extract.pics/api/v1/extract" `
                                      -Method Post `
                                      -Headers $headers `
                                      -Body @{ url = $url } `
                                      -TimeoutSec 60
        $images = @()
        if ($response.images) {
            $images = $response.images | ForEach-Object { $_.url }
        }
        Write-Host "📸 $($images.Count) görsel bulundu."
        return $images
    }
    catch {
        Write-Warning "⚠️ Hata: $($_.Exception.Message)"
        return @()
    }
}

function Download-Image($url, $folder) {
    try {
        $filename = Split-Path $url -Leaf
        $savePath = Join-Path $folder $filename

        if (Test-Path $savePath) {
            Write-Host "  ⏩ Atlaniyor (var): $filename"
            return
        }

        Invoke-WebRequest -Uri $url -OutFile $savePath -UseBasicParsing -TimeoutSec 30
        Write-Host "  ✅ $filename"
    }
    catch {
        Write-Warning "  ⚠️ İndirilemedi: $url"
    }
}

# =============================
# Ana işlem döngüsü
# =============================

$Links = Get-Content $LinksFile | Where-Object { $_ -and $_ -notmatch "^#" }

Write-Host "`n🔧 $($Links.Count) link işlenecek...`n"

foreach ($link in $Links) {
    $folderName = Get-SafeFolderName $link
    $modelFolder = Join-Path $BaseFolder $folderName
    if (-not (Test-Path $modelFolder)) { New-Item -ItemType Directory -Path $modelFolder | Out-Null }

    $imageUrls = Invoke-ExtractPics -url $link -apikey $ApiKey

    foreach ($img in $imageUrls) {
        Download-Image -url $img -folder $modelFolder
        Start-Sleep -Milliseconds 400
    }

    Write-Host "🏁 Tamamlandı: $folderName`n"
    Start-Sleep -Seconds $WaitSeconds
}

Write-Host "`n✅ Tüm işlemler bitti! Görseller 'images' klasöründe.`n"
