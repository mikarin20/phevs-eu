export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">PHEVs.eu</h1>
              <span className="ml-2 text-sm text-gray-500">PHEV Karşılaştırma</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PHEV Karşılaştırma Sitesi
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Avrupa'nın en kapsamlı PHEV karşılaştırma platformu
          </p>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Yakında!</h2>
            <p className="text-gray-600">
              Site geliştirme aşamasında. Çok yakında yayında!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
