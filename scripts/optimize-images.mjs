import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = env.R2_BUCKET_NAME || 'phevs-assets';

async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// 1. Optimize local files in public/
async function optimizeLocalImages() {
  console.log('--- Optimizing local public/ images ---');
  const localTargets = [
    'public/images/blog/mercedes-e-class-300-de-phev-2025-launch/Original-49014-mercedes-e53-amg-saloon-0002.jpg',
    'public/images/og-image-new.png',
    'public/symbol.png',
    'public/images/og-image.jpg',
    'public/images/blog/phev-vs-bev-2025-comparison-guide/phev.jpg',
    'public/images/blog/autolobby-ladezwang-phev-2025/featured.jpg',
    'public/images/blog/byd-sealion-6-2025-review/featured.jpg',
    'public/images/blog/toyota-c-hr-phev-turkiye-uretim-2025/featured.jpg',
    'public/images/blog/bmw-x5-xdrive45e-2025-review/018.jpg',
  ];

  for (const relPath of localTargets) {
    const fullPath = path.join(process.cwd(), relPath);
    if (!fs.existsSync(fullPath)) continue;
    const initialSize = fs.statSync(fullPath).size;
    if (initialSize < 100 * 1024) continue; // already small

    const inputBuffer = fs.readFileSync(fullPath);
    let optimizedBuffer;
    const isPng = relPath.endsWith('.png');

    if (isPng) {
      optimizedBuffer = await sharp(inputBuffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .png({ compressionLevel: 9, quality: 85 })
        .toBuffer();
    } else {
      optimizedBuffer = await sharp(inputBuffer)
        .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();
    }

    if (optimizedBuffer.length < initialSize) {
      fs.writeFileSync(fullPath, optimizedBuffer);
      console.log(`[LOCAL] ${relPath}: ${(initialSize / 1024).toFixed(0)}KB -> ${(optimizedBuffer.length / 1024).toFixed(0)}KB`);
    }
  }
}

// 2. Optimize R2 images > 300KB, especially main images
async function optimizeR2Images() {
  console.log('\n--- Scanning R2 objects for large images ---');
  let continuationToken = null;
  const largeFiles = [];

  do {
    const res = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      ContinuationToken: continuationToken,
    }));
    for (const obj of res.Contents || []) {
      // Prioritize all main.* files > 200KB, and any image > 400KB
      const isMain = obj.Key.includes('main.');
      const threshold = isMain ? 200 * 1024 : 400 * 1024;
      if (obj.Size > threshold) {
        largeFiles.push({ key: obj.Key, size: obj.Size, isMain });
      }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  console.log(`Found ${largeFiles.length} files to optimize on R2.`);

  for (const item of largeFiles) {
    try {
      // Download
      const getRes = await s3.send(new GetObjectCommand({
        Bucket: BUCKET,
        Key: item.key,
      }));
      const inputBuffer = await streamToBuffer(getRes.Body);

      const isPng = item.key.endsWith('.png');
      let optimizedBuffer;
      let contentType = isPng ? 'image/png' : 'image/jpeg';

      if (isPng) {
        optimizedBuffer = await sharp(inputBuffer)
          .resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true })
          .png({ compressionLevel: 9, quality: 80 })
          .toBuffer();
      } else {
        optimizedBuffer = await sharp(inputBuffer)
          .resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      }

      if (optimizedBuffer.length < item.size) {
        // Upload back to R2
        await s3.send(new PutObjectCommand({
          Bucket: BUCKET,
          Key: item.key,
          Body: optimizedBuffer,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }));
        console.log(`[R2 SUCCESS] ${item.key}: ${(item.size / 1024).toFixed(0)}KB -> ${(optimizedBuffer.length / 1024).toFixed(0)}KB`);
      } else {
        console.log(`[R2 SKIP] ${item.key}: already optimal`);
      }
    } catch (err) {
      console.error(`[R2 ERROR] ${item.key}:`, err.message);
    }
  }
}

async function main() {
  await optimizeLocalImages();
  await optimizeR2Images();
  console.log('\nAll image optimizations finished!');
}

main().catch(console.error);
