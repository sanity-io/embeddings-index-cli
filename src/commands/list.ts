import path from 'path'
import meow from 'meow'
import {listIndexes, listIndexesFlags} from '../actions/list'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Get the status of all existing existing embeddings indexes.`

const help = `
Usage
  ${binName} list [<args>]

Options
${flagHelp(listIndexesFlags)}

Examples
  # Get the status of all existing embeddings indexes for the current dataset
  ${binName} list
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: listIndexesFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await listIndexes({basePath, flags: cli.flags})
}

export default run
