export function stringify(record: any, prettify: boolean) {
  return prettify ? JSON.stringify(record, null, 2) : JSON.stringify(record)
}

export function flagHelp(flags: Record<string, {description: string}>) {
  return Object.entries(flags)
    .map(([flag, {description}]) => `  --${flag.padEnd(14)}${description}`)
    .join('\n')
}
