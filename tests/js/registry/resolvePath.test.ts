import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { resolveSpec } from '@/scripts/registry/resolve.js'

describe('resolveSpec', () => {
    it('resolves @/ alias to a repo path, trying extensions', () => {
        // cn.ts exists
        expect(resolveSpec('@/common/helpers/cn', 'resources/js/common/components/ui/Button.vue'))
            .toBe('resources/js/common/helpers/cn.ts')
    })

    it('resolves relative .vue siblings', () => {
        expect(resolveSpec('./Trigger.vue', 'resources/js/common/components/ui/Select/Select.vue'))
            .toBe('resources/js/common/components/ui/Select/Trigger.vue')
    })

    it('returns null for unresolved paths', () => {
        expect(resolveSpec('./nope', 'resources/js/common/components/ui/Button.vue')).toBeNull()
    })

    it('returns null for a directory (no bare-directory match)', () => {
        // resources/js/common is a directory; no common.ts file exists at that level
        expect(resolveSpec('@/common', 'resources/js/common/components/ui/Button.vue')).toBeNull()
    })

    it('returns the file, not the directory, when both exist', () => {
        // A real file+dir pair: foo.ts (file) and foo/ (dir) side by side. The bare
        // directory candidate fails the isFile() check, so the .ts file must win.
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'resolve-spec-'))
        try {
            fs.mkdirSync(path.join(dir, 'foo'))
            fs.writeFileSync(path.join(dir, 'foo.ts'), '')
            const fromFile = path.join(dir, 'caller.vue')
            const expected = path.join(dir, 'foo.ts').split(path.sep).join('/')

            expect(resolveSpec('./foo', fromFile)).toBe(expected)
        } finally {
            fs.rmSync(dir, { recursive: true, force: true })
        }
    })
})
