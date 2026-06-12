<template>
    <ContextMenuArrow v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { ContextMenuArrow, type ContextMenuArrowProps } from 'reka-ui'

interface Props extends ContextMenuArrowProps {
    /** Custom class(es) to add to the arrow */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'border bg-muted',
})
</script>
