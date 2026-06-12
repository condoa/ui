import { describe, it, expect } from 'vitest'
import { slimIconMapSource } from '@/scripts/registry/transform.js'

describe('slimIconMapSource', () => {
    it('emits an icon map module for only the requested icons', () => {
        const out = slimIconMapSource(['icon-arrow-right', 'icon-loading'])
        expect(out).toContain(`import IconArrowRight from './svg/icon-arrow-right.svg?raw'`)
        expect(out).toContain(`import IconLoading from './svg/icon-loading.svg?raw'`)
        expect(out).toContain(`'icon-arrow-right': IconArrowRight`)
        expect(out).toContain('export default')
    })
})
