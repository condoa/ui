<template>
    <ContextMenuSeparator data-slot="context-menu-separator" :class="styles({ class: props.class })" v-bind="props" />
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { ContextMenuSeparator } from 'reka-ui'
import type { ContextMenuSeparatorProps } from 'reka-ui'

interface Props extends ContextMenuSeparatorProps {
    /**Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: '-mx-1 my-1 h-px bg-border',
})
</script>
