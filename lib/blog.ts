/**
 * Blog Helper and Scheduling Utilities
 * Supports instant publishing, draft status, and automated time-based scheduled publishing.
 */

export interface BlogPost {
  id: string
  slug: string
  title: string
  title_en: string
  title_de?: string
  title_pl?: string
  excerpt: string
  excerpt_en: string
  excerpt_de?: string
  excerpt_pl?: string
  content: string
  content_en: string
  content_de?: string
  content_pl?: string
  meta_title?: string
  meta_title_en?: string
  meta_title_de?: string
  meta_title_pl?: string
  meta_description?: string
  meta_description_en?: string
  meta_description_de?: string
  meta_description_pl?: string
  author: string
  author_en: string
  author_de?: string
  author_pl?: string
  published_at: string
  updated_at?: string
  category: string
  category_en: string
  category_de?: string
  category_pl?: string
  tags: string[]
  featured_image: string
  read_time: number
  related_cars?: string[]
  status?: 'draft' | 'published' | 'scheduled'
}

/**
 * Checks if a blog post is currently live for public viewing and search engine indexing.
 * - 'draft': never live.
 * - 'scheduled': automatically goes live once Date.now() >= published_at.
 * - 'published': live immediately (or once its published_at arrives if set to future).
 */
export function isPostLive(post: { status?: string; published_at?: string }): boolean {
  if (!post) return false
  if (post.status === 'draft') return false

  const publishTimestamp = post.published_at ? new Date(post.published_at).getTime() : NaN

  // If a post has a valid future date, it remains unreleased until that timestamp
  if (!isNaN(publishTimestamp) && publishTimestamp > Date.now()) {
    return false
  }

  if (post.status === 'scheduled') {
    return !isNaN(publishTimestamp) && publishTimestamp <= Date.now()
  }

  return post.status === 'published' || !post.status
}

/**
 * Filters a list of posts to only include currently live posts, sorted newest to oldest.
 */
export function getLiveBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter(isPostLive)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

/**
 * Returns human-readable publishing status and scheduling info.
 */
export function getPostPublicationInfo(post: { status?: string; published_at?: string }) {
  const isLive = isPostLive(post)
  const publishTime = post.published_at ? new Date(post.published_at).getTime() : NaN
  const isFuture = !isNaN(publishTime) && publishTime > Date.now()

  let statusLabel = 'Published'
  let daysUntil = 0

  if (post.status === 'draft') {
    statusLabel = 'Draft'
  } else if (isFuture || post.status === 'scheduled') {
    statusLabel = 'Scheduled'
    daysUntil = Math.ceil((publishTime - Date.now()) / (1000 * 60 * 60 * 24))
  }

  return {
    isLive,
    statusLabel,
    isScheduled: isFuture || post.status === 'scheduled',
    daysUntil,
  }
}
