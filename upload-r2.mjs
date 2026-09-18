import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'phevs-assets';

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error('R2_ACCOUNT_ID, R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be set');
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: 'https://' + ACCOUNT_ID + '.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const targetDir = path.join(process.cwd(), 'public', 'images', 'cars', 'brands');

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

async function uploadAll() {
  const files = getFiles(targetDir);
  console.log('Toplam ' + files.length + ' dosya Cloudflare R2\'ye yukleniyor...');

  for (const file of files) {
    const relativePath = path.relative(targetDir, file).replace(/\\/g, '/');
    const r2Key = 'cars/brands/' + relativePath;
    const fileContent = fs.readFileSync(file);

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: r2Key,
          Body: fileContent,
          ContentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
        })
      );
      console.log('[BAŞARILI] -> ' + r2Key);
    } catch (err) {
      console.error('[HATA] ' + r2Key + ':', err.message);
    }
  }
  console.log('\nTüm yukleme islemi tamamlandi!');
}

uploadAll();
