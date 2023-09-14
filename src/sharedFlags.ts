import {TypedFlags} from 'meow'

export const sharedFlags = {
  verbose: {
    type: 'boolean',
    default: false,
    description: 'Log everything. This option conflicts with --silent',
  },
  silent: {
    type: 'boolean',
    default: false,
    description: 'Do not print info and warning messages. This option conflicts with --verbose',
  },
  debug: {
    default: false,
    type: 'boolean',
    description: 'Print stack trace on errors',
  },
  help: {
    default: false,
    type: 'boolean',
    description: 'Output usage information',
  },
} as const

export type SharedFlags = TypedFlags<typeof sharedFlags>

export const sharedIndexFlags = {
  manifest: {
    type: 'string',
    description:
      'Path to a JSON manifest file describing the embeddings index. Command-line provided overrides take precedence.',
  },
  indexName: {
    type: 'string',
    description: 'Name of the index.',
  },
  dataset: {
    type: 'string',
    description:
      'Dataset used to create the embeddings index. Defaults to the value found in sanity.cli.(js|ts) for the project.',
  },
  prettify: {
    type: 'boolean',
    default: false,
    description: 'Format JSON responses.',
  },
} as const

export type SharedIndexFlags = TypedFlags<typeof sharedIndexFlags>
