<template>
    <DialogOverlay data-slot="dialog-overlay" :class="styles({ nested: depth > 0, class: props.class })" v-bind="forwarded" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogOverlay } from 'reka-ui'
import type { DialogOverlayProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { inject } from 'vue'
import { dialogDepthKey } from './useDialogNesting'

interface Props extends DialogOverlayProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const depth = inject(dialogDepthKey, 0)

const styles = tv({
    base: 'fixed inset-0 z-50 bg-black/32 transition-opacity duration-150 ease-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in',
    variants: {
        nested: {
            false: 'backdrop-blur-sm',
        },
    },
    defaultVariants: {
        nested: false,
    },
})
</script>
