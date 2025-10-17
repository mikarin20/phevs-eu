import carsData from '@/data/cars.json'

// Static generation için gerekli
export async function generateStaticParams() {
  return carsData.map((car) => ({
    id: car.id,
  }))
}

export default function ModelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
