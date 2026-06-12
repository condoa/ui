<template>
    <InputControl :class="props.class" :size="size" :unstyled="unstyled">
        <input
            ref="input"
            data-slot="input"
            :id="id"
            :name="name"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :value="type === 'file' ? undefined : modelValue"
            :class="inputStyles({ size: size as any, type: type as any, class: inputClass })"
            v-bind="$attrs"
            @input="handleInput"
        />
    </InputControl>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { onMounted, useTemplateRef } from 'vue'
import type { InputHTMLAttributes } from 'vue'
import InputControl from './InputControl.vue'

defineOptions({ inheritAttrs: false })

interface Props {
    /** Additional classes to add to the control wrapper */
    class?: ClassValue
    /** Additional classes to add to the inner input element */
    inputClass?: ClassValue
    /** The id of the input */
    id?: string
    /** The name of the input */
    name?: string
    /** The placeholder of the input */
    placeholder?: string
    /** Whether the input is disabled */
    disabled?: boolean
    /** Whether the input is required */
    required?: boolean
    /** The type of the input */
    type?: InputHTMLAttributes['type']
    /** The value of the input */
    modelValue?: any
    /** The maximum length of the input */
    maxlength?: number
    /** The `RegExp` pattern of the input */
    pattern?: string
    /** Custom sanitize function applied on every input event */
    sanitize?: (value: string) => string
    /** When `true`, the input will be focused when mounted */
    autofocus?: boolean
    /** The size variant of the input */
    size?: 'sm' | 'default' | 'lg'
    /** When `true`, removes all control wrapper styles */
    unstyled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    modelValue: '',
    size: 'default',
    unstyled: false,
})

const inputRef = useTemplateRef('input')

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement

    /* File inputs are uncontrolled — only emit, never read/write .value */
    if (props.type === 'file') {
        return
    }

    let value = target.value

    /* Custom sanitize function */
    if (props.sanitize) {
        value = props.sanitize(value)
    } else if (props.pattern) {
        /* Validate input with pattern */
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

const inputStyles = tv({
    base: [
        'h-8.5 w-full min-w-0 border-0 bg-transparent rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8.5 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 selection:bg-primary selection:text-primary-foreground',
        '[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_var(--color-background)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-foreground)]',
        'placeholder:text-muted-foreground/72',
        'md:h-7.5 md:leading-7.5',
    ],
    variants: {
        size: {
            sm: 'h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5 md:h-6.5 md:leading-6.5',
            default: '',
            lg: 'h-9.5 leading-9.5 md:h-8.5 md:leading-8.5',
        },
        type: {
            search: '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
            file: 'text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

onMounted(() => {
    if (props.autofocus) {
        inputRef.value?.focus()
    }
})

defineExpose({ inputRef })
</script>
