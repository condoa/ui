<template>
    <SelectLabel data-slot="select-label" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </SelectLabel>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectLabel, type SelectLabelProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectLabelProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'px-2 py-1.5 text-xs text-muted-foreground',
})
</script>
