import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { CONFIG_FILE, DEFAULT_REGISTRY, writeConfig } from '../config.js'

const DEFAULT_TARGET = 'resources/js'
const DEFAULT_LOCK = 'registry.lock.json'

/**
 * Create components.json in the consumer's cwd.
 *
 * @param {string} cwd
 * @param {Record<string, string | boolean>} flags
 * @returns {Promise<void>}
 */
export async function init(cwd, flags) {
    const existing = path.join(cwd, CONFIG_FILE)
    if (fs.existsSync(existing) && !flags.force) {
        console.log(`${CONFIG_FILE} already exists`)
        return
    }

    let registry = flags.registry ?? DEFAULT_REGISTRY
    let target = DEFAULT_TARGET

    if (!flags.yes) {
        const rl = readline.createInterface({ input: stdin, output: stdout })
        try {
            const registryAnswer = await rl.question(`Registry URL [${registry}]: `)
            registry = registryAnswer.trim() || registry
            const targetAnswer = await rl.question(`Target directory [${target}]: `)
            target = targetAnswer.trim() || target
        } finally {
            rl.close()
        }
    }

    const config = { registry, target, lock: DEFAULT_LOCK }
    const written = writeConfig(cwd, config)
    console.log(`Wrote ${written}`)
}
