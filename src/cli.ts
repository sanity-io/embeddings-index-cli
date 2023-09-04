import meow from 'meow'
import log from './util/log'
import commands from './commands'
import {sharedFlags} from './sharedFlags'
import {binName, packageName} from './constants'
import execa from 'execa'
import path from 'path'
import {flagHelp} from './util/stringify'

const help = `
Usage
  ${binName} [--help] [--debug] <command> [<args>]

Command list:

  create          Create a new index
  delete          Delete an existing index
  list            List all indexes
  get             Get a specific index
  query           Query an index
  manifest        Create a manifest JSON file for use with other commands
  version         Show the version of ${binName} currently installed

  The commands has to be run in a Sanity project directory.

Options
${flagHelp(sharedFlags)}
  --version       Output the version number

`

/**
 * @public
 */
export async function cliEntry(argv = process.argv) {
  const args = argv.slice(2)

  const cli = meow(help, {
    autoHelp: false,
    flags: sharedFlags,
    argv: args,
  })

  const commandName = cli.input[0]
  if (!commandName) {
    cli.showHelp() // Exits
  }

  if (!(commandName in commands)) {
    console.error(`Unknown command "${commandName}"`)
    cli.showHelp() // Exits
  }

  if (cli.flags.silent && cli.flags.verbose) {
    log.error(`--silent and --verbose are mutually exclusive`)
    cli.showHelp() // Exits
  }

  const rerunWithSanityExec = !args.some((a) => a === '--skipExec')
  if (rerunWithSanityExec) {
    const basePath = path.resolve(process.cwd())
    const binPath = process.argv[1]

    const proc = execa(
      'sanity',
      ['exec', binPath, '--', ...argv.slice(2), '--skipExec', '--with-user-token'],
      {
        cwd: basePath,
        stdio: 'inherit',
        reject: false,
      },
    )
    const result = await proc
    // eslint-disable-next-line no-process-exit
    process.exit(result.exitCode)
    return
  }

  // Lazy-load command
  const cmd = commands[commandName as keyof typeof commands]

  try {
    log.setVerbosity(cli.flags)
    await cmd({argv: argv.slice(3)})
  } catch (err: any) {
    log.error(err instanceof TypeError || cli.flags.debug ? err.stack : err.message)

    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
}
