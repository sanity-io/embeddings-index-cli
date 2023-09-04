import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import {getIndexConfig} from '../util/config'
import log from '../util/log'
import {stringify} from '../util/stringify'

export const deleteFlags = {
  ...sharedIndexFlags,
  ...sharedFlags,
} as const

export type DeleteFlags = TypedFlags<typeof deleteFlags>

export interface DeleteOptions {
  basePath: string
  flags: DeleteFlags
}

export async function deleteIndex(options: DeleteOptions) {
  const {flags, basePath} = options

  const {client, dataset, indexName} = await getIndexConfig(flags, basePath)
  const response = await client.request({
    uri: `embeddings-index/${dataset}/${indexName}`,
    method: 'DELETE',
  })
  log.info('Deleted index')
  log.info(stringify(response, flags.prettify))
}
