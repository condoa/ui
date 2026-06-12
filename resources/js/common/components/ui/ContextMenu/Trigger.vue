<template>
    <ContextMenuTrigger data-slot="context-menu-trigger" v-bind="props">
        <slot />
    </ContextMenuTrigger>
</template>

<script lang="ts" setup>
import { ContextMenuTrigger, type ContextMenuTriggerProps } from 'reka-ui'

const props = defineProps<ContextMenuTriggerProps>()
</script>
