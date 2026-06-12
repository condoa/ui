import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { DEFAULT_REGISTRY, resolveSettings, writeConfig } from '../src/config.js'

let dir

beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'condoa-ui-config-'))
})

afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
})

describe('resolveSettings', () => {
    it('falls back to the default registry when no config and no flag', () => {
        const settings = resolveSettings(dir, {})

        assert.equal(settings.registry, DEFAULT_REGISTRY)
        assert.equal(settings.target, 'resources/js')
        assert.equal(settings.lock, 'registry.lock.json')
    })

    it('prefers a flag, then components.json, over the default', () => {
        writeConfig(dir, { registry: 'https://config.example/registry', target: 'src' })

        assert.equal(resolveSettings(dir, {}).registry, 'https://config.example/registry')
        assert.equal(
            resolveSettings(dir, { registry: 'https://flag.example/registry' }).registry,
            'https://flag.example/registry',
        )
    })

    it('rejects a plaintext http registry that is not loopback', () => {
        assert.throws(
            () => resolveSettings(dir, { registry: 'http://evil.example/registry' }),
            /must use https/,
        )
    })

    it('allows http only on loopback (for local dev servers)', () => {
        assert.equal(
            resolveSettings(dir, { registry: 'http://127.0.0.1:8080' }).registry,
            'http://127.0.0.1:8080',
        )
        assert.equal(
            resolveSettings(dir, { registry: 'http://localhost:3000/registry' }).registry,
            'http://localhost:3000/registry',
        )
    })

    it('rejects a malformed registry URL', () => {
        assert.throws(() => resolveSettings(dir, { registry: 'not a url' }), /invalid registry URL/)
    })
})
