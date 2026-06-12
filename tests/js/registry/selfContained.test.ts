import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { main } from '@/scripts/registry/build.js'
import { isolationCompile } from '@/scripts/registry/isolation.js'

// Every component item that must be fully self-contained for the UI registry:
// the 5 single-file atoms plus the 5 composite (foldered) families.
const atoms = ['button', 'badge', 'label', 'separator', 'input']
const composites = ['select', 'dialog', 'tooltip', 'table', 'card', 'checkbox', 'frame']
const batchA = [
    'dropdownmenu', 'popover', 'sheet', 'drawer', 'alertdialog', 'avatar', 'alert',
    'switch', 'progress', 'radiogroup', 'accordion', 'tabs', 'empty', 'pagination',
    'breadcrumbs', 'skeleton', 'textarea', 'toggle',
]
const batchB = [
    'command', 'contextmenu', 'navigationmenu', 'nav', 'sidebar', 'scrollarea', 'collapsible',
    'stepper', 'tree', 'treenode', 'list', 'cardlist', 'timeline', 'descriptionlist', 'group',
    'detailview', 'kbd', 'kbdgroup', 'chip', 'heading', 'divider', 'rating', 'container',
    'aspectratio', 'statblock', 'loader', 'placeholder',
]
const batchC = [
    'combobox', 'listbox', 'tagsinput', 'nativeselect', 'formselect',
    'numberfield', 'slider', 'currencyinput', 'decimalinput', 'numberinput', 'inputcontrol',
    'form', 'fieldset', 'inputgroup', 'editable',
]
const batchCVee = [
    'datefield', 'dateinput', 'datepicker', 'inputpin',
    'vee-input', 'vee-textarea', 'vee-checkbox', 'vee-select', 'vee-radiogroup',
    'vee-multiselect', 'vee-tagsinput', 'vee-numberfield', 'vee-vueformslider', 'vee-inputpin',
    'vee-currencyinput', 'vee-moneyinput', 'vee-numberinput', 'vee-datefield', 'vee-dateinput',
    'vee-datepicker', 'vee-datetimepicker', 'vee-calendarpicker', 'vee-phoneinput', 'vee-fileinput',
]
const batchD: string[] = [
    'chart', 'datatable', 'fullcalendar', 'pdfviewer', 'minisparkline',
    'signaturepad', 'imagelightbox', 'dropfile', 'codeblock', 'licenseplate',
    'datetimetooltip', 'dateperiodselector',
    'addressmap', 'addressautocomplete', 'vee-htmleditor', 'vee-markdowneditor',
]
const batchE: string[] = [
    'borderbeam', 'meteors', 'neongradientcard', 'retrogrid', 'gradientdivider', 'fancyicon',
    'clientonly', 'iframelazy', 'scrollspy', 'sonner', 'navbar', 'imagewithplaceholder',
]
const components = [...atoms, ...composites, ...batchA, ...batchB, ...batchC, ...batchCVee, ...batchD, ...batchE]

// A throwaway outRoot so the gate never touches the real registry build or its
// committed-artifact-free state. Built fresh in beforeAll, removed in afterAll.
const outRoot = 'registry/.selfcontained-test'

let manifest: ReturnType<typeof main>

// Recursively collect every emitted file path under an item's dist dir.
function emittedFiles(itemName: string): string[] {
    const root = path.join(outRoot, 'dist', itemName)
    const out: string[] = []
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name)
            if (entry.isDirectory()) {
                walk(full)
            } else {
                out.push(full)
            }
        }
    }
    walk(root)
    return out
}

beforeAll(() => {
    fs.rmSync(outRoot, { recursive: true, force: true })
    manifest = main(outRoot)
})

afterAll(() => {
    fs.rmSync(outRoot, { recursive: true, force: true })
})

describe('pilot components are self-contained for the registry', () => {
    it('every component item declares base as a registry dependency', () => {
        const componentItems = manifest.items.filter((i: { type: string }) => i.type === 'component')
        for (const item of componentItems) {
            expect(
                (item as { registryDependencies: string[] }).registryDependencies,
                `${item.name} is missing 'base' in registryDependencies`,
            ).toContain('base')
        }
    })

    it('dialog declares its cross-item dependency on button (template-only usage)', () => {
        const dialog = manifest.items.find((i: { name: string }) => i.name === 'dialog')
        expect(
            (dialog as { registryDependencies: string[] }).registryDependencies,
            'dialog must declare button (its close button uses <Button>)',
        ).toContain('button')
    })

    it.each(components)('compiles %s in isolation without auto-imports', (name) => {
        const result = isolationCompile(name, { outRoot })
        expect(result.ok, result.errors).toBe(true)
    })

    it.each(components)('emits %s with no @/utils import and no __() i18n call', (name) => {
        for (const file of emittedFiles(name)) {
            const content = fs.readFileSync(file, 'utf-8')
            expect(content, `${file} still imports from @/utils`).not.toContain('@/utils')
            expect(content, `${file} still contains an __() call`).not.toContain('__(')
        }
    })
}, 120_000)
