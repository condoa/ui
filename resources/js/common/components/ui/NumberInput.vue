<template>
    <NumberFieldRoot
        :model-value="modelValue ?? undefined"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :format-options="{ useGrouping: false, maximumFractionDigits: 0 }"
        class="inline-flex"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <InputControl :class="[props.class, 'w-auto! inline-flex!']">
            <NumberFieldDecrement
                class="flex shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                tabindex="-1"
            >
                <Icon name="icon-minus" class="size-3.5" />
            </NumberFieldDecrement>
            <NumberFieldInput
                v-bind="$attrs"
                class="h-8.5 border-0 bg-transparent text-center tabular-nums outline-none ring-0 [field-sizing:content] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 md:h-7.5 selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground/72"
                :size="inputSize"
                @input="onRawInput"
            />
            <NumberFieldIncrement
                class="flex shrink-0 items-center justify-center px-2 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                tabindex="-1"
            >
                <Icon name="icon-plus" class="size-3.5" />
            </NumberFieldIncrement>
        </InputControl>
    </NumberFieldRoot>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import {
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    NumberFieldRoot,
} from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'
import { computed } from 'vue'
import InputControl from './InputControl.vue'

defineOptions({ inheritAttrs: false })

interface Props {
    class?: ClassValue
    modelValue?: number | null
    min?: number
    max?: number
    step?: number
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    step: 1,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: number | undefined]
    'raw-input': [value: string]
}>()

const onRawInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('raw-input', target.value)
    if (target.value.trim() === '') {
        emit('update:modelValue', undefined)
    }
}

const inputSize = computed(() => {
    const len = String(props.modelValue ?? '').length
    return Math.max(len, 1)
})
</script>
