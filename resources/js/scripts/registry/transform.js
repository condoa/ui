import fs from 'node:fs'

const I18N_CALL_RE = /__\(\s*['"]([^'"]+)['"]\s*\)/g

function jsString(value) {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

// Replace every __('key') call with the resolved literal string (or the key on miss).
export function replaceI18n(source, dict) {
    return source.replace(I18N_CALL_RE, (_, key) => jsString(dict[key] ?? key))
}

// Build a flat key to string dictionary. The dictionary is generated from the
// PHP lang files by scripts/build-registry-i18n.php and committed next to this
// module (so the OSS rebuild, which has no PHP, still resolves real strings).
export function loadI18nDict(jsonPath = 'resources/js/scripts/registry/i18n.json') {
    if (!fs.existsSync(jsonPath)) {
        return {}
    }
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
}

function pascal(name) {
    return name.replace(/-(\w)/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())
}

// Generate an icons.js module containing only the named icons, with SVGs colocated under ./svg.
export function slimIconMapSource(iconNames) {
    const names = [...new Set(iconNames)].sort()
    const imports = names
        .map((n) => `import ${pascal(n)} from './svg/${n}.svg?raw'`)
        .join('\n')
    const entries = names.map((n) => `    '${n}': ${pascal(n)},`).join('\n')
    return `${imports}\n\nexport default {\n${entries}\n}\n`
}

// Extract every top-level @theme { ... } block (including `@theme inline`) by brace balancing.
export function extractThemeBlocks(css) {
    const blocks = []
    const re = /@theme[^{]*\{/g
    let m
    while ((m = re.exec(css))) {
        let depth = 1
        let i = re.lastIndex
        while (i < css.length && depth > 0) {
            if (css[i] === '{') depth++
            else if (css[i] === '}') depth--
            i++
        }
        blocks.push(css.slice(m.index, i))
        re.lastIndex = i
    }
    return blocks.join('\n\n')
}

export function buildTokensCss(appCssPath = 'resources/css/app.css') {
    const css = fs.readFileSync(appCssPath, 'utf-8')
    return extractThemeBlocks(css)
}
