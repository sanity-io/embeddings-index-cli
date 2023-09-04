import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import {applyManifestFlags, getIndexConfig} from '../util/config'
import {writeFile} from 'fs/promises'
import path from 'path'
import log from '../util/log'

export const manifestFlags = {
  filter: {
    type: 'string',
    description:
      'GROQ filter. Controls which documents are indexed. Must be a Sanity webhook compliant GROQ filter.',
  },
  projection: {
    type: 'string',
    description:
      'GROQ projection for documents matching the filter. Allows reshaping the document before it is indexed.',
  },
  out: {
    type: 'string',
    description:
      'Output path for the manifest file, can be relative to project directory, or absolute path. Ie manifests/posts.json',
  },
  ...sharedIndexFlags,
  ...sharedFlags,
} as const

export type ManifestFlags = TypedFlags<typeof manifestFlags>

export interface ManifestOptions {
  basePath: string
  flags: ManifestFlags
}

export async function createManifest(options: ManifestOptions) {
  const {flags, basePath} = options

  const {dataset, indexName, manifest} = await getIndexConfig(flags, basePath)

  const appliedManifest = applyManifestFlags(indexName, dataset, manifest, flags)

  const outPath = flags.out
  if (!outPath) {
    throw new Error('--out is required')
  }
  const filePath = path.isAbsolute(flags.out)
    ? flags.out
    : path.normalize(path.join(basePath, flags.out))

  const data = `${JSON.stringify(appliedManifest, null, 2)}\n`
  await writeFile(filePath, data, {encoding: 'utf8'})
  log.info(`Created ${path.relative(basePath, filePath)}`)
  return appliedManifest
}
