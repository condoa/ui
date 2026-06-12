<template>
    <div class="relative" :class="[classes]">
        <img v-if='placeholder' v-bind="forwarded" :src="placeholder" :alt="alt" :class='["absolute", "inset-0", "transition-opacity", "duration-700", "ease-in-out", "w-full"]'>

        <img v-bind="forwarded" :src="src" :alt="alt" @load="imageLoaded" :class='["transition-opacity", "duration-[.5s]", "ease-in-out", "opacity-0", "relative"]' :style="{ opacity: opacity }">
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/common/helpers/cn'
import { useForwardProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'
import { computed, ref } from 'vue'

interface Props {
    /**
     * The source URL of the main image.
     */
    src: string
    /**
     * Alt text for the image. Pass empty string for purely decorative images.
     */
    alt?: string
    /**
     * Custom class(es) to add to the container element.
     */
    class?: ClassValue
    /**
     * The source URL of the placeholder image to show while the main image loads.
     */
    placeholder?: string
}

const props = defineProps<Props>()

const forwarded = useForwardProps(props)

const loaded = ref(false)

const imageLoaded = () => {
    loaded.value = true
}

const opacity = computed(() => {
    return loaded.value ? 1 : 0
})

const classes = cn('rounded overflow-hidden shadow-xs', props.class)
</script>