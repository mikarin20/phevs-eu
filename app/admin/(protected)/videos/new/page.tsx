import VideoForm from '../VideoForm'

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add Comparison / Review Video</h1>
        <p className="text-sm text-slate-500">
          Embed a YouTube test video and link it to PHEV vehicles in the database.
        </p>
      </div>
      <VideoForm mode="create" />
    </div>
  )
}
