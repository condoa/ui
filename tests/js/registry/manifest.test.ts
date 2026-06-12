import { describe, it, expect } from 'vitest'
import { buildManifest } from '@/scripts/registry/build.js'

describe('buildManifest', () => {
    it('assembles items into a versioned manifest', () => {
        const manifest = buildManifest([
            { name: 'base', type: 'base', files: ['base/x'], _written: [{ name: 'base/x', content: 'a' }] },
            { name: 'button', type: 'component', files: [{ from: 'a', to: 'b' }], dependencies: ['reka-ui'], registryDependencies: ['base'], icons: [], doc: null, _written: [{ name: 'button/b', content: 'c' }] },
        ])
        expect(manifest.version).toHaveLength(12)
        expect(manifest.items.map((i) => i.name).sort()).toEqual(['base', 'button'])
        const button = manifest.items.find((i) => i.name === 'button')
        expect(button.registryDependencies).toEqual(['base'])
        expect(button._written).toBeUndefined()
    })
})
