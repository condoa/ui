<template>
    <ComboboxRoot v-slot="slotProps" data-slot="combobox" v-bind="forwarded">
        <slot v-bind="slotProps" />
    </ComboboxRoot>
</template>

<script lang="ts" setup>
import { ComboboxRoot, useForwardPropsEmits } from 'reka-ui'
import type { ComboboxRootEmits, ComboboxRootProps } from 'reka-ui'

const props = withDefaults(defineProps<ComboboxRootProps>(), {
    openOnFocus: true,
    resetModelValueOnClear: true,
})

const emits = defineEmits<ComboboxRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>
