@echo off
REM Blog Görsellerini Otomatik Güncelleme Script'i
REM Bu script, blog klasörlerindeki görselleri tarar ve blog.json'ı günceller

echo.
echo ========================================
echo   Blog Görselleri Otomatik Güncelleme
echo ========================================
echo.

REM Node.js kontrolü
node --version >nul 2>&1
if errorlevel 1 (
    echo HATA: Node.js bulunamadi!
    echo Lutfen Node.js'i yukleyin: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js bulundu.
echo.

REM Script'i çalıştır
echo Script baslatiliyor...
echo.
node scripts/update-blog-images.js

echo.
echo Script tamamlandi.
pause

