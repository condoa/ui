import fs from 'node:fs'
import path from 'node:path'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { globSync } from 'glob'
import { baseOwnedPaths, componentItems, folderItems } from './config.js'

// Ownership map: which registered item owns a given repo path. A folder item owns
// every file under its folder; a flat component item owns its entry file. Files that
// are neither (private colocated helpers like Button.variants.ts) are unowned and get
// inlined into whatever imports them. A resolved import owned by a DIFFERENT item is a
// registry dependency, not an inline.
const ownedFolders = folderItems.map((i) => ({
    name: i.name,
    prefix: `${i.folder.split(path.sep).join('/').replace(/\/$/, '')}/`,
}))
const ownedEntries = new Map(componentItems.map((i) => [i.entry.split(path.sep).join('/'), i.name]))

function ownerOfPath(resolved) {
    const p = resolved.split(path.sep).join('/')
    if (ownedEntries.has(p)) {
        return ownedEntries.get(p)
    }
    const folder = ownedFolders.find((f) => p.startsWith(f.prefix))
    return folder ? folder.name : null
}

export function classifyImport(spec) {
    if (spec.startsWith('node:')) {
        return { kind: 'builtin', name: spec }
    }
    if (spec.startsWith('@/')) {
        return { kind: 'alias', spec }
    }
    if (spec.startsWith('.')) {
        return { kind: 'relative', spec }
    }
    // bare specifier: npm package. Keep scope, drop subpath.
    const parts = spec.split('/')
    const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
    return { kind: 'npm', name }
}

