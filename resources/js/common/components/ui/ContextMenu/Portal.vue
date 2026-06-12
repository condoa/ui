<template>
    <ContextMenuPortal v-bind="props">
        <slot />
    </ContextMenuPortal>
</template>

<script lang="ts" setup>
import { ContextMenuPortal, type ContextMenuPortalProps } from 'reka-ui'

const props = defineProps<ContextMenuPortalProps>()
</script>
