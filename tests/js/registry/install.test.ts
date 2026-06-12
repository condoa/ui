import { describe, it, expect, afterEach } from 'vitest'
import fs from 'node:fs'
import { resolveInstallSet, installDest, installItems } from '@/scripts/registry/install.js'

const manifest = {
    version: 'v1',
    items: [
        { name: 'base', type: 'base', registryDependencies: [] },
        { name: 'button', type: 'component', registryDependencies: ['base'] },
        { name: 'dialog', type: 'component', registryDependencies: ['base', 'button'] },
    ],
}

describe('resolveInstallSet', () => {
    it('expands requested items to include transitive registry deps, deduped', () => {
        expect(resolveInstallSet(manifest, ['dialog']).sort()).toEqual(['base', 'button', 'dialog'])
        expect(resolveInstallSet(manifest, ['button']).sort()).toEqual(['base', 'button'])
    })

    it('throws on an unknown item', () => {
        expect(() => resolveInstallSet(manifest, ['nope'])).toThrow(/nope/)
    })
})

describe('installDest', () => {
    it('maps a source-derived from path to its @/-relative dest', () => {
        expect(installDest('resources/js/common/components/ui/Button.vue')).toBe('common/components/ui/Button.vue')
        expect(installDest('resources/js/common/helpers/cn.ts')).toBe('common/helpers/cn.ts')
    })
    it('maps generated sentinels to root files', () => {
        expect(installDest('generated:icons.js')).toBe('icons.js')
        expect(installDest('generated:tokens.css')).toBe('tokens.css')
    })
    it('maps base svgs next to icons.js (./svg/...)', () => {
        expect(installDest('resources/svg/icon-loading.svg')).toBe('svg/icon-loading.svg')
    })
})

describe('installItems', () => {
    const target = 'registry/.test-install-target'
    afterEach(() => fs.rmSync(target, { recursive: true, force: true }))

    it('copies dist files to canonical paths and writes a lockfile', () => {
        // Uses the real built registry; build first.
        const lock = installItems(['button'], target)
        expect(fs.existsSync(`${target}/common/components/ui/Button.vue`)).toBe(true)
        expect(fs.existsSync(`${target}/common/components/ui/Button.variants.ts`)).toBe(true)
        // base came transitively
        expect(fs.existsSync(`${target}/common/helpers/cn.ts`)).toBe(true)
        expect(fs.existsSync(`${target}/common/components/Icon.vue`)).toBe(true)
        expect(fs.existsSync(`${target}/icons.js`)).toBe(true)
        expect(fs.existsSync(`${target}/tokens.css`)).toBe(true)
        // base icons.js imports SVGs via './svg/...'; each must resolve in the target.
        const iconsModule = fs.readFileSync(`${target}/icons.js`, 'utf-8')
        const svgImports = [...iconsModule.matchAll(/from '\.\/(svg\/[^']+)\?raw'/g)].map((m) => m[1])
        expect(svgImports.length).toBeGreaterThan(0)
        for (const rel of svgImports) {
            expect(fs.existsSync(`${target}/${rel}`), `${rel} missing in target`).toBe(true)
        }
        const onDisk = JSON.parse(fs.readFileSync(`${target}/registry.lock.json`, 'utf-8'))
        expect(onDisk.items).toContain('button')
        expect(onDisk.items).toContain('base')
        expect(onDisk.version).toBe(lock.version)
    })
})
