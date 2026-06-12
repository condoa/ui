import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { buildComponent } from '@/scripts/registry/build.js'

const dir = 'resources/js/common/components/ui/__fixtures_buildfolder__'
const out = 'registry/.test-out-buildfolder'

beforeAll(() => {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/Root.vue`, `<template><span /></template>\n<script setup lang="ts">\nimport { useForwardProps } from 'reka-ui'\n</script>\n`)
    fs.writeFileSync(`${dir}/Part.vue`, `<template><span>{{ __('a.b') }}</span></template>\n<script setup lang="ts">\nimport { computed } from 'vue'\n</script>\n`)
})

afterAll(() => {
    fs.rmSync(dir, { recursive: true, force: true })
    fs.rmSync(out, { recursive: true, force: true })
})

describe('buildComponent for a folder item', () => {
    it('emits every folder file and applies transforms', () => {
        const item = buildComponent(out, { name: 'demofolder', type: 'component', folder: dir }, { 'a.b': 'AB' })
        const targets = item.files.map((f) => f.to).sort()
        expect(targets).toContain('components/ui/__fixtures_buildfolder__/Root.vue')
        expect(targets).toContain('components/ui/__fixtures_buildfolder__/Part.vue')
        const part = fs.readFileSync(`${out}/dist/demofolder/components/ui/__fixtures_buildfolder__/Part.vue`, 'utf-8')
        expect(part).toContain(`'AB'`)
        expect(part).not.toContain('__(')
    })
})
