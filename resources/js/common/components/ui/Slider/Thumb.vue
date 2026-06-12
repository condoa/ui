<template>
    <SliderThumb data-slot="slider-thumb" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </SliderThumb>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SliderThumb } from 'reka-ui'
import type { SliderThumbProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SliderThumbProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
})
</script>
