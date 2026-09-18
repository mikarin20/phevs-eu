import CompareForm from '../CompareForm'

export default function NewComparePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Quick Compare</h1>
      <CompareForm mode="create" />
    </div>
  )
}
