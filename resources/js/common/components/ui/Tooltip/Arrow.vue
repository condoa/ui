<template>
    <TooltipArrow
        data-slot="tooltip-arrow"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TooltipArrow, useForwardProps } from 'reka-ui'
import type { TooltipArrowProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends TooltipArrowProps {
    /** Additional classes for the tooltip arrow */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    width: 12,
    height: 6,
})

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'fill-popover stroke-border',
})
</script>
