import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { add } from '../src/commands/add.js'

const manifest = {
    version: 'vtest',
    items: [
        { name: 'base', type: 'base', registryDependencies: [] },
        { name: 'button', type: 'component', registryDependencies: ['base'] },
    ],
}

const itemsByName = {
    base: {
        name: 'base',
        type: 'base',
        dependencies: [],
        registryDependencies: [],
        files: [{ path: 'common/lib/cn.ts', content: 'export const cn = () => {}\n' }],
    },
    button: {
        name: 'button',
        type: 'component',
        dependencies: [],
        registryDependencies: ['base'],
        files: [
            { path: 'common/components/Button.vue', content: '<template>btn</template>\n' },
            { path: 'common/components/button/index.ts', content: "export * from './Button.vue'\n" },
        ],
    },
}

let server
let port
let tmpDir

before(async () => {
    server = http.createServer((req, res) => {
        if (req.url === '/index.json') {
            res.writeHead(200, { 'content-type': 'application/json' })
            res.end(JSON.stringify(manifest))
            return
        }
        const match = req.url.match(/^\/r\/([^/]+)\.json$/)
        if (match && itemsByName[match[1]]) {
            res.writeHead(200, { 'content-type': 'application/json' })
            res.end(JSON.stringify(itemsByName[match[1]]))
            return
        }
        res.writeHead(404)
        res.end('not found')
    })

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    port = server.address().port
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'condoa-ui-add-'))
})

after(async () => {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('add integration', () => {
    it('installs button + transitive base and writes the lock', async () => {
        const target = path.join(tmpDir, 'resources/js')

        await add(tmpDir, ['button'], {
            registry: `http://127.0.0.1:${port}`,
            target,
        })

        assert.equal(
            fs.readFileSync(path.join(target, 'common/lib/cn.ts'), 'utf-8'),
            'export const cn = () => {}\n',
        )
        assert.equal(
            fs.readFileSync(path.join(target, 'common/components/Button.vue'), 'utf-8'),
            '<template>btn</template>\n',
        )
        assert.equal(
            fs.readFileSync(path.join(target, 'common/components/button/index.ts'), 'utf-8'),
            "export * from './Button.vue'\n",
        )

        const lock = JSON.parse(
            fs.readFileSync(path.join(tmpDir, 'registry.lock.json'), 'utf-8'),
        )
        assert.equal(lock.version, 'vtest')
        assert.ok(lock.items.includes('base'))
        assert.ok(lock.items.includes('button'))
    })

    it('rejects a re-install whose content changed under the same version, unless forced', async () => {
        const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'condoa-ui-tamper-'))
        const target = path.join(cwd, 'resources/js')
        const original = itemsByName.button.files[0].content

        await add(cwd, ['button'], { registry: `http://127.0.0.1:${port}`, target })

        // The registry now serves different bytes for button at the SAME version.
        itemsByName.button.files[0].content = '<template>pwned</template>\n'
        try {
            await assert.rejects(
                () => add(cwd, ['button'], { registry: `http://127.0.0.1:${port}`, target }),
                /integrity check failed/,
            )
            // The on-disk file must be untouched by the rejected install.
            assert.equal(
                fs.readFileSync(path.join(target, 'common/components/Button.vue'), 'utf-8'),
                original,
            )

            // --force accepts the new content and rewrites the lock.
            await add(cwd, ['button'], { registry: `http://127.0.0.1:${port}`, target, force: true })
            assert.equal(
                fs.readFileSync(path.join(target, 'common/components/Button.vue'), 'utf-8'),
                '<template>pwned</template>\n',
            )
        } finally {
            itemsByName.button.files[0].content = original
            fs.rmSync(cwd, { recursive: true, force: true })
        }
    })
})
