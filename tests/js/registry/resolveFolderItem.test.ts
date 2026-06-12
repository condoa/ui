import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { resolveFolderItem } from '@/scripts/registry/resolve.js'

const dir = 'resources/js/common/components/ui/__fixtures_folder__'

beforeAll(() => {
    fs.mkdirSync(dir, { recursive: true })
    // Root-ish part that imports base Icon and a sibling.
    fs.writeFileSync(
        `${dir}/Root.vue`,
        `<template><Icon name="icon-loading" /><Child /></template>\n<script setup lang="ts">\nimport Icon from '@/common/components/Icon.vue'\nimport { useForwardProps } from 'reka-ui'\n</script>\n`,
    )
    // A sibling part not imported by Root: must still be included via the folder glob.
    fs.writeFileSync(
        `${dir}/Child.vue`,
        `<template><span>{{ __('x.y') }}</span></template>\n<script setup lang="ts">\nimport { computed } from 'vue'\n</script>\n`,
    )
})

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }))

describe('resolveFolderItem', () => {
    it('collects every .vue in the folder as files, even ones not imported by any root', () => {
        const r = resolveFolderItem({ name: 'demo', type: 'component', folder: dir })
        expect(r.files.sort()).toEqual([`${dir}/Child.vue`, `${dir}/Root.vue`].sort())
    })

    it('unions deps, registry deps, and icons across the folder', () => {
        const r = resolveFolderItem({ name: 'demo', type: 'component', folder: dir })
        expect([...r.dependencies].sort()).toEqual(['reka-ui', 'vue'])
        expect(r.registryDependencies).toContain('base')
        expect(r.icons).toContain('icon-loading')
        expect([...r.i18nKeys]).toContain('x.y')
    })
})
