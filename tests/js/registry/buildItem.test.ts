import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { buildComponent } from '@/scripts/registry/build.js'

const fx = 'resources/js/common/components/ui/__fixtures_build__'
const out = 'registry/.test-out-builditem'

beforeAll(() => {
    fs.mkdirSync(fx, { recursive: true })
    fs.writeFileSync(`${fx}/Demo.variants.ts`, `import { tv } from 'tailwind-variants'\nexport const demoStyles = tv({ base: 'x' })\n`)
    fs.writeFileSync(
        `${fx}/Demo.vue`,
        `<template><span>{{ __('demo.hi') }}</span></template>\n<script setup lang="ts">\nimport { cn } from '@/common/helpers/cn'\nimport { demoStyles } from './Demo.variants'\n</script>\n`,
    )
})

afterAll(() => {
    fs.rmSync(fx, { recursive: true, force: true })
    fs.rmSync(out, { recursive: true, force: true })
})

describe('buildComponent', () => {
    it('emits transformed files and a correct descriptor', () => {
        const item = buildComponent(out, { name: 'demo', type: 'component', entry: `${fx}/Demo.vue` }, { 'demo.hi': 'Olá' })
        const vue = fs.readFileSync(`${out}/dist/demo/components/ui/__fixtures_build__/Demo.vue`, 'utf-8')
        expect(vue).toContain(`'Olá'`)
        expect(vue).not.toContain('__(')
        expect(item.registryDependencies).toContain('base')
        expect(item.dependencies).toContain('tailwind-variants')
    })
})
