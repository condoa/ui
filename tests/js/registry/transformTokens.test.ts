import { describe, it, expect } from 'vitest'
import { extractThemeBlocks } from '@/scripts/registry/transform.js'

const css = `@layer base { body { color: red } }\n@theme {\n  --color-x: #fff;\n}\n@theme inline {\n  --color-background: var(--background);\n}\n`

describe('extractThemeBlocks', () => {
    it('returns every @theme block, brace-balanced', () => {
        const out = extractThemeBlocks(css)
        expect(out).toContain('@theme {')
        expect(out).toContain('--color-x: #fff;')
        expect(out).toContain('@theme inline {')
        expect(out).toContain('--color-background: var(--background);')
        expect(out).not.toContain('@layer base')
    })
})
