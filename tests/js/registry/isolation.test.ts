import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { isolationCompile } from '@/scripts/registry/isolation.js'

// A throwaway outRoot so the self-test never touches the real registry build.
const outRoot = 'registry/.iso-selftest'

function writeItem(name: string, files: Record<string, string>) {
    for (const [rel, content] of Object.entries(files)) {
        const dest = path.join(outRoot, 'dist', name, rel)
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.writeFileSync(dest, content, 'utf-8')
    }
}

beforeAll(() => {
    fs.rmSync(outRoot, { recursive: true, force: true })

    // GOOD: imports `cn` explicitly from the base-provided module and uses it.
    writeItem('good', {
        'components/ui/Good.vue': `<template>\n    <div :class="cn('a', 'b')" />\n</template>\n<script setup lang="ts">\nimport { cn } from '@/common/helpers/cn'\nconst _x = cn('a')\n</script>\n`,
    })

    // BAD: uses `cn(...)` WITHOUT importing it, simulating reliance on auto-imports.
    writeItem('bad', {
        'components/ui/Bad.vue': `<template>\n    <div :class="cn('a', 'b')" />\n</template>\n<script setup lang="ts">\nconst _x = cn('a')\n</script>\n`,
    })
})

afterAll(() => {
    fs.rmSync(outRoot, { recursive: true, force: true })
})

describe('isolationCompile', () => {
    it('passes a self-contained item that imports cn explicitly', () => {
        const result = isolationCompile('good', { outRoot })
        expect(result.ok, result.errors).toBe(true)
    })

    it('fails an item that relies on an auto-imported cn', () => {
        const result = isolationCompile('bad', { outRoot })
        expect(result.ok).toBe(false)
        expect(result.errors).toContain('cn')
    })
}, 60_000)
