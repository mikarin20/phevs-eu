import VehicleForm from '../VehicleForm'

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Vehicle</h1>
      <VehicleForm mode="create" />
    </div>
  )
}
