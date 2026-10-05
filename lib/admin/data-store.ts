import fs from 'fs/promises'
import pathModule from 'path'
import { getFile, putFile } from './github'

const CARS_PATH = 'data/cars.json'
const BLOG_PATH = 'data/blog.json'
const COMPARES_PATH = 'data/quick-compares.json'
const VIDEOS_PATH = 'data/comparison-videos.json'

async function readJsonArray<T>(path: string): Promise<{ items: T[]; sha?: string }> {
  // In development, prioritize local filesystem so working copy changes are immediately visible
  if (process.env.NODE_ENV === 'development') {
    try {
      const localFilePath = pathModule.join(process.cwd(), path)
      const content = await fs.readFile(localFilePath, 'utf-8')
      let sha: string | undefined
      try {
        const file = await getFile(path)
        sha = file?.sha
      } catch {}
      return { items: JSON.parse(content) as T[], sha }
    } catch {}
  }

  try {
    const file = await getFile(path)
    if (file) {
      return { items: JSON.parse(file.content) as T[], sha: file.sha }
    }
  } catch (err) {
    console.error(`[data-store] GitHub fetch failed for ${path}, falling back to local file:`, err)
  }

  // Fallback to local bundled file
  try {
    const localFilePath = pathModule.join(process.cwd(), path)
    const content = await fs.readFile(localFilePath, 'utf-8')
    return { items: JSON.parse(content) as T[] }
  } catch {
    return { items: [] }
  }
}

async function writeJsonArray<T>(path: string, items: T[], sha: string | undefined, message: string): Promise<string> {
  const content = JSON.stringify(items, null, 2) + '\n'
  // Always update local file as well
  try {
    const localFilePath = pathModule.join(process.cwd(), path)
    await fs.writeFile(localFilePath, content, 'utf-8')
  } catch {}

  return putFile(path, content, message, sha)
}

function makeStore<T>(path: string) {
  return {
    path,
    list: () => readJsonArray<T>(path),
    save: (items: T[], sha: string | undefined, message: string) => writeJsonArray(path, items, sha, message),
  }
}

export const carsStore = makeStore<any>(CARS_PATH)
export const blogStore = makeStore<any>(BLOG_PATH)
export const compareStore = makeStore<any>(COMPARES_PATH)
export const videoStore = makeStore<any>(VIDEOS_PATH)
