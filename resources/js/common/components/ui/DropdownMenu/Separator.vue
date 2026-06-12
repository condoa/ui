<template>
    <DropdownMenuSeparator data-slot="dropdown-menu-separator" :class="styles({ class: props.class })" v-bind="forwarded" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuSeparator, type DropdownMenuSeparatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuSeparatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'mx-2 my-1 h-px bg-border',
})
</script>
