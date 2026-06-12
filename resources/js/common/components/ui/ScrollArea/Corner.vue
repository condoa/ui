<template>
    <ScrollAreaCorner data-slot="scroll-area-corner" v-bind="props">
        <slot />
    </ScrollAreaCorner>
</template>

<script lang="ts" setup>
import { ScrollAreaCorner, type ScrollAreaCornerProps } from 'reka-ui'

const props = defineProps<ScrollAreaCornerProps>()
</script>
