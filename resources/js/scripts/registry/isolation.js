import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const require = createRequire(import.meta.url)

// Base-provided modules are declared as type shims, never compiled. Auto-imported
// symbols (cn, tv, Icon, computed, ...) are deliberately NOT declared, so any use
// of them without an explicit import becomes a compile error. That is the gate.
const SHIMS = `declare module '@/common/helpers/cn' {
  import type { ClassValue } from 'tailwind-variants'
  export function cn(...inputs: ClassValue[]): string
}
declare module '@/common/components/Icon.vue' {
  import type { DefineComponent } from 'vue'
  const Icon: DefineComponent<{ name?: string; class?: unknown }>
  export default Icon
}
declare module '@/icons' {
  const map: Record<string, string>
  export default map
}
declare module '*.svg?raw' {
  const content: string
  export default content
}
declare module '*.css' {}
declare module 'turndown'
`

const TSCONFIG = {
    compilerOptions: {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'bundler',
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: [],
        jsx: 'preserve',
    },
    include: ['**/*.ts', '**/*.vue', 'shims.d.ts'],
}

// Collect all transitive registry dependencies of an item, excluding base (provided
// as a type shim, never compiled) and the item itself.
function transitiveRegistryDeps(itemName, manifest, seen = new Set()) {
    const item = manifest.items.find((i) => i.name === itemName)
    if (!item) {
        return seen
    }
    for (const dep of item.registryDependencies ?? []) {
        if (dep === 'base' || seen.has(dep)) {
            continue
        }
        seen.add(dep)
        transitiveRegistryDeps(dep, manifest, seen)
    }
    return seen
}

// Copy every file under `src` into `dest`, preserving relative paths.
function copyTree(src, dest) {
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const from = path.join(src, entry.name)
        const to = path.join(dest, entry.name)
        if (entry.isDirectory()) {
            copyTree(from, to)
        } else {
            fs.mkdirSync(path.dirname(to), { recursive: true })
            fs.copyFileSync(from, to)
        }
    }
}

/**
 * Compile a built registry item in isolation, with the app's auto-imports disabled.
 *
 * @param {string} itemName
 * @param {{ outRoot?: string }} [options]
 * @returns {{ ok: boolean, errors: string }}
 */
export function isolationCompile(itemName, options = {}) {
    const outRoot = options.outRoot ?? 'registry'
    const itemDist = path.join(outRoot, 'dist', itemName)
    const workspace = path.join(outRoot, '.isolation', itemName)

    fs.rmSync(workspace, { recursive: true, force: true })
    fs.mkdirSync(workspace, { recursive: true })

    if (!fs.existsSync(itemDist)) {
        return { ok: false, errors: `item dist not found: ${itemDist}` }
    }

    copyTree(itemDist, workspace)

    // Include each transitive registry dependency's dist so cross-item relative imports
    // (for example ../Input.vue) resolve. Targets are canonical, so dependency files
    // land where the relative imports expect and never collide. base stays a shim.
    const manifestPath = path.join(outRoot, 'index.json')
    if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
        for (const dep of transitiveRegistryDeps(itemName, manifest)) {
            const depDist = path.join(outRoot, 'dist', dep)
            if (fs.existsSync(depDist)) {
                copyTree(depDist, workspace)
            }
        }
    }

    fs.writeFileSync(path.join(workspace, 'shims.d.ts'), SHIMS, 'utf-8')
    fs.writeFileSync(path.join(workspace, 'tsconfig.json'), JSON.stringify(TSCONFIG, null, 2), 'utf-8')

    // Run the vue-tsc JS entry directly under node (no shell, no npx) so the call
    // is cross-platform and free of shell-escaping concerns. The workspace lives
    // inside the repo, so node_modules (reka-ui, tailwind-variants, vue) resolves
    // up the tree. Capture the non-zero exit, do not throw.
    const vueTsc = require.resolve('vue-tsc/bin/vue-tsc.js')
    const result = spawnSync(process.execPath, [vueTsc, '--noEmit', '-p', path.join(workspace, 'tsconfig.json')], {
        encoding: 'utf-8',
    })

    const errors = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim()
    return { ok: result.status === 0, errors }
}
