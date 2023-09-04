/* eslint-disable no-console,no-process-env */
import {getCliClient} from '@sanity/cli'
//@ts-ignore
import ConfigStore from 'configstore'
import {SanityClient} from 'sanity'
import log from './log'
import {stringify} from './stringify'

export function createClient(): SanityClient {
  const sanityEnv = (process.env.SANITY_INTERNAL_ENV || '').toLowerCase()
  const defaults = {}
  const config = new ConfigStore(
    sanityEnv && sanityEnv !== 'production' ? `sanity-${sanityEnv}` : 'sanity',
    defaults,
    {globalConfigPath: true},
  )
  const token = process.env.SANITY_EMBEDDINGS_TOKEN ?? config.get('authToken')
  if (!token) {
    throw new Error(
      'No auth token could be found. Run `sanity login` or set SANITY_EMBEDDINGS_TOKEN environment variable.',
    )
  }

  return getCliClient({
    useCdn: false,
    apiVersion: 'vX',
    token,
  })
}

export function logResponseError(message: string, err: any, prettify: boolean) {
  log.error(
    `${message}\n`,
    `Status code:\n${err?.response?.statusCode}\n`,
    `Response body:\n${stringify(err?.response?.body, prettify)}`,
  )
}
