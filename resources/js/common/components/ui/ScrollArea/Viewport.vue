<template>
    <ScrollAreaViewport data-slot="scroll-area-viewport" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ScrollAreaViewport>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ScrollAreaViewport, type ScrollAreaViewportProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends ScrollAreaViewportProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
})
</script>
