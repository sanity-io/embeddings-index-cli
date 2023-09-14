import meow from 'meow'
import log from './util/log'
import commands from './commands'
import {sharedFlags} from './sharedFlags'
import {binName} from './constants'
import execa from 'execa'
import path from 'path'
import {flagHelp} from './util/stringify'
import {ValidationError} from './util/error'

const help = `
Usage
  ${binName} [--help] [--debug] <command> [<args>]

Command list
  create          Create a new index
  delete          Delete an existing index
  list            List all indexes
  get             Get a specific index
  query           Query an index
  manifest        Create a JSON manifest file to define an index
  version         Show the currently installed version of ${binName}

  Run the commands in a Sanity project directory.

Command help
  ${binName} <command> --help

Options
${flagHelp(sharedFlags)}
  --version       Output the currently installed version of ${binName}

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
    if (err.response && cli.flags.debug) {
      log.error(JSON.stringify(err.response))
    }
    log.error(err instanceof TypeError || cli.flags.debug ? err.stack : err.message)

    if (err instanceof ValidationError) {
      log.info(`Run '${binName} ${commandName} --help' for usage details.`)
    }

    if (err?.response?.body?.message?.includes('Project is not allowed to use this feature')) {
      log.info(
        'Embeddings Index APIs are only available for Team and higher tiers. Upgrade your plan to enable access.',
      )
      log.info('https://sanity.io/pricing')
    }

    // eslint-disable-next-line no-process-exit
    process.exit(1)
  }
}
