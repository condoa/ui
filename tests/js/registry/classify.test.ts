import { describe, it, expect } from 'vitest'
import { classifyImport } from '@/scripts/registry/resolve.js'

describe('classifyImport', () => {
    it('treats bare specifiers as npm deps and strips subpaths', () => {
        expect(classifyImport('reka-ui')).toEqual({ kind: 'npm', name: 'reka-ui' })
        expect(classifyImport('tailwind-variants')).toEqual({ kind: 'npm', name: 'tailwind-variants' })
        expect(classifyImport('@vueuse/core')).toEqual({ kind: 'npm', name: '@vueuse/core' })
        expect(classifyImport('lodash/debounce')).toEqual({ kind: 'npm', name: 'lodash' })
    })

    it('treats relative specifiers as local', () => {
        expect(classifyImport('./Button.variants')).toEqual({ kind: 'relative', spec: './Button.variants' })
        expect(classifyImport('../Card/Card.vue')).toEqual({ kind: 'relative', spec: '../Card/Card.vue' })
    })

    it('treats @/ specifiers as alias', () => {
        expect(classifyImport('@/common/helpers/cn')).toEqual({ kind: 'alias', spec: '@/common/helpers/cn' })
    })

    it('treats node: builtins as builtin kind', () => {
        expect(classifyImport('node:fs')).toEqual({ kind: 'builtin', name: 'node:fs' })
        expect(classifyImport('node:path')).toEqual({ kind: 'builtin', name: 'node:path' })
    })
})
