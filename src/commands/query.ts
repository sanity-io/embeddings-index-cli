import path from 'path'
import meow from 'meow'
import {query, queryFlags} from '../actions/query'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'

const description = `Query an embeddings index. Returns an array of document IDs with their relevance score.`

const help = `
Usage
  ${binName} query [<args>]

Options
${flagHelp(queryFlags)}

Examples
  # Retrieve relevant documents matching a text string query
  ${binName} query --text "content relevant to the topic at hand"

  # Retrieve relevant documents matching a JSON document
  ${binName} query --text '{"_type": "myDocumentType", "title": "My favorite topic"}'
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
