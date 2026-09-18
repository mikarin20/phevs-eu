import BlogForm from '../BlogForm'

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Add Blog Post</h1>
      <BlogForm mode="create" />
    </div>
  )
}
