import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import {applyManifestFlags, getIndexConfig} from '../util/config'
import log from '../util/log'
import {stringify} from '../util/stringify'

export const createFlags = {
  filter: {
    type: 'string',
    description:
      'GROQ projection for documents matching the filter. Allows reshaping the document before it is indexed.',
  },
  projection: {
    type: 'string',
    description:
      'GROQ filter controls which documents are put into the index. Must be a Sanity webhook compliant GROQ filter.',
  },
  ...sharedIndexFlags,
  ...sharedFlags,
} as const

export type CreateFlags = TypedFlags<typeof createFlags>

export interface CreateOptions {
  basePath: string
  flags: CreateFlags
}

export async function create(options: CreateOptions) {
  const {flags, basePath} = options

  const {client, dataset, indexName, manifest} = await getIndexConfig(flags, basePath)

  const appliedManifest = applyManifestFlags(indexName, dataset, manifest, flags)

  const response = await client.request({
    uri: `embeddings-index/${appliedManifest.dataset}`,
    method: 'POST',
    body: {
      indexName: appliedManifest.indexName,
      projection: appliedManifest.projection,
      filter: appliedManifest.filter,
    },
  })
  log.info('Created index')
  log.info(stringify(response, flags.prettify))
}
