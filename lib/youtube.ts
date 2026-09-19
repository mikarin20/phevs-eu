/**
 * Helper to extract 11-character YouTube video ID from various formats:
 * - https://www.youtube.com/watch?v=XXXXXXXXXXX
 * - https://youtu.be/XXXXXXXXXXX
 * - https://www.youtube.com/embed/XXXXXXXXXXX
 * - Raw 11-char ID
 */
export function extractYouTubeId(input: string): string {
  if (!input) return ''
  const trimmed = input.trim()

  // Match youtu.be/ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (youtuBeMatch) return youtuBeMatch[1]

  // Match youtube.com/watch?v=ID or /embed/ID
  const youtubeMatch = trimmed.match(/(?:watch\?v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
  if (youtubeMatch) return youtubeMatch[1]

  // If already 11 alphanumeric characters / underscores / hyphens
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  return trimmed
}
