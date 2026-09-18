// Typed wrappers around the GitHub file client for each JSON data module.
import { getFile, putFile } from './github'

const CARS_PATH = 'data/cars.json'
const BLOG_PATH = 'data/blog.json'
const COMPARES_PATH = 'data/quick-compares.json'

async function readJsonArray<T>(path: string): Promise<{ items: T[]; sha?: string }> {
  const file = await getFile(path)
  if (!file) return { items: [] }
  return { items: JSON.parse(file.content) as T[], sha: file.sha }
}

async function writeJsonArray<T>(path: string, items: T[], sha: string | undefined, message: string): Promise<string> {
  const content = JSON.stringify(items, null, 2) + '\n'
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
