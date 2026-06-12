<template>
    <label :class="styles().wrapper({ disabled, class: wrapperClass })">
        <input
            ref="inputRef"
            :id="inputId"
            type="checkbox"
            :checked="isChecked"
            :disabled="disabled"
            :class="styles().checkbox({ disabled, class: props.class })"
            @change="handleChange"
        />
        <span v-if="label" :class="styles().label({ disabled })">{{ label }}</span>
        <slot />
    </label>
</template>

<script lang="ts" setup>
import { computed, ref, useId, watchEffect } from 'vue'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
    wrapperClass?: ClassValue
    id?: string
    /** v-model binding */
    modelValue?: boolean
    /** v-model:checked binding (backwards compat) */
    checked?: boolean
    /** Default value when neither modelValue nor checked is provided */
    defaultValue?: boolean
    /** Indeterminate state */
    indeterminate?: boolean
    disabled?: boolean
    label?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'update:checked': [value: boolean]
}>()

const inputId = props.id || `checkbox-${useId()}`
const inputRef = ref<HTMLInputElement | null>(null)

// Support both v-model and v-model:checked
const isChecked = computed(() => props.modelValue ?? props.checked ?? props.defaultValue ?? false)

// Set indeterminate state via ref (can't be set via attribute)
watchEffect(() => {
    if (inputRef.value) {
        inputRef.value.indeterminate = props.indeterminate ?? false
    }
})

const handleChange = (event: Event) => {
    const value = (event.target as HTMLInputElement).checked
    emit('update:modelValue', value)
    emit('update:checked', value)
}

const styles = tv({
    slots: {
        wrapper: 'flex items-center gap-2 cursor-pointer',
        checkbox:
            'form-checkbox size-4 shrink-0 cursor-pointer rounded-[3px] border border-transparent bg-background text-neutral-600 shadow-border shadow-xs transition duration-200 focus:ring-[2px] focus:ring-ring/50 focus:ring-offset-0 focus:outline-none',
        label: 'text-sm font-medium text-foreground select-none',
    },
    variants: {
        disabled: {
            true: {
                wrapper: 'cursor-not-allowed',
                checkbox: 'pointer-events-none opacity-50',
                label: 'cursor-not-allowed opacity-50',
            },
        },
    },
})
</script>
