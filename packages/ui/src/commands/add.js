import { resolveSettings } from '../config.js'
import { fetchItem, fetchManifest, resolveInstallSet } from '../registry.js'
import { installFiles, readLock, verifyIntegrity, writeLock } from '../write.js'

/**
 * Install one or more components (plus transitive deps) into the target tree.
 *
 * @param {string} cwd
 * @param {string[]} names
 * @param {Record<string, string | boolean>} flags
 * @returns {Promise<void>}
 */
export async function add(cwd, names, flags) {
    if (names.length === 0) {
        throw new Error('specify at least one component, e.g. `condoa-ui add button`')
    }

    const settings = resolveSettings(cwd, flags)
    const manifest = await fetchManifest(settings.registry)
    const set = resolveInstallSet(manifest, names)

    if (flags['dry-run']) {
        console.log(`Would install ${set.length} component(s): ${set.join(', ')}`)
        const items = await Promise.all(set.map((name) => fetchItem(settings.registry, name)))
        for (const item of items) {
            for (const file of item.files) {
                console.log(`  ${file.path}`)
            }
        }
        return
    }

    const items = await Promise.all(set.map((name) => fetchItem(settings.registry, name)))
    verifyIntegrity(readLock(cwd, settings), manifest.version, items, settings.force)
    const { written, skipped } = installFiles(items, settings)
    writeLock(cwd, settings, {
        version: manifest.version,
        items: set,
        files: items.flatMap((item) => item.files),
    })

    console.log(
        `Installed ${written.length} file(s) for ${set.length} component(s) (${set.join(', ')}). ` +
            `Lock at ${settings.lock}, version ${manifest.version}.`,
    )

    if (skipped.length > 0) {
        console.log(`Skipped ${skipped.length} modified file(s); re-run with --force to overwrite:`)
        for (const file of skipped) {
            console.log(`  ${file}`)
        }
    }
}
