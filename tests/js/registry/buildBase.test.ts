import { describe, it, expect, afterEach } from 'vitest'
import fs from 'node:fs'
import { buildBase } from '@/scripts/registry/build.js'

const out = 'registry/.test-out-buildbase'

afterEach(() => fs.rmSync(out, { recursive: true, force: true }))

describe('buildBase', () => {
    it('emits cn, Icon, tokens.css and a slim icon map for the given icons', () => {
        const item = buildBase(out, ['icon-loading'])
        expect(fs.existsSync(`${out}/dist/base/common/helpers/cn.ts`)).toBe(true)
        expect(fs.existsSync(`${out}/dist/base/common/components/Icon.vue`)).toBe(true)
        expect(fs.existsSync(`${out}/dist/base/tokens.css`)).toBe(true)
        expect(fs.existsSync(`${out}/dist/base/icons.js`)).toBe(true)
        expect(fs.existsSync(`${out}/dist/base/svg/icon-loading.svg`)).toBe(true)
        expect(item.name).toBe('base')
        expect(item.type).toBe('base')
        expect(item.files.every((f: unknown) => typeof f === 'object' && f !== null && 'from' in f && 'to' in f)).toBe(true)
    })
})
