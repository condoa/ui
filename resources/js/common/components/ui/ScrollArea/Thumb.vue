<template>
    <ScrollAreaThumb data-slot="scroll-area-thumb" v-bind="forwarded" :class="styles({ orientation, class: props.class })">
        <slot />
    </ScrollAreaThumb>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ScrollAreaThumb, type ScrollAreaThumbProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends ScrollAreaThumbProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    orientation?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<Props>(), { orientation: 'vertical' })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'relative flex-1 rounded-full bg-border',
    variants: {
        orientation: {
            vertical: 'flex-1',
            horizontal: '',
        },
    },
})
</script>
