/**
 * Strip a single trailing slash from a registry base URL.
 *
 * @param {string} registryUrl
 * @returns {string}
 */
function normalizeBase(registryUrl) {
    return registryUrl.replace(/\/$/, '')
}

/**
 * Fetch the registry manifest (index.json).
 *
 * @param {string} registryUrl
 * @returns {Promise<{ version: string, items: Array<object> }>}
 */
export async function fetchManifest(registryUrl) {
    const url = `${normalizeBase(registryUrl)}/index.json`
    let response
    try {
        response = await fetch(url)
    } catch (error) {
        throw new Error(`failed to reach registry at ${url}: ${error.message}`)
    }
    if (!response.ok) {
        throw new Error(`registry returned ${response.status} for ${url}`)
    }
    return response.json()
}

/**
 * Fetch a single registry item with inlined file contents.
 *
 * @param {string} registryUrl
 * @param {string} name
 * @returns {Promise<{ name: string, type: string, dependencies: string[], registryDependencies: string[], files: Array<{ path: string, content: string }> }>}
 */
export async function fetchItem(registryUrl, name) {
    const url = `${normalizeBase(registryUrl)}/r/${name}.json`
    let response
    try {
        response = await fetch(url)
    } catch (error) {
        throw new Error(`failed to reach registry at ${url}: ${error.message}`)
    }
    if (response.status === 404) {
        throw new Error(`unknown component '${name}'`)
    }
    if (!response.ok) {
        throw new Error(`registry returned ${response.status} for ${url}`)
    }
    return response.json()
}

/**
 * Expand the requested item names to include their transitive
 * registryDependencies. Ported from resources/js/scripts/registry/install.js.
 *
 * @param {{ items: Array<{ name: string, registryDependencies?: string[] }> }} manifest
 * @param {string[]} requested
 * @returns {string[]} the deduped install set (requested + transitive deps)
 */
export function resolveInstallSet(manifest, requested) {
    const byName = new Map(manifest.items.map((item) => [item.name, item]))
    const out = new Set()
    const visit = (name) => {
        if (out.has(name)) {
            return
        }
        const item = byName.get(name)
        if (!item) {
            throw new Error(`unknown component '${name}'`)
        }
        out.add(name)
        for (const dep of item.registryDependencies ?? []) {
            visit(dep)
        }
    }
    for (const name of requested) {
        visit(name)
    }
    return [...out]
}
