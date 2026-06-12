#!/usr/bin/env node
import { add } from '../src/commands/add.js'
import { init } from '../src/commands/init.js'
import { list } from '../src/commands/list.js'

const USAGE = `condoa-ui - install Condoa UI registry components

Usage:
  condoa-ui init [--registry <url>] [--yes] [--force]
  condoa-ui add <component...> [--registry <url>] [--target <dir>] [--dry-run] [--force]
  condoa-ui list [--registry <url>] [--json]

Commands:
  init    Create a components.json in the current directory.
  add     Install components (and their dependencies) into the target tree.
  list    Print the available components in the registry.

Options:
  --registry <url>  Base registry URL (overrides components.json).
  --target <dir>    Where the consumer's @/ root lives (default resources/js).
  --dry-run         Print the install plan without writing files.
  --force, --yes    Overwrite locally modified files.
  --json            (list) Print the raw items as JSON.
  --help, -h        Show this help.
`

/**
 * Parse argv into positionals and flags.
 * Supports `--key value`, `--key=value`, and boolean `--flag`.
 *
 * @param {string[]} args
 * @returns {{ _: string[], flags: Record<string, string | boolean> }}
 */
function parseArgs(args) {
    const positionals = []
    const flags = {}
    for (let i = 0; i < args.length; i += 1) {
        const arg = args[i]
        if (arg.startsWith('--')) {
            const body = arg.slice(2)
            const eq = body.indexOf('=')
            if (eq !== -1) {
                flags[body.slice(0, eq)] = body.slice(eq + 1)
            } else if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
                flags[body] = args[i + 1]
                i += 1
            } else {
                flags[body] = true
            }
        } else if (arg === '-h') {
            flags.help = true
        } else {
            positionals.push(arg)
        }
    }
    return { _: positionals, flags }
}

async function main() {
    const { _: positionals, flags } = parseArgs(process.argv.slice(2))
    const [command, ...rest] = positionals
    const cwd = process.cwd()

    if (flags.help || !command) {
        console.log(USAGE)
        process.exit(0)
    }

    switch (command) {
        case 'init':
            await init(cwd, flags)
            break
        case 'add':
            await add(cwd, rest, flags)
            break
        case 'list':
            await list(cwd, flags)
            break
        default:
            console.error(`Unknown command '${command}'`)
            console.log(USAGE)
            process.exit(1)
    }
}

main().catch((error) => {
    console.error(`Error: ${error.message}`)
    process.exit(1)
})
