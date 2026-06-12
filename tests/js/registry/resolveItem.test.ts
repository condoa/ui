import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { resolveItem } from '@/scripts/registry/resolve.js'

const dir = 'resources/js/common/components/ui/__fixtures__'

beforeAll(() => {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/Demo.variants.ts`, `import { tv } from 'tailwind-variants'\nexport const demoStyles = tv({ base: 'x' })\n`)
    fs.writeFileSync(
        `${dir}/Demo.vue`,
        `<template><Icon name="icon-x" /></template>\n<script setup lang="ts">\nimport { cn } from '@/common/helpers/cn'\nimport Icon from '@/common/components/Icon.vue'\nimport { demoStyles } from './Demo.variants'\nimport { useForwardProps } from 'reka-ui'\n</script>\n`,
    )
    fs.writeFileSync(
        `${dir}/WithMissing.vue`,
        `<script setup lang="ts">\nimport { something } from './does-not-exist'\n</script>\n`,
    )
    fs.writeFileSync(
        `${dir}/WithBuiltin.vue`,
        `<script setup lang="ts">\nimport fs from 'node:fs'\n</script>\n`,
    )
})

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }))

describe('resolveItem', () => {
    it('collects own files, registry deps, npm deps, icons', () => {
        const r = resolveItem({ name: 'demo', type: 'component', entry: `${dir}/Demo.vue` })
        expect(r.files.sort()).toEqual([`${dir}/Demo.variants.ts`, `${dir}/Demo.vue`].sort())
        expect([...r.registryDependencies]).toEqual(['base'])
        expect([...r.dependencies].sort()).toEqual(['reka-ui', 'tailwind-variants'])
        expect([...r.icons]).toEqual(['icon-x'])
    })

    it('records unresolved imports in diagnostics', () => {
        const r = resolveItem({ name: 'missing', type: 'component', entry: `${dir}/WithMissing.vue` })
        expect(r.diagnostics).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ kind: 'unresolved-import', spec: './does-not-exist' }),
            ]),
        )
    })

    it('does not add node: builtins to dependencies', () => {
        const r = resolveItem({ name: 'builtin', type: 'component', entry: `${dir}/WithBuiltin.vue` })
        expect(r.dependencies).not.toContain('node:fs')
        expect(r.dependencies).toHaveLength(0)
    })
})
