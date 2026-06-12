import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { resolveInstallSet } from '../src/registry.js'

const manifest = {
    version: 'vtest',
    items: [
        { name: 'base', type: 'base', registryDependencies: [] },
        { name: 'button', type: 'component', registryDependencies: ['base'] },
        { name: 'dialog', type: 'component', registryDependencies: ['base', 'button'] },
    ],
}

describe('resolveInstallSet', () => {
    it('expands transitive registryDependencies for dialog', () => {
        const got = resolveInstallSet(manifest, ['dialog']).sort()
        assert.deepEqual(got, ['base', 'button', 'dialog'])
    })

    it('resolves a single-level dependency for button', () => {
        const got = resolveInstallSet(manifest, ['button']).sort()
        assert.deepEqual(got, ['base', 'button'])
    })

    it('throws when an unknown component is requested', () => {
        assert.throws(() => resolveInstallSet(manifest, ['nope']), /nope/)
    })
})
