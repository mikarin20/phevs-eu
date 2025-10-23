@echo off
echo.
echo ========================================
echo    Kia PHEV Resim Indirici
echo ========================================
echo.

REM API Key kontrolü
if "%EXTRACT_PICS_API_KEY%"=="" (
    echo UYARI: EXTRACT_PICS_API_KEY environment variable bulunamadi!
    echo Lutfen API key'i ayarlayin:
    echo set EXTRACT_PICS_API_KEY=your_api_key_here
    echo.
    pause
    exit /b 1
)

echo API Key bulundu: %EXTRACT_PICS_API_KEY:~0,10%...
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
node download-images.js

echo.
echo Script tamamlandi.
pause
