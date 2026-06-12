<template>
    <SelectViewport data-slot="select-viewport" :class="styles({ position, class: props.class })" v-bind="forwarded">
        <slot />
    </SelectViewport>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectViewport } from 'reka-ui'
import type { SelectViewportProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectViewportProps {
    position?: 'item-aligned' | 'popper'
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'p-1',
    variants: {
        position: {
            popper: 'h-[var(--reka-select-trigger-height)] w-full min-w-[var(--reka-select-trigger-width)] scroll-my-1',
            'item-aligned': '',
        },
    },
})
</script>
