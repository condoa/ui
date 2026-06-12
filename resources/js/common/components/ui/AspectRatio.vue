<template>
    <AspectRatio v-slot="slotProps" data-slot="aspect-ratio" v-bind="props">
        <slot v-bind="slotProps" />
    </AspectRatio>
</template>

<script lang="ts" setup>
import { AspectRatio } from 'reka-ui'
import type { AspectRatioProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'

interface Props extends AspectRatioProps {
    /**
     * Custom class(es) to add to the element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
