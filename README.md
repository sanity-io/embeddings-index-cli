# Sanity Embeddings Index CLI

CLI for the Sanity Embeddings Index API.

The Embeddings Index API enables creating named embeddings vector indexes.

An embeddings index contains embeddings for all Sanity documents matching a configured [GROQ filter](https://www.sanity.io/docs/how-queries-work) in a dataset.
A [GROQ projection](https://www.sanity.io/docs/query-cheat-sheet) is applied to matching documents before vectorization.

You can query indexes using semantic text search to obtain a list of matching document IDs sorted by relevance.

When an index is first created, all documents matching the configured filter are synced into the index.
Creating an index can take time, depending on the number of existing documents and the indexer load.

> Using this feature requires Sanity to send data to OpenAI.com, and Pinecone.io for storing vector interpretations of documents.

## Installation

```sh
npm i -D @sanity/embeddings-index-cli
```
## Usage

```bash
 $ embeddings-index --help
 
 Usage
    $ embeddings-index [--help] [--debug] <command> [<args>]

   These are common commands for CRUD operations on embeddings indexes:

     create          Create a new embeddings index
     delete          Delete an existing embeddings index
     list            List all embedding indexes
     get             Get a specific embeddings index
     query           Query an embeddings index
     version         Show the currently installed version of Embeddings Index CLI

   Run the commands in a Sanity project directory with a 'sanity.cli.(ts|js)' file.

   Options
     --verbose       Log everything. This option conflicts with --silent
     --silent        Do not print info and warning messages. This option conflicts with --verbose
     --debug         Print stack trace on errors
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
