import path from 'path'
import meow from 'meow'
import {binName} from '../constants'
import {flagHelp} from '../util/stringify'
import {createManifest, manifestFlags} from '../actions/manifest'

const description = `Create a manifest JSON file that can be used with --manifest argument for other commands.`

const help = `
Usage
  ${binName} manifest [<args>]

Options
${flagHelp(manifestFlags)}

Examples
  # Create a manifest file
  ${binName} manifest --out manifest.json --indexName my-index --dataset production --filter "_type='myType'" --projection "{...}"

  # Create a manifest file based on another manifest.json
  ${binName} manifest --out manifest-2.json --indexName my-index-2 --filter "!(_type in ['myType'])"
`

async function run({argv}: {argv: string[]}) {
  const cli = meow(help, {flags: manifestFlags, argv, description})
  if (cli.flags.help) {
    cli.showHelp()
    return
  }

  const basePath = path.resolve(cli.input[0] || process.cwd())

  await createManifest({basePath, flags: cli.flags})
}

export default run
