# Sanity Embeddings CLI

CLI for the Sanity embeddings index API.

The embeddings index API allows the creation of named embeddings vector indexes.
An embeddings index contains embeddings for all Sanity documents matching a configured GROQ filter in a dataset.
A GROQ projection is applied to matching documents before vectorization.

Indexes can be queried using semantic text search, and returns a list of matching document ids,
sorted by relevance.

When an index is first created, all documents matching the configured filter will be synced into the index.
This can take some time depending on the number of documents that need to be synced.

## Installation

> npm i -D @sanity/embeddings-cli

## Usage

```bash
 $ embeddings-index --help
 
 Usage
    $ embeddings-index [--help] [--debug] <command> [<args>]

   These are common commands used in various situations:

     create          Create a new embeddings index
     delete          Delete an existing embeddings index
     list            List all embedding indexes
     get             Get a spesific embeddings index
     query           Query a embeddings index
     version         Show the version of @snorreeb/sanity-embeddings currently installed

   The commands have to be run in a Sanity project directory with a 'sanity.cli.(ts|js)' file.

   Options
     --verbose       Log everything. This option conflicts with --silent.
     --silent        Do not print info and warning messages.
     --debug         Print stack trace on errors.
     --version       Output the version number
     --help          Output usage information
```

See the individual commands for more, ie `embeddings-index create --help`.

### Using with `npx`

Use `npx @sanity/embeddings-index-cli` in place of `embeddings-index` in the commands.

Example:
```bash
npx @sanity/embeddings-index-cli --help
```

## License

[MIT](LICENSE) © Sanity.io



## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/sanity-io/embeddings-index-cli/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
