<template>
    <ComboboxLabel data-slot="combobox-label" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ComboboxLabel>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxLabel, type ComboboxLabelProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxLabelProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
})
</script>
