<template>
    <DialogClose data-slot="sheet-close" v-bind="props">
        <slot />
    </DialogClose>
</template>

<script lang="ts" setup>
import { DialogClose, type DialogCloseProps } from 'reka-ui'

const props = defineProps<DialogCloseProps>()
</script>
