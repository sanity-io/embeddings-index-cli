import path from 'path'
import meow from 'meow'
import {getIndex, getIndexFlags} from '../actions/get'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Get the status of an existing embeddings index.`

const help = `
Usage
  ${binName} get [<args>]

Options
${flagHelp(getIndexFlags)}

Examples
  # Get the status of the named index for the default dataset
  ${binName} create --indexName my-index

  # Get the status for index defined in manifest.json
  ${binName} delete --manifest manifest.json
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: getIndexFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await getIndex({basePath, flags: cli.flags})
}

export default run
