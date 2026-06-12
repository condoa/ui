import { describe, it, expect } from 'vitest'
import { replaceI18n } from '@/scripts/registry/transform.js'

describe('replaceI18n', () => {
    const dict = { 'badge.label': 'Etiqueta', 'a.b': "L'item" }

    it('replaces __() calls with resolved literals, escaping quotes', () => {
        expect(replaceI18n(`{{ __('badge.label') }}`, dict)).toBe(`{{ 'Etiqueta' }}`)
        expect(replaceI18n(`x(__("a.b"))`, dict)).toBe(`x('L\\'item')`)
    })

    it('falls back to the key when missing', () => {
        expect(replaceI18n(`__('missing.key')`, dict)).toBe(`'missing.key'`)
    })
})
