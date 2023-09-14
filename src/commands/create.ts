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

Prerequisites
  Before invoking the command, either run 'sanity login', or set a 'SANITY_EMBEDDINGS_TOKEN' environment variable.
  The user/token needs the following permissions:
  * Create webhooks
  * Create tokens
  * Read datasets

Details
  The command performs the following actions:

  * Create an embeddings index matching the provided configuration.
  * Create a robot token to enable reading documents from the Sanity project (token is reused across indexes.)
  * Create a webhook matching the filter to automatically update the embeddings index.
  * Start indexing all documents matching the filter at the time of creation.

  To check the progress of the initial indexing job, pass the index name with the 'get' command:
  $ ${binName} get --indexName <name-of-the-index>

Manifest file
  Define an index configuration in a manifest file.
  The manifest file must be a valid JSON file with the following schema:

  {
    indexName: string,
    dataset: string,
    filter: string,
    projection: string
  }

  * indexName: the name of the embeddings index.
  * dataset: the dataset to index. Must be an existing dataset in the Sanity project.
  * filter: must be a valid GROQ filter WITHOUT square brackets. Ex: "_type=='myDocumentType'".
  * projection: must be a valid GROQ projection, including curly brackets. Ex: "{...}".

  To create a JSON manifest file, invoke the 'manifest' command:
  ${binName} manifest --out manifest.json --dataset <name-of-the-dataset> --indexName <name-of-the-index> --filter <GROQ-filter> --projection <GROQ-projection>

Examples
  # Create a new embeddings index matching all documents
  ${binName} create --indexName my-index --dataset production --filter "" --projection ""

  # Create a new embeddings index for a document type
  ${binName} create --indexName my-index --dataset production --filter "_type='myDocumentType'" --projection "{...}"

  # Create a new embeddings index using a manifest.json file
  # //manifest.json, stored in the Sanity project root directory
  # {
  #   "indexName": "my-index",
  #   "dataset": "production",
  #   "projection": "{...}",
  #   "filter": "_type=='myType'"
  # }

  ${binName} create --manifest manifest.json
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
