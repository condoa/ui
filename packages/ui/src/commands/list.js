import { resolveSettings } from '../config.js'
import { fetchManifest } from '../registry.js'

/**
 * Print the registry catalog.
 *
 * @param {string} cwd
 * @param {Record<string, string | boolean>} flags
 * @returns {Promise<void>}
 */
export async function list(cwd, flags) {
    const settings = resolveSettings(cwd, flags)
    const manifest = await fetchManifest(settings.registry)

    if (flags.json) {
        console.log(JSON.stringify(manifest.items, null, 2))
        return
    }

    const items = [...manifest.items].sort((a, b) => a.name.localeCompare(b.name))
    const width = items.reduce((max, item) => Math.max(max, item.name.length), 0)
    for (const item of items) {
        const deps = (item.registryDependencies ?? []).length
        console.log(`${item.name.padEnd(width)}  ${item.type}  (${deps} deps)`)
    }
    console.log(`${items.length} components, registry version ${manifest.version}`)
}
