<template>
    <DropdownMenuTrigger data-slot="dropdown-menu-trigger" v-bind="props">
        <slot />
    </DropdownMenuTrigger>
</template>

<script lang="ts" setup>
import { DropdownMenuTrigger, type DropdownMenuTriggerProps } from 'reka-ui'

const props = defineProps<DropdownMenuTriggerProps>()
</script>
