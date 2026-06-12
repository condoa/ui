<template>
    <SelectPortal v-bind="props">
        <slot />
    </SelectPortal>
</template>

<script lang="ts" setup>
import { SelectPortal, type SelectPortalProps } from 'reka-ui'

const props = defineProps<SelectPortalProps>()
</script>
