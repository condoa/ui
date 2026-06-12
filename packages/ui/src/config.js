import fs from 'node:fs'
import path from 'node:path'

export const CONFIG_FILE = 'components.json'
export const DEFAULT_REGISTRY = 'https://condoa.com.br/registry'

/**
 * Validate a registry URL: must be https, except http on loopback for local dev.
 * The CLI writes files drawn from this origin, so a downgraded/plaintext origin
 * is a MITM surface.
 *
 * @param {string} url
 * @returns {string} the same url if valid
 */
function validateRegistry(url) {
    let parsed
    try {
        parsed = new URL(url)
    } catch {
        throw new Error(`invalid registry URL: ${url}`)
    }
    const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname)
    if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLoopback)) {
        throw new Error(`registry must use https (got ${parsed.protocol}//) for ${url}`)
    }
    return url
}

/**
 * Read components.json from cwd. Returns the parsed config, or null if absent.
 *
 * @param {string} cwd
 * @returns {object | null}
 */
export function loadConfig(cwd) {
    const file = path.join(cwd, CONFIG_FILE)
    if (!fs.existsSync(file)) {
        return null
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

/**
 * Write components.json to cwd as pretty JSON with a trailing newline.
 *
 * @param {string} cwd
 * @param {object} cfg
 * @returns {string} the absolute path written
 */
export function writeConfig(cwd, cfg) {
    const file = path.join(cwd, CONFIG_FILE)
    fs.writeFileSync(file, `${JSON.stringify(cfg, null, 2)}\n`)
    return file
}

/**
 * Merge the saved config with CLI flags and defaults into a settings object.
 *
 * @param {string} cwd
 * @param {Record<string, string | boolean>} flags
 * @returns {{ registry: string, target: string, lock: string, force: boolean }}
 */
export function resolveSettings(cwd, flags) {
    const config = loadConfig(cwd)
    return {
        registry: validateRegistry(flags.registry ?? config?.registry ?? DEFAULT_REGISTRY),
        target: flags.target ?? config?.target ?? 'resources/js',
        lock: config?.lock ?? 'registry.lock.json',
        force: Boolean(flags.force || flags.yes),
    }
}
