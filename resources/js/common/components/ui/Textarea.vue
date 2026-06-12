<template>
    <InputControl :class="props.class" data-slot="textarea-control" :unstyled="unstyled">
        <textarea
            ref="textarea"
            data-slot="textarea"
            :id="id"
            :name="name"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            :rows="rows"
            :value="modelValue"
            :class="textareaStyles({ class: inputClass })"
            v-bind="$attrs"
            @input="handleInput"
        />
    </InputControl>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { onMounted, useTemplateRef } from 'vue'
import type { TextareaHTMLAttributes } from 'vue'
import InputControl from './InputControl.vue'

defineOptions({ inheritAttrs: false })

interface Props {
    /** Additional classes to add to the control wrapper */
    class?: ClassValue
    /** Additional classes to add to the inner textarea element */
    inputClass?: ClassValue
    /** The name of the textarea */
    name?: TextareaHTMLAttributes['name']
    /** The id of the textarea */
    id?: TextareaHTMLAttributes['id']
    /** The placeholder of the textarea */
    placeholder?: TextareaHTMLAttributes['placeholder']
    /** Whether the textarea is required */
    required?: boolean
    /** Whether the textarea is disabled */
    disabled?: boolean
    /** The number of rows to display */
    rows?: number
    /** The value of the textarea */
    modelValue?: string
    /** The maximum number of characters allowed */
    maxlength?: number
    /** The `RegExp` pattern of the textarea */
    pattern?: string
    /** Whether the textarea should be focused when mounted */
    autofocus?: boolean
    /** When `true`, removes all control wrapper styles */
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), { modelValue: '', unstyled: false })

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const textarea = useTemplateRef('textarea')

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement
    let value = target.value

    /* Validate input with pattern */
    if (props.pattern) {
        const regex = new RegExp(props.pattern)
        value = Array.from(value)
            .filter((char) => regex.test(char))
            .join('')
    }

    /* Handle maxlength */
    if (props.maxlength) {
        value = value.slice(0, props.maxlength)
    }

    target.value = value
    emit('update:modelValue', value)
}

const textareaStyles = tv({
    base: [
        'field-sizing-content resize-none min-h-16 w-full min-w-0 border-0 bg-transparent rounded-[inherit] px-[calc(--spacing(3)-1px)] py-2 text-base outline-none ring-0',
        '[transition:background-color_5000000s_ease-in-out_0s]',
        'focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0',
        'placeholder:text-muted-foreground/72 disabled:cursor-not-allowed',
        'md:text-sm',
    ],
})

onMounted(() => {
    if (props.autofocus) {
        textarea.value?.focus()
    }
})
</script>
