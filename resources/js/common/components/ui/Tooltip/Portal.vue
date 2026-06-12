<template>
    <TooltipPortal v-bind="props">
        <slot />
    </TooltipPortal>
</template>

<script lang="ts" setup>
import { TooltipPortal, type TooltipPortalProps } from 'reka-ui'

const props = defineProps<TooltipPortalProps>()
</script>
