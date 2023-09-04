import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import log from '../util/log'
import {stringify} from '../util/stringify'
import {getIndexConfig} from '../util/config'

export const getIndexFlags = {
  ...sharedIndexFlags,
  ...sharedFlags,
} as const

export type GetIndexFlags = TypedFlags<typeof getIndexFlags>

export interface GetIndexOptions {
  basePath: string
  flags: GetIndexFlags
}

export async function getIndex(options: GetIndexOptions) {
  const {flags, basePath} = options
  const {client, dataset, indexName} = await getIndexConfig(flags, basePath)
  const response = await client.request({
    uri: `embeddings-index/${dataset}/${indexName}`,
    method: 'GET',
    json: true,
  })
  log.info(stringify(response, flags.prettify))
}
