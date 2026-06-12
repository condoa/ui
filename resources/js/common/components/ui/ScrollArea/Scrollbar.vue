<template>
    <ScrollAreaScrollbar data-slot="scroll-area-scrollbar" v-bind="forwarded" :class="styles({ orientation, class: props.class })">
        <slot />
        <ScrollAreaThumb />
    </ScrollAreaScrollbar>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ScrollAreaScrollbar, type ScrollAreaScrollbarProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends ScrollAreaScrollbarProps {
    /** Class to apply to the scrollbar */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'flex touch-none select-none',
    variants: {
        orientation: {
            vertical: 'h-full w-2.5 border-l border-l-transparent px-px',
            horizontal: 'h-2.5 flex-col border-t border-t-transparent px-px',
        },
    },
})
</script>
