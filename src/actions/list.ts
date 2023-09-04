import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import log from '../util/log'
import {stringify} from '../util/stringify'
import {getIndexConfig} from '../util/config'

export const listIndexesFlags = {
  dataset: sharedIndexFlags.dataset,
  prettify: sharedIndexFlags.prettify,
  ...sharedFlags,
} as const

export type ListIndexesFlags = TypedFlags<typeof listIndexesFlags>

export interface ListIndexOptions {
  basePath: string
  flags: ListIndexesFlags
}

export async function listIndexes(options: ListIndexOptions) {
  const {flags, basePath} = options
  const {client, dataset} = await getIndexConfig(
    {...flags, manifest: undefined, indexName: 'dummy'},
    basePath,
  )
  const response = await client.request({
    uri: `embeddings-index/${dataset}`,
    method: 'GET',
    json: true,
  })
  log.info(stringify(response, flags.prettify))
}
