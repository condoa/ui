<template>
    <AlertDialogOverlay
        data-slot="alert-dialog-backdrop"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogOverlay } from 'reka-ui'
import type { AlertDialogOverlayProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends AlertDialogOverlayProps {
    /** Custom class(es) to add to the overlay */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'fixed inset-0 z-50 bg-black/32 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
})
</script>
