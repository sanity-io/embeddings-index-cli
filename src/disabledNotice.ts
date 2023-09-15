import log from './util/log'
import {createClient} from './util/sanityClient'

export default function logDisabledNotice() {
  const client = createClient()

  log.info(
    '💎 Unlock semantic search with the Embeddings Index API — available on Team, Business, and Enterprise plans. ' +
      `Upgrade now: https://www.sanity.io/manage/project/${
        client.config().projectId
      }/plan?ref=embeddings-cli`,
  )
}
