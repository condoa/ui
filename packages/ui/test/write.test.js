import { afterEach, beforeEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { installFiles, readLock, verifyIntegrity, writeLock } from '../src/write.js'

const sha256 = (content) => crypto.createHash('sha256').update(content).digest('hex')

let dir

beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'condoa-ui-write-'))
})

afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
})

const items = [
    {
        name: 'base',
        files: [{ path: 'common/lib/cn.ts', content: 'export const cn = () => {}\n' }],
    },
    {
        name: 'button',
        files: [{ path: 'common/components/Button.vue', content: '<template>btn</template>\n' }],
    },
]

describe('installFiles', () => {
    it('writes files at target/path with nested dirs created', () => {
        const result = installFiles(items, { target: dir, force: false })

        assert.deepEqual(result.skipped, [])
        assert.deepEqual(result.written.sort(), ['common/components/Button.vue', 'common/lib/cn.ts'])
        assert.equal(
            fs.readFileSync(path.join(dir, 'common/lib/cn.ts'), 'utf-8'),
            'export const cn = () => {}\n',
        )
        assert.equal(
            fs.readFileSync(path.join(dir, 'common/components/Button.vue'), 'utf-8'),
            '<template>btn</template>\n',
        )
    })

    it('is idempotent over an unmodified file', () => {
        installFiles(items, { target: dir, force: false })
        const result = installFiles(items, { target: dir, force: false })

        assert.deepEqual(result.skipped, [])
        assert.equal(result.written.length, 2)
        assert.equal(
            fs.readFileSync(path.join(dir, 'common/lib/cn.ts'), 'utf-8'),
            'export const cn = () => {}\n',
        )
    })

    it('skips a locally modified file when force is false', () => {
        installFiles(items, { target: dir, force: false })
        const modified = path.join(dir, 'common/lib/cn.ts')
        fs.writeFileSync(modified, 'export const cn = () => 1\n')

        const result = installFiles(items, { target: dir, force: false })

        assert.ok(result.skipped.includes('common/lib/cn.ts'))
        assert.equal(fs.readFileSync(modified, 'utf-8'), 'export const cn = () => 1\n')
    })

    it('overwrites a locally modified file when force is true', () => {
        installFiles(items, { target: dir, force: false })
        const modified = path.join(dir, 'common/lib/cn.ts')
        fs.writeFileSync(modified, 'export const cn = () => 1\n')

        const result = installFiles(items, { target: dir, force: true })

        assert.deepEqual(result.skipped, [])
        assert.ok(result.written.includes('common/lib/cn.ts'))
        assert.equal(fs.readFileSync(modified, 'utf-8'), 'export const cn = () => {}\n')
    })

    it('refuses a path that traverses outside the target tree', () => {
        const evil = [{ name: 'evil', files: [{ path: '../escape.txt', content: 'x' }] }]

        assert.throws(() => installFiles(evil, { target: dir, force: false }), /outside the target/)
        assert.equal(fs.existsSync(path.join(dir, '..', 'escape.txt')), false)
    })

    it('refuses traversal even with force, and rejects absolute paths', () => {
        const traversal = [{ name: 'evil', files: [{ path: '../../pwned.txt', content: 'x' }] }]
        assert.throws(() => installFiles(traversal, { target: dir, force: true }), /outside the target/)

        const absolute = path.join(os.tmpdir(), 'condoa-ui-absolute-escape.txt')
        const absItems = [{ name: 'evil', files: [{ path: absolute, content: 'x' }] }]
        assert.throws(() => installFiles(absItems, { target: dir, force: false }), /outside the target/)
        assert.equal(fs.existsSync(absolute), false)
    })
})

describe('writeLock', () => {
    it('writes { version, items, files } with items sorted and per-file content hashes', () => {
        const file = writeLock(dir, { lock: 'registry.lock.json' }, {
            version: 'vtest',
            items: ['button', 'base'],
            files: [
                { path: 'common/lib/cn.ts', content: 'export const cn = () => {}\n' },
                { path: 'common/components/Button.vue', content: '<template>btn</template>\n' },
            ],
        })

        assert.equal(file, path.join(dir, 'registry.lock.json'))
        const parsed = JSON.parse(fs.readFileSync(file, 'utf-8'))
        assert.equal(parsed.version, 'vtest')
        assert.deepEqual(parsed.items, ['base', 'button'])
        assert.deepEqual(parsed.files, {
            'common/lib/cn.ts': sha256('export const cn = () => {}\n'),
            'common/components/Button.vue': sha256('<template>btn</template>\n'),
        })
    })
})

describe('readLock', () => {
    it('returns null when no lock exists', () => {
        assert.equal(readLock(dir, { lock: 'registry.lock.json' }), null)
    })

    it('round-trips a written lock', () => {
        writeLock(dir, { lock: 'registry.lock.json' }, {
            version: 'vtest',
            items: ['base'],
            files: [{ path: 'common/lib/cn.ts', content: 'x\n' }],
        })

        const lock = readLock(dir, { lock: 'registry.lock.json' })
        assert.equal(lock.version, 'vtest')
        assert.equal(lock.files['common/lib/cn.ts'], sha256('x\n'))
    })
})

describe('verifyIntegrity', () => {
    const lock = {
        version: 'vtest',
        items: ['base'],
        files: { 'common/lib/cn.ts': sha256('original\n') },
    }
    const tampered = [{ name: 'base', files: [{ path: 'common/lib/cn.ts', content: 'EVIL\n' }] }]

    it('throws when a file changed under the same registry version', () => {
        assert.throws(
            () => verifyIntegrity(lock, 'vtest', tampered, false),
            /integrity check failed/,
        )
    })

    it('does not throw when the version differs (a legitimate new release)', () => {
        assert.doesNotThrow(() => verifyIntegrity(lock, 'vNEXT', tampered, false))
    })

    it('does not throw when force is set', () => {
        assert.doesNotThrow(() => verifyIntegrity(lock, 'vtest', tampered, true))
    })

    it('does not throw when there is no prior lock', () => {
        assert.doesNotThrow(() => verifyIntegrity(null, 'vtest', tampered, false))
    })

    it('does not throw when content is unchanged', () => {
        const same = [{ name: 'base', files: [{ path: 'common/lib/cn.ts', content: 'original\n' }] }]
        assert.doesNotThrow(() => verifyIntegrity(lock, 'vtest', same, false))
    })
})
