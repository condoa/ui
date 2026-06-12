<template>
    <SliderTrack data-slot="slider-track" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </SliderTrack>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SliderTrack } from 'reka-ui'
import type { SliderTrackProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SliderTrackProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'relative grow overflow-hidden rounded-full bg-muted data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
})
</script>
