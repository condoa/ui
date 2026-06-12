<template>
    <div class="w-full">
        <Label v-if="label" :class="[errorMessage && 'text-destructive', 'mb-2']">
            <span>{{ label }} <span v-if="required" class="text-destructive">*</span></span>
        </Label>
        <div class="rounded-md border border-input" :class="[errorMessage && 'border-destructive', focused && 'ring-ring/50 ring-[3px]']">
            <!-- Toolbar -->
            <div class="flex items-center gap-0.5 border-b border-border px-2 py-1 bg-muted/30">
                <button v-for="action in toolbarActions" :key="action.name" type="button" class="size-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer" :class="[action.isActive?.() && 'bg-muted text-foreground']" :title="action.title" :aria-label="action.title" :aria-pressed="action.isActive ? action.isActive() : undefined" @click="action.command">
                    <Icon :name="action.icon" class="size-3.5" />
                </button>
            </div>
            <!-- Editor -->
            <EditorContent :editor="editor" :aria-invalid="errorMessage ? true : undefined" :aria-describedby="errorMessage ? errorId : undefined" class="prose prose-sm dark:prose-invert max-w-none px-3 py-2 min-h-[120px] [&_.tiptap]:outline-none [&_.tiptap]:min-h-[100px] [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground/50 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none" />
        </div>
        <AnimatePresence multiple as="div" mode="wait">
            <slot name="hint" :error-message="errorMessage" :value>
                <motion.p v-if="hint && !errorMessage" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'hint' })">
                    {{ hint }}
                </motion.p>
            </slot>
            <slot name="errorMessage" :error-message="errorMessage" :value>
                <motion.p v-if="errorMessage" :id="errorId" role="alert" :variants initial="initial" exit="initial" animate="animate" :transition="{ type: 'keyframes' }" :class="formHintVariants({ variant: 'error' })">
                    {{ errorMessage }}
                </motion.p>
            </slot>
        </AnimatePresence>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { formHintVariants } from '../Form/variants'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { marked } from 'marked'
import TurndownService from 'turndown'
import { AnimatePresence, motion } from 'motion-v'
import { useField } from 'vee-validate'
import { computed, ref, useId, watch } from 'vue'

const variants = {
    initial: { opacity: 0, y: -2 },
    animate: { opacity: 1, y: 0 },
}

interface Props {
    label?: string
    hint?: string
    modelValue?: string
    name?: string
    id?: string
    rules?: any
    placeholder?: string
    required?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const inputId = props.id || useId()
const errorId = `${inputId}-error`
const focused = ref(false)

const { errorMessage, value } = useField(() => props.name || inputId, props.rules, {
    initialValue: props.modelValue,
    label: props.label,
    syncVModel: true,
})

const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
})

const toHtml = (markdown: string): string => {
    if (!markdown) { return '' }
    return marked.parse(markdown, { async: false }) as string
}

const toMarkdown = (html: string): string => {
    if (!html) { return '' }
    return turndown.turndown(html)
}

const editor = useEditor({
    content: toHtml(props.modelValue || ''),
    extensions: [
        StarterKit,
        Underline,
        Placeholder.configure({
            placeholder: props.placeholder || '',
        }),
    ],
    editorProps: {
        attributes: {
            class: 'focus:outline-none',
        },
    },
    onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        const md = toMarkdown(html)
        value.value = md
        emit('update:modelValue', md)
    },
    onFocus: () => {
        focused.value = true
    },
    onBlur: () => {
        focused.value = false
    },
})

// Sync external changes to editor
watch(() => props.modelValue, (newVal?: string) => {
    if (!editor.value) { return }
    const currentMd = toMarkdown(editor.value.getHTML())
    if (newVal !== currentMd) {
        editor.value.commands.setContent(toHtml(newVal || ''))
    }
})

const toolbarActions = computed(() => {
    if (!editor.value) { return [] }
    const e = editor.value
    return [
        { name: 'bold', title: 'Bold', icon: 'icon-bold', command: () => e.chain().focus().toggleBold().run(), isActive: () => e.isActive('bold') },
        { name: 'italic', title: 'Italic', icon: 'icon-italic', command: () => e.chain().focus().toggleItalic().run(), isActive: () => e.isActive('italic') },
        { name: 'underline', title: 'Underline', icon: 'icon-underline', command: () => e.chain().focus().toggleUnderline().run(), isActive: () => e.isActive('underline') },
        { name: 'heading2', title: 'Heading', icon: 'icon-heading', command: () => e.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => e.isActive('heading', { level: 2 }) },
        { name: 'bulletList', title: 'Bullet List', icon: 'icon-list', command: () => e.chain().focus().toggleBulletList().run(), isActive: () => e.isActive('bulletList') },
        { name: 'orderedList', title: 'Ordered List', icon: 'icon-list-ordered', command: () => e.chain().focus().toggleOrderedList().run(), isActive: () => e.isActive('orderedList') },
        { name: 'blockquote', title: 'Quote', icon: 'icon-message-square', command: () => e.chain().focus().toggleBlockquote().run(), isActive: () => e.isActive('blockquote') },
        { name: 'horizontalRule', title: 'Divider', icon: 'icon-minus', command: () => e.chain().focus().setHorizontalRule().run() },
    ]
})
</script>
