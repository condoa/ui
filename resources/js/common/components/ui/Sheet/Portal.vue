<template>
    <DialogPortal v-bind="props">
        <slot />
    </DialogPortal>
</template>

<script lang="ts" setup>
import { DialogPortal, type DialogPortalProps } from "reka-ui";

const props = defineProps<DialogPortalProps>();
</script>
