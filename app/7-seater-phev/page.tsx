import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import carsData from '@/data/cars.json';

export const metadata: Metadata = {
  title: '7-Seater PHEVs — Large Family Plug-in Hybrids | PHEVs.eu',
  description:
    'Complete guide and comparison of 7-seater plug-in hybrid (PHEV) vehicles in Europe. Discover spacious 3-row family SUVs and MPVs with electric range, luggage volume, and specs.',
  alternates: {
    canonical: 'https://phevs.eu/7-seater-phev',
  },
  openGraph: {
    title: '7-Seater PHEVs — Best Family 3-Row Plug-in Hybrids (2025/2026)',
    description:
      'Spacious 7-seater and 3-row family plug-in hybrids compared: electric range, boot capacity, third-row space, and fuel economy.',
    url: 'https://phevs.eu/7-seater-phev',
    type: 'website',
  },
};

export default function SevenSeaterPhevPage() {
  // Filter PHEVs with 7 or more seats
  const sevenSeaters = (carsData as any[])
    .filter((car) => Number(car.seats) >= 7)
    .sort((a, b) => (b.range_electric_km || 0) - (a.range_electric_km || 0));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://phevs.eu/7-seater-phev#webpage',
        url: 'https://phevs.eu/7-seater-phev',
        name: '7-Seater PHEVs — Best Large Family Plug-in Hybrids',
        description:
          'Comprehensive comparison of 7-passenger plug-in hybrid SUVs and MPVs available in the European market.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://phevs.eu/#website',
          name: 'PHEVs.eu',
          url: 'https://phevs.eu',
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: sevenSeaters.map((car, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://phevs.eu/models/${car.slug || car.id}`,
            name: `${car.brand} ${car.model}`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://phevs.eu/7-seater-phev#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Which plug-in hybrids have 7 seats in Europe?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Notable 7-seater PHEVs include the Volvo XC90 Recharge, Hyundai Santa Fe Plug-in, Kia Sorento PHEV, Peugeot 5008 Plug-in Hybrid, Audi Q7 TFSI e, Ford Explorer Plug-in, Land Rover Defender 110, Discovery Sport, Volkswagen Multivan eHybrid, and Mitsubishi Outlander PHEV (selected 3-row trims).',
            },
          },
          {
            '@type': 'Question',
            name: 'Does the battery reduce boot space in 7-seater PHEVs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'In 3-row plug-in hybrids, the traction battery is typically housed beneath the passenger floor or under the 2nd row seats. While the deep underfloor storage behind the 3rd row is sometimes sacrificed for the battery or inverter, all recommended models retain genuine 7-seat functionality and ample cargo volume with seats folded.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are 7-seater PHEVs good for family road trips?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Unlike pure EVs that require frequent high-power charging stops on heavily loaded family vacations, a 7-seater PHEV allows zero-emission urban school runs on battery power while providing 600-900 km of uninterrupted hybrid cruising on petrol when traveling with family and luggage.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* JSON-LD for Search Engines & AI Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.12),transparent_45%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-200">7-Seater PHEVs</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Family & Practicality Guide
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            7-Seater <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">PHEVs</span>
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-300 leading-relaxed">
            Spacious 3-row plug-in hybrid SUVs and MPVs available in Europe. Carry up to 7 passengers in whisper-quiet electric mode around town, backed by hybrid petrol engines for worry-free long-distance family travel.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-400">{sevenSeaters.length}</span>
              <span>Available 7-Seater Models</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-teal-400">3-Row</span>
              <span>SUVs & Family MPVs</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-sky-400">Zero Range Anxiety</span>
              <span>For Long Holidays</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sevenSeaters.map((car) => {
            const modelUrl = `/models/${car.slug || car.id}`;
            const range = car.range_electric_km || car.electric_range_km;
            const battery = car.battery_capacity_kwh || car.battery_kwh;
            const power = car.system_power_hp || car.power_hp;
            const boot = car.luggage_volume_l || car.boot_capacity_l;

            return (
              <div
                key={car.id}
                className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:shadow-emerald-500/5"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-800/60 mb-4">
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                      No Image Available
                    </div>
                  )}

                  {/* 7-Seater Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-slate-950/80 backdrop-blur-md px-2.5 py-1 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {car.seats || 7} Seats
                  </div>

                  {car.fast_charging_dc && (
                    <div className="absolute top-3 right-3 rounded-md bg-amber-500/90 text-slate-950 px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase">
                      DC {car.max_charging_power_dc_kw || 'Fast'} kW
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                      {car.brand} • {car.body_type || 'Family SUV / MPV'}
                    </div>
                    <h2 className="mt-1 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      <Link href={modelUrl}>
                        <span className="absolute inset-0 z-0" />
                        {car.brand} {car.model}
                      </Link>
                    </h2>
                    {car.year && (
                      <p className="text-xs text-slate-400 mt-0.5">Model Year: {car.year}</p>
                    )}
                  </div>

                  {/* Spec Badges Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-4 text-xs">
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <div className="text-slate-400">WLTP Range</div>
                      <div className="font-bold text-slate-100 text-sm mt-0.5">
                        {range ? `${range} km` : 'N/A'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <div className="text-slate-400">Battery</div>
                      <div className="font-bold text-slate-100 text-sm mt-0.5">
                        {battery ? `${battery} kWh` : 'N/A'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <div className="text-slate-400">Boot Capacity</div>
                      <div className="font-bold text-slate-100 text-sm mt-0.5">
                        {boot ? `${boot} L` : 'N/A'}
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800/60">
                      <div className="text-slate-400">Power</div>
                      <div className="font-bold text-slate-100 text-sm mt-0.5">
                        {power ? `${power} hp` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-medium">
                    <span>View full 7-seater specs</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Semantic HTML Comparison Table for Search Bots & GEO */}
        <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 lg:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white">
              Complete 7-Seater PHEV Comparison Table
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Side-by-side technical specifications of European 3-row plug-in hybrid SUVs and MPVs.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-200 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 bg-slate-950/50">
                  <th scope="col" className="py-3.5 px-4 font-semibold">Model</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Seats</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">WLTP Range</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Battery</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Luggage (L)</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">DC Fast Charge</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">System Power</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sevenSeaters.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      {car.brand} {car.model}
                    </td>
                    <td className="py-3 px-4 text-emerald-300 font-semibold">{car.seats || 7}</td>
                    <td className="py-3 px-4 text-slate-200">
                      {car.range_electric_km || car.electric_range_km || '—'} km
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {car.battery_capacity_kwh || car.battery_kwh || '—'} kWh
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {car.luggage_volume_l || car.boot_capacity_l || '—'} L
                    </td>
                    <td className="py-3 px-4">
                      {car.fast_charging_dc ? (
                        <span className="text-amber-400 font-medium">
                          Yes ({car.max_charging_power_dc_kw || 'CCS'} kW)
                        </span>
                      ) : (
                        <span className="text-slate-500">AC Only</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {car.system_power_hp || car.power_hp || '—'} hp
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/models/${car.slug || car.id}`}
                        className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        Specs &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Informational SEO Guide & FAQs */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Why Choose a 7-Seater Plug-in Hybrid?
            </h2>
            <div className="prose prose-invert prose-slate max-w-none text-slate-300 space-y-4 text-sm leading-relaxed">
              <p>
                Families needing seating for 6 to 7 passengers frequently face a dilemma between pure electric vehicles (BEVs) and traditional diesels. While large 7-seater electric SUVs are often prohibitively expensive and suffer from high energy consumption on winter motorway trips, a <strong>7-seater PHEV</strong> strikes an ideal balance.
              </p>
              <h3 className="text-lg font-semibold text-white">Daily Commute with Zero Emissions</h3>
              <p>
                Most modern 7-seater PHEVs (such as the Volvo XC90 Recharge, Hyundai Santa Fe, and Mitsubishi Outlander) offer between 50 and 85 km of pure electric range. This is more than sufficient for everyday family duties: school runs, sports clubs, and city grocery trips operate 100% electrically on inexpensive home electricity.
              </p>
              <h3 className="text-lg font-semibold text-white">Unrestricted Holiday Cruising</h3>
              <p>
                When taking long family holidays with children, luggage, and a roof box, you don&apos;t have to hunt for vacant ultra-fast chargers during peak travel periods. The internal combustion engine provides rapid 5-minute refuelling, delivering total driving autonomy of up to 800 km.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 h-fit">
            <h3 className="text-lg font-bold text-white mb-4">Explore More PHEV Categories</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/longest-range-phev"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  <span>100+ km Longest Range PHEVs</span>
                  <span className="text-xs text-emerald-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/phev-with-dc-charging"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  <span>DC Fast Charging PHEVs</span>
                  <span className="text-xs text-emerald-400">&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 transition-colors"
                >
                  <span>PHEV Comparison Tool</span>
                  <span className="text-xs text-emerald-400">&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
