import { describe, it, expect } from 'vitest'
import { extractFromSource } from '@/scripts/registry/resolve.js'

const sfc = `
<template>
  <span>{{ __('badge.label') }}</span>
  <Icon name="icon-arrow-right" />
</template>
<script setup lang="ts">
import { cn } from '@/common/helpers/cn'
import { tv } from 'tailwind-variants'
import { thing } from './local'
const loadingIcon = 'icon-loading'
</script>
`

const sfcWithExportFrom = `
<script setup lang="ts">
export { Foo } from './foo'
export const z = 'hello'
</script>
`

describe('extractFromSource', () => {
    it('collects imports, icons, and i18n keys', () => {
        const r = extractFromSource(sfc, 'x.vue')
        expect(r.imports).toEqual(
            expect.arrayContaining(['@/common/helpers/cn', 'tailwind-variants', './local']),
        )
        expect([...r.icons].sort()).toEqual(['icon-arrow-right', 'icon-loading'])
        expect([...r.i18nKeys]).toEqual(['badge.label'])
    })

    it('collects export { X } from re-exports but not literal export const', () => {
        const r = extractFromSource(sfcWithExportFrom, 'x.vue')
        expect(r.imports).toContain('./foo')
        expect(r.imports).not.toContain('hello')
    })
})
