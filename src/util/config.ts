import {SharedIndexFlags} from '../sharedFlags'
import {createClient} from './sanityClient'
import {Manifest, readManifest} from '../manifest'
import {SanityClient} from 'sanity'
import log from './log'
import {ValidationError} from './error'

export interface IndexConfig {
  client: SanityClient
  indexName: string
  dataset: string
  manifest?: Manifest
}

export async function getIndexConfig(
  flags: SharedIndexFlags,
  basePath: string,
): Promise<IndexConfig> {
  const client = createClient()

  let manifest: Manifest | undefined

  if (flags.manifest) {
    manifest = await readManifest(basePath, flags.manifest)
  }

  const {dataset: clientDataset} = client.config()
  const indexName = flags.indexName ?? manifest?.indexName
  const dataset = flags.dataset ?? manifest?.dataset ?? clientDataset

  if (!indexName) {
    throw new ValidationError(`indexName missing in manifest file or as command line argument.`)
  }
  if (!dataset) {
    throw new ValidationError(
      'dataset not found in manifest file, as command line argument or in sanity.config',
    )
  }

  log.debug(`projectId: ${client.config().projectId}`)
  log.debug(`dataset: ${dataset}`)
  log.debug(`indexName: ${indexName}`)

  return {
    client: client.withConfig({dataset}),
    indexName,
    dataset,
    manifest,
  }
}

export function applyManifestFlags(
  indexName: string,
  dataset: string,
  manifest: Manifest | undefined,
  flags: {filter?: string; projection?: string},
): Manifest {
  const projection = flags.projection ?? manifest?.projection
  if (!projection) {
    throw new ValidationError('projection missing in manifest file or as command line argument')
  }

  const filter = flags.filter ?? manifest?.filter
  if (!filter) {
    throw new ValidationError('filter missing in manifest file or as command line argument')
  }
  return {
    indexName,
    dataset,
    projection,
    filter,
  }
}
