import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import { globSync } from 'glob'
import { sfcCompile } from '@/scripts/registry/resolve.js'

// Every UI component must compile with @vue/compiler-sfc - the SFC compiler the
// production vite/rolldown build uses. vue-tsc (the type checker behind the
// isolation gate) tolerates an ES module value export inside <script setup>, but
// compileScript and the real build reject it, which silently fails every deploy.
// This gate runs the actual production compile so that class of error is caught
// here, never at deploy time. See the Rating.vue regression (ratingStyles was an
// `export const` inside <script setup>).

describe('sfcCompile mirrors the production SFC compiler', () => {
    it('rejects an ES module export inside <script setup>', () => {
        const bad = `<script setup lang="ts">\nexport const styles = { a: 1 }\n</script>\n<template><div /></template>\n`
        const result = sfcCompile(bad, 'Bad.vue')
        expect(result.ok).toBe(false)
        expect(result.error).toMatch(/export/i)
    })

    it('allows exports in a separate (non-setup) <script> block', () => {
        const good = `<script lang="ts">\nexport const styles = { a: 1 }\n</script>\n<script setup lang="ts">\nconst x = styles\n</script>\n<template><div /></template>\n`
        expect(sfcCompile(good, 'Good.vue').ok).toBe(true)
    })

    it('passes template-only components (no script)', () => {
        expect(sfcCompile('<template><div /></template>\n', 'Tpl.vue').ok).toBe(true)
    })
})

const componentFiles = globSync('resources/js/common/components/ui/**/*.vue', {
    ignore: ['**/__fixtures*/**'],
}).sort()

describe('every UI component compiles with the production SFC compiler', () => {
    it('finds the component source files', () => {
        expect(componentFiles.length).toBeGreaterThan(100)
    })

    it.each(componentFiles)('compiles %s', (file) => {
        const result = sfcCompile(fs.readFileSync(file, 'utf-8'), file)
        expect(result.ok, `${file}: ${result.error}`).toBe(true)
    })
})
