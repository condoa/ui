<template>
    <Input
        type="text"
        :inputmode="allowDecimals ? 'decimal' : 'numeric'"
        class="min-w-[8rem] tabular-nums"
        :sanitize="sanitize"
        :model-value="displayValue"
        @update:model-value="onInput"
        v-bind="$attrs"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { sanitizeDecimal } from './DecimalInput.helpers'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
    modelValue?: string | number
    allowDecimals?: boolean
}>(), {
    allowDecimals: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const sanitize = (value: string) => {
    if (props.allowDecimals) return sanitizeDecimal(value)
    return value.replace(/\D/g, '')
}

const displayValue = computed(() => {
    if (props.modelValue == null || props.modelValue === '') return ''
    if (!props.allowDecimals) return String(props.modelValue).split('.')[0].replace(/[^\d]/g, '')
    return String(props.modelValue).replace('.', ',')
})

const onInput = (value: string) => {
    if (!props.allowDecimals) {
        emit('update:modelValue', value.replace(/\D/g, ''))
        return
    }
    emit('update:modelValue', value.replace(',', '.'))
}
</script>
