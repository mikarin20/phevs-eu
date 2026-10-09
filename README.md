# PHEVs.eu — European Plug-in Hybrid Intelligence & Database

> Europe's premier technical authority platform on Plug-in Hybrid Electric Vehicles (PHEVs), real-world range simulations, verified owner telemetry, and European corporate fleet taxation (BiK).

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Status-Production-emerald?style=flat)](https://www.phevs.eu)

**Live Platform:** [https://www.phevs.eu](https://www.phevs.eu)

---

## 🚀 Overview

Official WLTP brochure numbers often diverge from practical daily driving. **PHEVs.eu** bridges this gap for European car buyers, private commuters, and corporate fleet managers by pairing comprehensive manufacturer technical sheets with **physics-based range simulations** and **verified real-world driver telemetries**.

---

## ⚡ Core Features & Modules

### 1. 🔋 Interactive Range Simulator & Calculator (`/range-calculator/`)
- **SSR-First Hydration**: Fully accessible for search engines with server-rendered fallback specs.
- **Physics-Informed Real-World Modeling**: Factors ambient temperatures (-20°C to +35°C), HVAC heating/AC draw, highway speed ratios (0% city to 100% Autobahn), and terrain elevation.
- **Query-String State Synchronization**: Deep linkable simulation states (`?car=...&temp=0&speed=110&hvac=on`) for instant bookmarking and sharing.

### 2. 🛡️ Verified Owner Telemetry & Community Benchmarks (`/models/[slug]/#owner-telemetry`)
- **Real-World Driver Submissions**: Real-life owner logs sourced and verified from community threads (`r/PHEV`, enthusiast forums, and direct submissions).
- **Owner Benchmarks vs WLTP**:
  - Warm vs. winter EV range deviations (percentage delta).
  - Depleted-battery fuel consumption (**L/100 km**) in pure hybrid sustaining mode.
  - Odometer readings, driving conditions, and direct links to original community reports.
- **GEO & Schema Integration**: Automatically generates structured `FAQPage` and `Dataset` JSON-LD schemas for search engines and AI engines (Perplexity, ChatGPT, Gemini).

### 3. 🚘 Comprehensive Models Catalog (`/models/`)
- Search and browse Europe's complete database of PHEV models.
- Multi-facet filters:
  - **Electric Range (WLTP)**
  - **Usable Battery Capacity (kWh)**
  - **Base European Pricing (€)**
  - **Charging Architecture** (AC Mennekes & DC CCS rapid charging)
  - **Vehicle Segment & Drivetrain** (FWD, RWD, e-AWD)

### 4. ⚖️ Head-to-Head Comparison Engine (`/compare/` & `/compare/[cars]/`)
- Compare up to 3 plug-in hybrids side by side across 40+ engineering data points.
- Instant parameter differentiation: EV range, thermal management (heat pump availability), luggage volume, curb weight, and emissions.

### 5. 💼 European Fleet & BiK Tax Intelligence (`/tax-simulator/`)
- Dedicated simulator for company car taxation and fiscal benefits across major European markets:
  - 🇩🇪 **Germany**: 0.5% / 0.25% *Dienstwagenbesteuerung* compliance rules.
  - 🇫🇷 **France**: Malus exemption & TVS (*Taxe sur les Véhicules de Sociétés*) thresholds.
  - 🇳🇱 **Netherlands**: *Bijtelling* rates.
  - 🇬🇧 **United Kingdom**: Benefit-in-Kind (BiK) tax bands based on certified zero-emission range.

### 6. 📑 Programmatic High-Intent Hubs
- 🏆 [Longest Range PHEVs in Europe](/longest-range-phev/)
- 💰 [Cheapest PHEVs in Europe](/cheapest-phev-europe/)
- 🏎️ [Fastest Accelerating PHEVs](/fastest-accelerating-phev/)
- 👨‍👩‍👧‍👦 [7-Seater Family PHEVs](/7-seater-phev/)
- ⚡ [PHEVs with DC Fast Charging (CCS)](/phev-with-dc-charging/)

### 7. 📰 Automotive Intelligence & Market Reports (`/blog/`)
- In-depth market analyses, registration reports, and competitive reviews of European and incoming Chinese PHEVs (BYD Seal U, Chery Omoda 9, Jaecoo 7/8).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server Components & Dynamic SSR) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict type checking) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + Custom Dark/Light Design Tokens |
| **Icons** | [Heroicons](https://heroicons.com/) & [Lucide React](https://lucide.dev/) |
| **Asset Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (Optimized static vehicle image CDN) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) (Edge Middleware + Global Serverless Functions) |
| **SEO & GEO** | Schema.org JSON-LD (`Vehicle`, `Car`, `BreadcrumbList`, `FAQPage`, `Dataset`), `llms.txt`, Dynamic `sitemap.xml` |

---

## 📁 Project Structure

```text
phevs-eu/
├── app/                              # Next.js 14 App Router
│   ├── (programmatic routes)/       # /longest-range-phev, /cheapest-phev-europe, etc.
│   ├── blog/                         # Editorial articles & market guides
│   ├── compare/                      # Comparison matrices
│   ├── models/                       # Models catalog & vehicle detail pages [id]
│   ├── range-calculator/             # SSR-first real-world range simulator
│   ├── tax-simulator/                # European BiK & corporate car tax simulator
│   ├── layout.tsx                    # Root layout with navigation & footer
│   ├── robots.ts                     # Search engine & AI crawler rules
│   └── sitemap.ts                    # Dynamic multi-route XML sitemap
├── components/                       # Reusable React client & server components
│   ├── CommunityTelemetry.tsx        # Verified owner real-world benchmarks module
│   ├── ModelsCatalogClient.tsx       # Live search & filtering catalog UI
│   ├── RangeCalculatorPageClient.tsx # Range simulator interactive controller
│   └── ...
├── data/                             # Curated datasets
│   ├── cars.json                     # Comprehensive vehicle technical database
│   └── community-reports.json        # Real-world driver telemetry & Reddit benchmarks
├── docs/                             # Strategy & SEO documentation
├── lib/                              # Core domain utilities
│   ├── community-telemetry.ts        # Telemetry aggregations & Schema.org JSON-LD
│   ├── range-calculator-physics.ts   # Range simulation mathematical engine
│   └── ...
├── public/                           # Static assets, robots.txt, llms.txt
└── next.config.js                    # Next.js configuration (unoptimized images for R2 CDN)
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js 18.17+ or Node.js 20+
- npm, pnpm, or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/mikarin20/phevs-eu.git
cd phevs-eu

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build & Verification
```bash
# Validate types, linting, and compile static production bundle
npm run build

# Start local production server
npm run start
```

---

## 📈 Search Engine & AI Optimization (GEO)

- **AI Crawlers Welcome**: `robots.txt` explicitly enables indexing for modern generative search engines (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`).
- **Standardized Machine Context**: [`/llms.txt`](/public/llms.txt) provides structured context about the platform's methodology and technical scope.
- **Rich Structured Data**: Every car detail page embeds complete `Vehicle`, `FAQPage`, and `Dataset` schemas with verified telemetry metrics.

---

## 📄 License & Attribution

Designed and maintained for **[PHEVs.eu](https://www.phevs.eu)**. All rights reserved.
Telemetries and real-world comments are attributed to their respective community contributors.
