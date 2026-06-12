<template>
    <SliderRange data-slot="slider-range" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </SliderRange>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SliderRange } from 'reka-ui'
import type { SliderRangeProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SliderRangeProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'absolute bg-primary data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
})
</script>
