import path from 'path'
import meow from 'meow'
import {create, createFlags} from '../actions/create'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Create an embeddings index.`

const help = `
Usage
  ${binName} create [<args>]

Options
${flagHelp(createFlags)}

Prerequisite
  Run 'sanity login' or set SANITY_EMBEDDINGS_TOKEN environment variable prior to invoking the command.
  The user/token needs the following permissions:
  * create webhooks
  * create tokens
  * read datasets

Details
  This command will:

  * create an embeddings index matching the provided configuration
  * create a robot token that will be used for reading documents from the project (token is reused across indexes)
  * create a webhook matching the filter for keeping the embeddings index up to date
  * start indexing all documents matching the filter at the time of creation

  To see the progress of the initial indexing job, use the get command:
  $ ${binName} get --indexName <indexName>

Manifest file
  The --manifest file should be a json file matching the following schema:

  {
    indexName: string,
    dataset: string
    projection: string
    filter: string
  }

  projection should be a valid GROQ projection, WITH curly brackets, ie "{...}".
  filter should be a valid GROQ filter, WITHOUT square brackets, ie "_type=='myType'"

  Can be created with
  ${binName} manifest --out manifest.json --dataset <dataset> --indexName <indexName> --projection <projection> --filter <filter>

Examples
  # Create a new embeddings index
  ${binName} create --indexName my-index --dataset production --filter "_type='myType'" --projection "{...}"

  # Create a new embeddings index using a manifest.json
  # //embeddings-index.json, stored in the on the root of the Sanity project directory
  # {
  #   "indexName": "my-index",
  #   "dataset": "production",
  #   "projection": "{...}",
  #   "filter": "_type=='myType'"
  # }

  ${binName} create --manifest embeddings-index.json
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: createFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await create({basePath, flags: cli.flags})
}

export default run
