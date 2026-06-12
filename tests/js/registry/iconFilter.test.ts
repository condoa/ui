import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { buildComponent } from '@/scripts/registry/build.js'

// Dedicated fixture dir so it never collides with __fixtures_build__
const fx = 'resources/js/common/components/ui/__fixtures_icons__'
const out = 'registry/.test-out-icons'

beforeAll(() => {
    fs.mkdirSync(fx, { recursive: true })
    // Component source references a real icon ('icon-loading', SVG exists) and a
    // fake one ('icon-zzz-not-real', no SVG) that happen to match the icon regex.
    fs.writeFileSync(
        `${fx}/IconFixture.vue`,
        `<template><span></span></template>\n` +
            `<script setup lang="ts">\n` +
            `import { cn } from '@/common/helpers/cn'\n` +
            `const realIcon = 'icon-loading'\n` +
            `const fakeIcon = 'icon-zzz-not-real'\n` +
            `</script>\n`,
    )
})

afterAll(() => {
    fs.rmSync(fx, { recursive: true, force: true })
    fs.rmSync(out, { recursive: true, force: true })
})

describe('buildComponent icon filter', () => {
    it('includes real icons and excludes icon names with no SVG on disk', () => {
        const item = buildComponent(
            out,
            { name: 'icon-fixture', type: 'component', entry: `${fx}/IconFixture.vue` },
            {},
        )

        expect(item.icons).toContain('icon-loading')
        expect(item.icons).not.toContain('icon-zzz-not-real')
    })
})
