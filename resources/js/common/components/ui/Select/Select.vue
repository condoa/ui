<template>
    <SelectRoot v-slot="slotProps" data-slot="select" v-bind="forwarded" :model-value="stringModelValue" @update:model-value="handleUpdate">
        <slot v-bind="slotProps" />
    </SelectRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectRoot } from 'reka-ui'
import type { SelectRootProps } from 'reka-ui'
import { computed } from 'vue'

interface Props extends /* @vue-ignore */ Omit<SelectRootProps, 'modelValue' | 'defaultValue'> {
    /** The controlled value — coerced to string for reka-ui compatibility */
    modelValue?: string | number | null
    /** The default value — coerced to string for reka-ui compatibility */
    defaultValue?: string | number | null
}

const props = defineProps<Props>()

const emits = defineEmits<{
    'update:modelValue': [value: string | number | null]
}>()

const forwarded = reactiveOmit(props, 'modelValue', 'defaultValue')

const NULL_SENTINEL = '__null__'

const isNumericModel = computed(() => typeof props.modelValue === 'number' || typeof props.defaultValue === 'number')

const stringModelValue = computed(() => {
    const value = props.modelValue !== undefined ? props.modelValue : props.defaultValue
    if (value === null) return NULL_SENTINEL
    return value === undefined ? undefined : String(value)
})

const handleUpdate = (value: string) => {
    if (value === NULL_SENTINEL) {
        emits('update:modelValue', null)
        return
    }
    if (isNumericModel.value && value !== '') {
        const num = Number(value)
        emits('update:modelValue', Number.isNaN(num) ? value : num)
        return
    }
    emits('update:modelValue', value)
}
</script>
