# PHEV Sitesi için tüm dosyaları oluşturan script
Write-Host "PHEV Sitesi tüm dosyaları oluşturuluyor..." -ForegroundColor Green

# Klasörleri oluştur
$folders = @("app", "components", "data", "public")
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder
        Write-Host "$folder klasörü oluşturuldu" -ForegroundColor Yellow
    }
}

# package.json
$packageJson = @'
{
  "name": "phevs-eu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@heroicons/react": "^2.0.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "14.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
'@

$packageJson | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "package.json oluşturuldu" -ForegroundColor Green

# next.config.js
$nextConfig = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
'@

$nextConfig | Out-File -FilePath "next.config.js" -Encoding UTF8
Write-Host "next.config.js oluşturuldu" -ForegroundColor Green

# tailwind.config.js
$tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
'@

$tailwindConfig | Out-File -FilePath "tailwind.config.js" -Encoding UTF8
Write-Host "tailwind.config.js oluşturuldu" -ForegroundColor Green

# postcss.config.js
$postcssConfig = @'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@

$postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8
Write-Host "postcss.config.js oluşturuldu" -ForegroundColor Green

# tsconfig.json
$tsconfig = @'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
'@

$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding UTF8
Write-Host "tsconfig.json oluşturuldu" -ForegroundColor Green

Write-Host "Tüm dosyalar oluşturuldu!" -ForegroundColor Green
Write-Host "Şimdi GitHub Desktop'da commit yapın ve Vercel'de tekrar deploy edin." -ForegroundColor Cyan