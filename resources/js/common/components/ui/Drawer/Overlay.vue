<template>
    <DrawerOverlay
        data-slot="drawer-overlay"
        v-bind="props"
        :class="styles({ class: props.class })"
    />
</template>

<script lang="ts" setup>
import type { DialogOverlayProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'
import { DrawerOverlay } from 'vaul-vue'

interface Props extends DialogOverlayProps {
    /**
     * Custom class(es) to add to the overlay element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'fixed inset-0 z-50 bg-background/40 backdrop-blur',
})
</script>
