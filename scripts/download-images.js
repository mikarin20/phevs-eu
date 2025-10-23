const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// Extract.pics API konfigürasyonu
const EXTRACT_PICS_API_KEY = process.env.EXTRACT_PICS_API_KEY || 'Fr5rkh7OHF0WQOx5BaDjk6irVhAdhhFld559fOyjRi';
const EXTRACT_PICS_BASE_URL = 'https://extract.pics/api/v1';

// Renkli konsol çıktıları için
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// API isteği gönderme fonksiyonu
function makeApiRequest(endpoint, data, method = 'POST') {
    return new Promise((resolve, reject) => {
        const isGet = method === 'GET';
        const postData = isGet ? null : JSON.stringify(data);
        
        const options = {
            hostname: 'extract.pics',
            port: 443,
            path: endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${EXTRACT_PICS_API_KEY}`,
                'X-API-Key': EXTRACT_PICS_API_KEY,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };
        
        if (!isGet) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(postData);
        }

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    // HTTP status kontrolü
                    if (res.statusCode !== 200) {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}\nResponse: ${responseData.substring(0, 500)}`));
                        return;
                    }
                    
                    // HTML döndüyse hata ver
                    if (responseData.trim().startsWith('<!DOCTYPE') || responseData.trim().startsWith('<html')) {
                        reject(new Error(`API HTML döndürdü, muhtemelen authentication hatası. Response: ${responseData.substring(0, 200)}...`));
                        return;
                    }
                    
                    const parsedData = JSON.parse(responseData);
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}\nResponse: ${responseData.substring(0, 500)}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (!isGet && postData) {
            req.write(postData);
        }
        req.end();
    });
}

// Resim indirme fonksiyonu
function downloadImage(url, filePath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filePath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
            
            file.on('error', (error) => {
                fs.unlink(filePath, () => {}); // Dosyayı sil
                reject(error);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

// Ana resim indirme fonksiyonu
async function downloadImagesFromUrl(url, targetFolder, maxImages = 4) {
    try {
        log(`\n${colors.cyan}🔍 URL'den resimler çıkarılıyor: ${url}${colors.reset}`, 'cyan');
        
        // Extract.pics API ile resimleri çıkar
        const extractionData = {
            url: url,
            mode: 'all', // Tüm resimleri çıkar
            max_images: maxImages,
            min_width: 300,
            min_height: 200,
            formats: ['jpg', 'jpeg', 'png', 'webp']
        };

        log('📡 API isteği gönderiliyor...', 'yellow');
        log(`🔗 Endpoint: /extractions`, 'cyan');
        log(`📊 Data: ${JSON.stringify(extractionData, null, 2)}`, 'cyan');
        
        const extractionResult = await makeApiRequest('/extractions', extractionData);
        
        if (!extractionResult.success) {
            throw new Error(`API Error: ${extractionResult.error || 'Bilinmeyen hata'}`);
        }

        const extractionId = extractionResult.id;
        log(`✅ Çıkarma işlemi başlatıldı. ID: ${extractionId}`, 'green');

        // Çıkarma işleminin tamamlanmasını bekle
        let attempts = 0;
        const maxAttempts = 30; // 5 dakika timeout
        
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 saniye bekle
            
            const statusResult = await makeApiRequest(`/extractions/${extractionId}`, {}, 'GET');
            
            if (statusResult.status === 'completed') {
                log('✅ Resim çıkarma işlemi tamamlandı!', 'green');
                break;
            } else if (statusResult.status === 'failed') {
                throw new Error(`Çıkarma işlemi başarısız: ${statusResult.error || 'Bilinmeyen hata'}`);
            }
            
            attempts++;
            log(`⏳ İşlem devam ediyor... (${attempts}/${maxAttempts})`, 'yellow');
        }

        if (attempts >= maxAttempts) {
            throw new Error('Çıkarma işlemi timeout oldu');
        }

        // İndirme linklerini al
        const downloadResult = await makeApiRequest(`/extractions/${extractionId}/downloads`, {}, 'GET');
        
        if (!downloadResult.success || !downloadResult.downloads || downloadResult.downloads.length === 0) {
            throw new Error('İndirilecek resim bulunamadı');
        }

        log(`📥 ${downloadResult.downloads.length} resim indiriliyor...`, 'blue');

        // Hedef klasörü oluştur
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }

        // Resimleri indir
        const downloadPromises = downloadResult.downloads.slice(0, maxImages).map(async (download, index) => {
            const fileName = index === 0 ? 'main.jpg' : `${String(index + 1).padStart(3, '0')}.jpg`;
            const filePath = path.join(targetFolder, fileName);
            
            try {
                await downloadImage(download.url, filePath);
                log(`✅ ${fileName} indirildi`, 'green');
                return fileName;
            } catch (error) {
                log(`❌ ${fileName} indirilemedi: ${error.message}`, 'red');
                return null;
            }
        });

        const results = await Promise.all(downloadPromises);
        const successfulDownloads = results.filter(result => result !== null);
        
        log(`\n🎉 İşlem tamamlandı! ${successfulDownloads.length}/${maxImages} resim başarıyla indirildi.`, 'green');
        log(`📁 Hedef klasör: ${targetFolder}`, 'cyan');
        
        return successfulDownloads;
        
    } catch (error) {
        log(`❌ Hata: ${error.message}`, 'red');
        throw error;
    }
}

// Kullanıcı girişi alma fonksiyonu
function getUserInput(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Ana fonksiyon
async function main() {
    try {
        log(`${colors.bright}${colors.cyan}🚗 Kia PHEV Resim İndirici${colors.reset}`, 'cyan');
        log(`${colors.cyan}Extract.pics API kullanarak resimleri indirir${colors.reset}\n`, 'cyan');

        // API key kontrolü
        if (!EXTRACT_PICS_API_KEY || EXTRACT_PICS_API_KEY === 'YOUR_API_KEY_HERE') {
            log('⚠️  API Key bulunamadı!', 'yellow');
            log('Lütfen EXTRACT_PICS_API_KEY environment variable\'ını ayarlayın veya script içindeki API key\'i güncelleyin.', 'yellow');
            return;
        }
        
        log(`✅ API Key bulundu: ${EXTRACT_PICS_API_KEY.substring(0, 10)}...`, 'green');

        // Kullanıcıdan URL al
        const url = await getUserInput('📎 İndirilecek web sitesi URL\'sini girin: ');
        
        if (!url) {
            log('❌ URL boş olamaz!', 'red');
            return;
        }

        // Hedef klasör al
        const targetFolder = await getUserInput('📁 Hedef klasör yolunu girin (örn: public/images/cars/brands/kia/model-name): ');
        
        if (!targetFolder) {
            log('❌ Hedef klasör boş olamaz!', 'red');
            return;
        }

        // Maksimum resim sayısı
        const maxImagesInput = await getUserInput('🔢 Kaç resim indirilsin? (varsayılan: 4): ');
        const maxImages = maxImagesInput ? parseInt(maxImagesInput) : 4;

        // İşlemi başlat
        await downloadImagesFromUrl(url, targetFolder, maxImages);
        
    } catch (error) {
        log(`\n💥 Kritik hata: ${error.message}`, 'red');
        process.exit(1);
    }
}

// Script çalıştırma
if (require.main === module) {
    main();
}

module.exports = { downloadImagesFromUrl };
