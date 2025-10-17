import { ArrowLeftIcon, BoltIcon, SparklesIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import carsData from '@/data/cars.json'
import ImageGallery from '@/components/ImageGallery'

// Static generation için gerekli
export async function generateStaticParams() {
  return carsData.map((car) => ({
    id: car.id,
  }))
}

interface Car {
  id: string
  brand: string
  model: string
  year: number
  segment: string
  ev_range_km: number
  fuel_consumption: number
  battery_kwh: number
  price_eur: number
  image_url: string
  power_hp: number
  co2_emission: number
  charge_time_ac: number
  charge_time_dc: number
  trunk_volume: number
  seats: number
  warranty_years: number
  country_availability: string
}

interface ModelDetailProps {
  params: {
    id: string
  }
}

export default function ModelDetail({ params }: ModelDetailProps) {
  const car = carsData.find(c => c.id === params.id) as Car

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
        <div className="card text-center max-w-lg">
          <div className="text-8xl mb-4">🚗</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Model Not Found</h1>
          <p className="text-slate-600 mb-6">The vehicle you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  // Model için lokal fotoğrafları al
  const getCatalogImages = (carId: string, brand: string) => {
    const urlParts = car.image_url.split('/')
    const brandFromUrl = urlParts[4]
    const modelFromUrl = urlParts[5]
    
    if (!brandFromUrl || !modelFromUrl) {
      return ['/images/placeholder-car.jpg']
    }
    
    const basePath = `/images/cars/brands/${brandFromUrl}/${modelFromUrl}`
    const images: string[] = []
    
    // Main görsel (doğru uzantıyla)
    images.push(car.image_url)
    
    // Numaralı görseller
    for (let i = 1; i <= 20; i++) {
      const num = i.toString().padStart(3, '0')
      images.push(`${basePath}/${num}.jpg`)
      images.push(`${basePath}/${num}.png`)
    }
    
    return images
  }

  const catalogImages = getCatalogImages(car.id, car.brand)

  const specifications = [
    { 
      category: 'Electric Performance',
      items: [
        { label: 'Electric Range', value: `${car.ev_range_km} km`, icon: BoltIcon, highlight: true },
        { label: 'Battery Capacity', value: `${car.battery_kwh} kWh`, icon: SparklesIcon, highlight: true },
        { label: 'AC Charge Time', value: `${car.charge_time_ac} hours` },
        { label: 'DC Charge Time', value: `${car.charge_time_dc} minutes` },
      ]
    },
    {
      category: 'Engine & Performance',
      items: [
        { label: 'Power', value: `${car.power_hp} HP`, highlight: true },
        { label: 'Fuel Consumption', value: `${car.fuel_consumption} L/100km` },
        { label: 'CO₂ Emission', value: `${car.co2_emission} g/km` },
      ]
    },
    {
      category: 'Comfort & Space',
      items: [
        { label: 'Trunk Volume', value: `${car.trunk_volume} L` },
        { label: 'Seats', value: car.seats },
        { label: 'Segment', value: car.segment },
      ]
    },
    {
      category: 'General',
      items: [
        { label: 'Brand', value: car.brand },
        { label: 'Model', value: car.model },
        { label: 'Year', value: car.year },
        { label: 'Warranty', value: `${car.warranty_years} years` },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <header className="header-metallic sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors group">
              <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Comparison</span>
            </Link>
            
            <div className="text-right">
              <div className="text-sm text-slate-400">{car.brand}</div>
              <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                {car.model}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Images */}
          <div>
            <ImageGallery 
              images={catalogImages} 
              alt={`${car.brand} ${car.model}`} 
            />
          </div>

          {/* Right Panel - Details */}
          <div className="space-y-6">
            {/* Title and Price Card */}
            <div className="card">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="badge-steel">{car.year}</span>
                  <span className="badge-steel">{car.segment}</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  {car.brand} {car.model}
                </h1>
              </div>

              <div className="flex items-baseline space-x-3 mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  €{car.price_eur.toLocaleString()}
                </span>
                <span className="text-slate-500">Starting Price</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <BoltIcon className="h-5 w-5 text-green-600" />
                    <div className="text-xs text-green-700 font-semibold">Range</div>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{car.ev_range_km} km</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                    <div className="text-xs text-purple-700 font-semibold">Battery</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-800">{car.battery_kwh} kWh</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <BoltIcon className="h-5 w-5 text-red-600" />
                    <div className="text-xs text-red-700 font-semibold">Power</div>
                  </div>
                  <div className="text-2xl font-bold text-red-800">{car.power_hp} HP</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Link 
                href="/"
                className="btn-primary text-center"
              >
                Compare with Others
              </Link>
              <button className="btn-secondary">
                Find Dealers
              </button>
            </div>

            {/* Specifications */}
            {specifications.map((spec) => (
              <div key={spec.category} className="card">
                <h3 className="text-xl font-bold text-slate-800 mb-4 pb-3 border-b-2 border-slate-200">
                  {spec.category}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {spec.items.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all ${
                        item.highlight 
                          ? 'bg-gradient-to-r from-blue-50 to-slate-50 border-2 border-blue-200' 
                          : 'bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon && <item.icon className="h-5 w-5 text-blue-600" />}
                        <span className="text-slate-600 font-medium">{item.label}</span>
                      </div>
                      <span className={`font-bold ${item.highlight ? 'text-blue-700 text-lg' : 'text-slate-800'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Availability */}
            <div className="card">
              <h3 className="text-xl font-bold text-slate-800 mb-4 pb-3 border-b-2 border-slate-200">
                Availability
              </h3>
              <div className="flex flex-wrap gap-2">
                {car.country_availability.split(',').map((country, index) => (
                  <span
                    key={index}
                    className="badge-primary text-base px-4 py-2"
                  >
                    {country.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
