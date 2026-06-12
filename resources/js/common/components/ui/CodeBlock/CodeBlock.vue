<script setup lang="ts">
import { transformerNotationHighlight } from '@shikijs/transformers'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { computed, ref, watch } from 'vue'
import Icon from '@/common/components/Icon.vue'

interface CodeTab {
    label: string
    code: string
    lang?: string
}

let highlighterPromise: Promise<HighlighterCore> | null = null

const getHighlighter = () => {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighterCore({
            themes: [
                import('shiki/themes/github-light.mjs'),
                import('shiki/themes/github-dark.mjs'),
            ],
            langs: [
                import('shiki/langs/vue-html.mjs'),
                import('shiki/langs/shellscript.mjs'),
                import('shiki/langs/javascript.mjs'),
                import('shiki/langs/php.mjs'),
                import('shiki/langs/json.mjs'),
            ],
            engine: createOnigurumaEngine(import('shiki/wasm')),
        })
    }
    return highlighterPromise
}

const props = withDefaults(
    defineProps<{
        code?: string
        lang?: string
        showPreview?: boolean
        tabs?: CodeTab[]
    }>(),
    {
        lang: 'vue-html',
        showPreview: false,
    },
)

// Code variants. A single `code` collapses to one label-less tab.
const codeTabs = computed<CodeTab[]>(() =>
    props.tabs?.length ? props.tabs : [{ label: '', code: props.code ?? '', lang: props.lang }],
)
const hasVariantTabs = computed(() => !props.showPreview && codeTabs.value.length > 1)
const hasHeader = computed(() => props.showPreview || hasVariantTabs.value)

const activeIndex = ref(0)
const activeCode = computed(() => codeTabs.value[activeIndex.value]?.code ?? '')
const activeLang = computed(() => codeTabs.value[activeIndex.value]?.lang ?? props.lang)

const previewTab = ref<'preview' | 'code'>(props.showPreview ? 'preview' : 'code')
const showCode = computed(() => !props.showPreview || previewTab.value === 'code')

const highlightedCode = ref('')
const copied = ref(false)

const highlight = async () => {
    const highlighter = await getHighlighter()
    const html = highlighter.codeToHtml(activeCode.value.trim(), {
        lang: activeLang.value,
        themes: {
            light: 'github-light',
            dark: 'github-dark',
        },
        transformers: [
            transformerNotationHighlight(),
            {
                pre(node) {
                    node.properties.class = undefined
                    node.properties.tabindex = undefined
                    node.properties.style = undefined
                },
                line(node, line) {
                    node.properties['data-line'] = line
                },
            },
        ],
    })
    highlightedCode.value = html
}

const copyCode = async () => {
    await navigator.clipboard.writeText(activeCode.value.trim())
    copied.value = true
    setTimeout(() => {
        copied.value = false
    }, 2000)
}

watch([activeCode, activeLang], highlight, { immediate: true })
</script>

<template>
    <div class="overflow-hidden space-y-2">
        <!-- Header: preview/code tabs, or code variant tabs, plus copy -->
        <div v-if="hasHeader" class="flex items-center gap-2">
            <template v-if="showPreview">
                <button
                    :class="[
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        previewTab === 'preview' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                    ]"
                    @click="previewTab = 'preview'"
                >
                    Preview
                </button>
                <button
                    :class="[
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        previewTab === 'code' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                    ]"
                    @click="previewTab = 'code'"
                >
                    Code
                </button>
            </template>
            <template v-else>
                <button
                    v-for="(tab, index) in codeTabs"
                    :key="index"
                    :class="[
                        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        activeIndex === index ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
                    ]"
                    @click="activeIndex = index"
                >
                    {{ tab.label }}
                </button>
            </template>
            <Button
                variant="ghost"
                size="icon-sm"
                class="ml-auto text-muted-foreground"
                title="Copy code"
                aria-label="Copy code"
                @click="copyCode"
            >
                <Icon v-if="copied" name="icon-check" class="size-4 text-green-500" />
                <Icon v-else name="icon-copy" class="size-4" />
            </Button>
        </div>

        <div class="border border-border rounded-xl overflow-clip">
            <!-- Preview -->
            <div v-if="showPreview && previewTab === 'preview'" class="flex min-h-50 items-center justify-center p-10">
                <slot />
            </div>

            <!-- Code -->
            <div v-show="showCode" class="shiki-wrapper relative">
                <!-- Floating copy button when there is no header -->
                <Button
                    v-if="!hasHeader"
                    variant="ghost"
                    size="icon-sm"
                    class="absolute right-2 top-2 text-muted-foreground"
                    title="Copy code"
                    aria-label="Copy code"
                    @click="copyCode"
                >
                    <Icon v-if="copied" name="icon-check" class="size-4 text-green-500" />
                    <Icon v-else name="icon-copy" class="size-4" />
                </Button>
                <div v-html="highlightedCode" />
            </div>
        </div>
    </div>
</template>

<style>
.shiki-wrapper {
    background-color: var(--color-zinc-50);
    font-size: 13px;
    line-height: 1.6;
}

html.dark .shiki-wrapper {
    background-color: var(--color-zinc-900);
}

.shiki-wrapper pre {
    margin: 0 !important;
    padding: 0.75rem 0 !important;
    background: transparent !important;
    overflow-x: auto;
}

.shiki-wrapper code {
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    counter-reset: line;
}

.shiki-wrapper .line {
    display: inline-block;
    width: 100%;
    padding: 0 1rem 0 0;
}

.shiki-wrapper .line::before {
    counter-increment: line;
    content: counter(line);
    display: inline-block;
    width: 2.5rem;
    padding-right: 1rem;
    text-align: right;
    color: var(--color-zinc-400);
    user-select: none;
}

html.dark .shiki-wrapper .line::before {
    color: var(--color-zinc-600);
}

/* Light/dark theme switching */
html.dark .shiki-wrapper span {
    color: var(--shiki-dark) !important;
}
</style>
