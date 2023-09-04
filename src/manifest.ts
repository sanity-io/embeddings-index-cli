import {z} from 'zod'
import path from 'path'
import fs from 'fs/promises'

const ManifestShape = z.object({
  indexName: z.string(),
  dataset: z.string(),
  filter: z.string(),
  projection: z.string(),
})

export type Manifest = z.infer<typeof ManifestShape>

export async function readManifest(basePath: string, manifestPath: string) {
  const filePath = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.normalize(path.join(basePath, manifestPath))

  let content
  try {
    content = await fs.readFile(filePath, 'utf8')
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      throw new Error(`No manifest found on path: ${filePath}`)
    }

    throw new Error(`Failed to read "${filePath}": ${err.message}`)
  }

  try {
    const parsed = JSON.parse(content)
    return parseManifest(parsed)
  } catch (err: any) {
    throw new Error(`Error parsing "${filePath}": ${err.message}`)
  }
}

export function parseManifest(manifest: any): Manifest {
  return ManifestShape.parse(manifest)
}
