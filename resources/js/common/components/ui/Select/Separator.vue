<template>
    <SelectSeparator data-slot="select-separator" :class="styles({ class: props.class })" v-bind="forwarded" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectSeparator, type SelectSeparatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectSeparatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'pointer-events-none -mx-1 my-1 h-px bg-border',
})
</script>
