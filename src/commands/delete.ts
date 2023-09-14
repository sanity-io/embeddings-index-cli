import path from 'path'
import meow from 'meow'
import {deleteFlags, deleteIndex} from '../actions/delete'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Delete an existing embeddings index and related webhook.`

const help = `
Usage
  ${binName} delete [<args>]

Options
${flagHelp(deleteFlags)}

Examples
  # Delete embeddings index for the default dataset in the project
  ${binName} delete --indexName my-index

  # Delete embeddings index defined in manifest.json 'indexName'
  ${binName} delete --manifest manifest.json
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: deleteFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await deleteIndex({basePath, flags: cli.flags})
}

export default run
