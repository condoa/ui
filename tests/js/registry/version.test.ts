import { describe, it, expect } from 'vitest'
import { contentHash } from '@/scripts/registry/build.js'

describe('contentHash', () => {
    it('is deterministic and order-independent over name+content pairs', () => {
        const a = contentHash([{ name: 'a', content: 'x' }, { name: 'b', content: 'y' }])
        const b = contentHash([{ name: 'b', content: 'y' }, { name: 'a', content: 'x' }])
        expect(a).toBe(b)
        expect(a).toHaveLength(12)
        expect(contentHash([{ name: 'a', content: 'z' }])).not.toBe(a)
    })
})
