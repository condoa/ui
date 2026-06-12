import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// The registry build inlines every __('key') in a ui/ component into a literal
// string drawn from resources/js/scripts/registry/i18n.json. A key absent from
// that dict inlines as the raw key (e.g. 'form.today' instead of 'Hoje'), which
// compiles and passes every other gate but ships visibly broken UI. This test is
// the loud guard: every key the components use must resolve in the dict.
// Regenerate the dict with `npm run registry:i18n` when this fails.

const componentsDir = 'resources/js/common/components/ui'
const dictPath = 'resources/js/scripts/registry/i18n.json'

function collectKeys(dir: string): Map<string, string> {
    const keys = new Map<string, string>()
    const walk = (current: string) => {
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name)
            if (entry.isDirectory()) {
                walk(full)
            } else if (entry.name.endsWith('.vue')) {
                const src = fs.readFileSync(full, 'utf-8')
                for (const match of src.matchAll(/__\(\s*'([^']+)'\s*\)/g)) {
                    keys.set(match[1], full)
                }
            }
        }
    }
    walk(dir)
    return keys
}

describe('registry i18n dictionary', () => {
    const dict: Record<string, string> = JSON.parse(fs.readFileSync(dictPath, 'utf-8'))
    const usedKeys = collectKeys(componentsDir)

    it('resolves every __() key used by a ui component', () => {
        const missing = [...usedKeys].filter(([key]) => !(key in dict))
        expect(
            missing,
            `keys used in components but absent from ${dictPath} (run 'npm run registry:i18n'): ` +
                missing.map(([key, file]) => `${key} (${file})`).join(', '),
        ).toEqual([])
    })

    it('maps each key to a non-empty translation, not the key itself', () => {
        for (const [key, value] of Object.entries(dict)) {
            expect(value, `${key} resolves to an empty string`).not.toBe('')
            expect(value, `${key} resolves to the raw key (untranslated)`).not.toBe(key)
        }
    })
})
