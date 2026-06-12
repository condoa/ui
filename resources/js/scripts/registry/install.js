import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { main as buildRegistry } from './build.js'

// Expand requested item names to include their transitive registryDependencies.
export function resolveInstallSet(manifest, requested) {
    const byName = new Map(manifest.items.map((i) => [i.name, i]))
    const out = new Set()
    const visit = (name) => {
        if (out.has(name)) {
            return
        }
        const item = byName.get(name)
        if (!item) {
            throw new Error(`registry: unknown item '${name}'`)
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

// The canonical @/-relative path a file installs to in a target tree.
export function installDest(from) {
    if (from === 'generated:icons.js') {
        return 'icons.js'
    }
    if (from === 'generated:tokens.css') {
        return 'tokens.css'
    }
    // base SVGs install next to icons.js, which imports them via './svg/...'.
    if (from.startsWith('resources/svg/')) {
        return from.replace(/^resources\//, '')
    }
    return from.replace(/^resources\/js\//, '')
}

const OUT_ROOT = 'registry'

function readManifest() {
    const p = `${OUT_ROOT}/index.json`
    if (!fs.existsSync(p)) {
        return null
    }
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
}

// Ensure registry/dist exists for the requested set. Build if any item dir is
// missing. Returns true if a build ran (so callers re-read the refreshed manifest).
function ensureBuilt(itemNames) {
    const missing = itemNames.some((n) => !fs.existsSync(`${OUT_ROOT}/dist/${n}`))
    if (missing) {
        buildRegistry(OUT_ROOT)
        return true
    }
    return false
}

function writeFile(dest, content) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, content)
}

// Install the given items (plus transitive deps) into target, writing registry.lock.json.
export function installItems(requested, target) {
    let manifest = readManifest()
    if (!manifest) {
        throw new Error('registry: no manifest; run registry:build first')
    }
    const set = resolveInstallSet(manifest, requested)
    if (ensureBuilt(set)) {
        manifest = readManifest()
    }

    const byName = new Map(manifest.items.map((i) => [i.name, i]))
    for (const name of set) {
        const item = byName.get(name)
        for (const file of item.files) {
            const src = `${OUT_ROOT}/dist/${name}/${file.to}`
            const dest = `${target}/${installDest(file.from)}`
            writeFile(dest, fs.readFileSync(src))
        }
    }

    const lock = { version: manifest.version, items: set.sort() }
    writeFile(`${target}/registry.lock.json`, `${JSON.stringify(lock, null, 2)}\n`)
    return lock
}

// CLI: node install.js <target> <item> [<item> ...]
export function main(argv) {
    const [target, ...items] = argv
    if (!target || items.length === 0) {
        throw new Error('usage: registry:install <target> <item> [<item> ...]')
    }
    const lock = installItems(items, target)
    console.log(`registry: installed ${lock.items.length} items into ${target}, version ${lock.version}`)
    return lock
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main(process.argv.slice(2))
}