const IMPORT_RE = /import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g
const EXPORT_FROM_RE = /export\s+[^'"]*?\bfrom\s+['"]([^'"]+)['"]/g
const ICON_RE = /['"](icon-[a-z0-9-]+)['"]/gi
const I18N_RE = /__\(\s*['"]([^'"]+)['"]/g

// Returns the JS to scan: script + scriptSetup for .vue, whole file otherwise.
function scriptOf(source, filename) {
    if (!filename.endsWith('.vue')) {
        return { script: source, template: '' }
    }
    const { descriptor } = parseSfc(source, { filename })
    const script = [descriptor.script?.content, descriptor.scriptSetup?.content]
        .filter(Boolean)
        .join('\n')
    return { script, template: descriptor.template?.content ?? '' }
}

export function extractFromSource(source, filename) {
    const { script, template } = scriptOf(source, filename)
    const all = `${script}\n${template}`

    const imports = []
    for (const m of script.matchAll(IMPORT_RE)) {
        imports.push(m[1])
    }
    for (const m of script.matchAll(EXPORT_FROM_RE)) {
        imports.push(m[1])
    }

    const icons = new Set()
    for (const m of all.matchAll(ICON_RE)) {
        icons.add(m[1].toLowerCase())
    }

    const i18nKeys = new Set()
    for (const m of all.matchAll(I18N_RE)) {
        i18nKeys.add(m[1])
    }

    return { imports, icons, i18nKeys }
}

const EXTS = ['', '.ts', '.vue', '.js', '/index.ts', '/index.js']

// Resolve a relative or @/ alias spec from the importing file to an existing repo path.
export function resolveSpec(spec, fromFile) {
    let base
    if (spec.startsWith('@/')) {
        base = path.join('resources/js', spec.slice(2))
    } else if (spec.startsWith('.')) {
        base = path.join(path.dirname(fromFile), spec)
    } else {
        return null
    }
    for (const ext of EXTS) {
        const candidate = `${base}${ext}`.split(path.sep).join('/')
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
            return candidate
        }
    }
    return null
}

// Breadth-first walk from one or more root files. Imports owned by base, or by a
// different registered item, become a registry dep and are not inlined. Imports owned
// by this same item (a folder's own siblings) or unowned (private colocated helpers)
// are inlined and followed. npm imports become dependencies; node: builtins are ignored.
function walkGraph(roots, selfName) {
    const files = new Set()
    const dependencies = new Set()
    const registryDependencies = new Set()
    const icons = new Set()
    const i18nKeys = new Set()
    const diagnostics = []

    const queue = roots.map((r) => r.split(path.sep).join('/'))
    const seen = new Set()

    while (queue.length) {
        const file = queue.shift()
        if (seen.has(file)) {
            continue
        }
        seen.add(file)
        files.add(file)

        const source = fs.readFileSync(file, 'utf-8')
        const ex = extractFromSource(source, file)
        for (const i of ex.icons) icons.add(i)
        for (const k of ex.i18nKeys) i18nKeys.add(k)

        for (const spec of ex.imports) {
            const c = classifyImport(spec)
            if (c.kind === 'builtin') {
                continue
            }
            if (c.kind === 'npm') {
                dependencies.add(c.name)
                continue
            }
            const resolved = resolveSpec(spec, file)
            if (!resolved) {
                // Unresolved local import: a self-containment hole. Recorded as a diagnostic.
                diagnostics.push({ kind: 'unresolved-import', file, spec })
                continue
            }
            if (baseOwnedPaths.has(resolved)) {
                registryDependencies.add('base')
                continue
            }
            const owner = ownerOfPath(resolved)
            if (owner && owner !== selfName) {
                registryDependencies.add(owner)
                continue
            }
            queue.push(resolved)
        }
    }

    return {
        files: [...files],
        dependencies: [...dependencies],
        registryDependencies: [...registryDependencies],
        icons: [...icons],
        i18nKeys: [...i18nKeys],
        diagnostics,
    }
}

export function resolveItem(item) {
    return { name: item.name, type: item.type, ...walkGraph([item.entry], item.name) }
}

// Resolve a foldered (composite) item: every .vue in the folder is a graph root,
// so auto-registered sibling sub-components are all captured even though the root
// component does not import them. Standalone family .ts modules (variants, context,
// hooks) are seeded as roots too, so a colocated module that no sibling .vue imports
// (for example Form/variants.ts, consumed only by external items) still ships with
// the item. Files reached via the import graph dedupe; .d.ts and tests are excluded.
export function resolveFolderItem(item) {
    const files = globSync(`${item.folder}/*.{vue,ts}`, {
        ignore: [`${item.folder}/*.d.ts`, `${item.folder}/*.spec.ts`, `${item.folder}/*.test.ts`],
    })
    const roots = files.map((p) => p.split(path.sep).join('/'))
    return { name: item.name, type: item.type, ...walkGraph(roots, item.name) }
}

// The production SFC compiler (@vue/compiler-sfc, used by the vite/rolldown build)
// rejects an ES module VALUE export inside <script setup>; vue-tsc (the type checker
// behind isolationCompile) tolerates it, so it slips past the isolation gate and
// then breaks every deploy at the build step (see the Rating.vue ratingStyles bug).
// Type-only exports (export type / export interface) are erased by the compiler and
// allowed. A focused structural check on the <script setup> content catches exactly
// this class with no false positives from type resolution (which the real build
// resolves via aliases and which a standalone compileScript cannot).
const SCRIPT_SETUP_VALUE_EXPORT = /^[ \t]*export[ \t]+(?:default\b|const\b|let\b|var\b|class\b|function\b|async[ \t]+function\b|\{)/m

export function sfcCompile(source, filename) {
    const { descriptor, errors } = parseSfc(source, { filename })
    if (errors.length > 0) {
        return { ok: false, error: String(errors[0]?.message ?? errors[0]) }
    }
    const setup = descriptor.scriptSetup?.content
    if (setup && SCRIPT_SETUP_VALUE_EXPORT.test(setup)) {
        return { ok: false, error: `<script setup> cannot contain ES module exports (${path.basename(filename)})` }
    }
    return { ok: true, error: null }
}
