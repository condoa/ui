<template>
    <DropdownMenuPortal v-bind="props">
        <slot />
    </DropdownMenuPortal>
</template>

<script lang="ts" setup>
import { DropdownMenuPortal, type DropdownMenuPortalProps } from 'reka-ui'

const props = defineProps<DropdownMenuPortalProps>()
</script>
