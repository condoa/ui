import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pathToFileURL } from 'node:url'
import { baseItem, componentItems, folderItems } from './config.js'
import { resolveItem, resolveFolderItem } from './resolve.js'
import { replaceI18n, loadI18nDict, slimIconMapSource, buildTokensCss } from './transform.js'

// Keep only icon names that have a real SVG file (drops false positives like
// the 'icon-xs'/'icon-sm' button size-variant keys that match the icon pattern).
export function existingIcons(names, svgDir = 'resources/svg') {
    return [...new Set(names)].filter((name) => fs.existsSync(`${svgDir}/${name}.svg`))
}

// Deterministic 12-char hash over name+content pairs, independent of input order.
// Uses a plain byte comparison (not localeCompare) so the order, and thus the
// hash, does not depend on the host's ICU/locale.
export function contentHash(entries) {
    const h = crypto.createHash('sha256')
    const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    for (const e of [...entries].sort(byName)) {
        h.update(e.name)
        h.update(' ')
        h.update(e.content)
        h.update(' ')
    }
    return h.digest('hex').slice(0, 12)
}

function writeFile(dest, content) {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, content, 'utf-8')
}

// Map a source repo path to its target path inside an item dist dir, stripping resources/js prefixes.
function targetFor(srcPath) {
    return srcPath
        .replace(/^resources\/js\/common\/components\/ui\//, 'components/ui/')
        .replace(/^resources\/js\/common\//, 'common/')
        .replace(/^resources\/js\//, '')
}

export function buildBase(outRoot, iconNames) {
    const distDir = `${outRoot}/dist/base`
    const written = []
    const files = []

    for (const src of baseItem.files) {
        const target = targetFor(src)
        const content = fs.readFileSync(src, 'utf-8')
        writeFile(`${distDir}/${target}`, content)
        written.push({ name: `base/${target}`, content })
        files.push({ from: src, to: target })
    }

    const tokens = buildTokensCss()
    writeFile(`${distDir}/tokens.css`, tokens)
    written.push({ name: 'base/tokens.css', content: tokens })
    files.push({ from: 'generated:tokens.css', to: 'tokens.css' })

    const iconMap = slimIconMapSource(iconNames)
    writeFile(`${distDir}/icons.js`, iconMap)
    written.push({ name: 'base/icons.js', content: iconMap })
    files.push({ from: 'generated:icons.js', to: 'icons.js' })

    for (const icon of new Set(iconNames)) {
        const svgSrc = `resources/svg/${icon}.svg`
        if (fs.existsSync(svgSrc)) {
            const content = fs.readFileSync(svgSrc, 'utf-8')
            writeFile(`${distDir}/svg/${icon}.svg`, content)
            written.push({ name: `base/svg/${icon}.svg`, content })
            files.push({ from: svgSrc, to: `svg/${icon}.svg` })
        }
    }

    return {
        name: 'base',
        type: 'base',
        files,
        dependencies: ['clsx', 'tailwind-merge'],
        registryDependencies: [],
        _written: written,
    }
}

// Resolve the sibling .llm.txt for a component entry if present.
function docPathFor(entry) {
    const candidates = [
        entry.replace(/\.vue$/, '.llm.txt'),
        path.join(path.dirname(entry), `${path.basename(path.dirname(entry))}.llm.txt`),
    ]
    for (const c of candidates) {
        if (fs.existsSync(c)) {
            // Normalize separators so the manifest stays forward-slashed on Windows.
            return c.split(path.sep).join('/')
        }
    }
    return null
}

// The family doc for a folder item, e.g. Select/Select.llm.txt.
function folderDoc(folder) {
    const name = path.basename(folder)
    const candidate = `${folder}/${name}.llm.txt`
    return fs.existsSync(candidate) ? candidate : null
}

export function buildComponent(outRoot, item, i18nDict) {
    const desc = item.folder ? resolveFolderItem(item) : resolveItem(item)
    const distDir = `${outRoot}/dist/${item.name}`
    const written = []
    const files = []

    for (const src of desc.files) {
        const raw = fs.readFileSync(src, 'utf-8')
        const content = replaceI18n(raw, i18nDict)
        const finalTarget = targetFor(src)
        writeFile(`${distDir}/${finalTarget}`, content)
        written.push({ name: `${item.name}/${finalTarget}`, content })
        files.push({ from: src, to: finalTarget })
    }

    // Union resolved deps + base + any manual cross-item deps declared on the item
    // (for components used only as auto-registered template tags, which the import
    // walk cannot see, e.g. Dialog's close button uses <Button>).
    const registryDeps = [...new Set([...desc.registryDependencies, 'base', ...(item.registryDependencies ?? [])])].sort()

    return {
        name: desc.name,
        type: desc.type,
        files,
        dependencies: desc.dependencies.sort(),
        registryDependencies: registryDeps,
        icons: existingIcons(desc.icons).sort(),
        doc: item.folder ? folderDoc(item.folder) : docPathFor(item.entry),
        _written: written,
        _diagnostics: desc.diagnostics ?? [],
    }
}

export function buildManifest(items) {
    const written = items.flatMap((i) => i._written ?? [])
    const publicItems = items.map(({ _written, _diagnostics, ...rest }) => rest)
    // Fold each item's public metadata into the hash so a dependency, icon, or
    // doc change bumps the version even when no file content changed (otherwise a
    // version-keyed cache would serve a stale dependency graph).
    const metaEntries = publicItems.map((item) => ({
        name: `meta:${item.name}`,
        content: JSON.stringify(item),
    }))
    const version = contentHash([...written, ...metaEntries])
    return { version, items: publicItems }
}

export function main(outRoot = 'registry') {
    const i18nDict = loadI18nDict()

    // First pass over components to collect the union of icons, so base ships them all.
    const componentDescs = [...componentItems, ...folderItems].map((item) => buildComponent(outRoot, item, i18nDict))
    const allIcons = [...new Set(componentDescs.flatMap((d) => d.icons))]

    const base = buildBase(outRoot, allIcons)
    const manifest = buildManifest([base, ...componentDescs])

    fs.mkdirSync(`${outRoot}/items`, { recursive: true })
    for (const item of manifest.items) {
        writeFile(`${outRoot}/items/${item.name}.json`, JSON.stringify(item, null, 2))
    }
    writeFile(`${outRoot}/index.json`, JSON.stringify(manifest, null, 2))
    console.log(`registry: built ${manifest.items.length} items, version ${manifest.version}`)

    // Surface self-containment holes (imports the walk could not resolve). A clean
    // registry has none; any output here is a real gap to fix, not noise.
    const diagnostics = componentDescs.flatMap((d) => (d._diagnostics ?? []).map((x) => ({ item: d.name, ...x })))
    if (diagnostics.length > 0) {
        console.warn(`registry: ${diagnostics.length} diagnostic(s) (unresolved local imports):`)
        for (const d of diagnostics) {
            console.warn(`  [${d.item}] ${d.kind}: ${d.spec} (in ${d.file})`)
        }
    }

    return manifest
}

// Run when invoked directly (node resources/js/scripts/registry/build.js).
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main()
}
