import {sharedFlags, sharedIndexFlags} from '../sharedFlags'
import {TypedFlags} from 'meow'
import log from '../util/log'
import {stringify} from '../util/stringify'
import {getIndexConfig} from '../util/config'

export const queryFlags = {
  text: {
    type: 'string',
    description: 'Query text, can be stringified JSON to find matching documents',
  },
  maxResults: {
    type: 'number',
    default: 10,
    description: 'Max number of search hits',
  },
  type: {
    type: 'string',
    description:
      'Optional filter. Comma-separated list of document-types to include in the result. Ie: --type "typeA,typeB"',
  },
  ...sharedIndexFlags,
  ...sharedFlags,
} as const

export type QueryFlags = TypedFlags<typeof queryFlags>

export interface QueryOptions {
  basePath: string
  flags: QueryFlags
}

export async function query(options: QueryOptions) {
  const {flags, basePath} = options

  const queryString = flags.text
  if (!queryString) {
    throw new Error('--text is required')
  }

  const {client, dataset, indexName} = await getIndexConfig(flags, basePath)

  const response = await client.request({
    uri: `embeddings-index/query/${dataset}/${indexName}`,
    method: 'POST',
    body: {
      query: queryString,
      maxResults: flags.maxResults,
      filter: {
        type: flags.type ? flags.type.split(',').map((type) => type.trim()) : undefined,
      },
    },
  })
  log.info(stringify(response, flags.prettify))
}
