<template>
    <DropdownMenuLabel data-slot="dropdown-menu-label" :class="styles({ inset, class: props.class })" v-bind="forwarded">
        <slot>{{ label }}</slot>
    </DropdownMenuLabel>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuLabel, type DropdownMenuLabelProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuLabelProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Whether to inset the content */
    inset?: boolean
    /** The label text to display */
    label?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'inset', 'label')

const styles = tv({
    base: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
    variants: {
        inset: { true: 'ps-9 sm:ps-8' },
    },
})
</script>
