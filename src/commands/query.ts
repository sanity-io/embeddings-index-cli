import path from 'path'
import meow from 'meow'
import {query, queryFlags} from '../actions/query'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Query an embeddings index. Returns an array of document ids with relevance score.`

const help = `
Usage
  ${binName} query [<args>]

Options
${flagHelp(queryFlags)}

Examples
  # Find documents matching a query text
  ${binName} query --text "content relevant to the topic at hand"

  # Find documents matching a json document
  ${binName} query --text '{"_type": "myType", "title": "Some topic"}'
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: queryFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await query({basePath, flags: cli.flags})
}

export default run
