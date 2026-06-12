<template>
    <div data-slot="dialog-viewport" :class="styles({ bottomStickOnMobile, class: props.class })">
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the viewport */
    class?: ClassValue

    /** Whether to stick to bottom on mobile */
    bottomStickOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bottomStickOnMobile: true,
})

const styles = tv({
    base: 'pointer-events-none fixed inset-0 z-50 grid place-items-center p-4',
    variants: {
        bottomStickOnMobile: {
            true: 'max-md:place-items-end max-md:p-0 max-md:pt-12',
            false: '',
        },
    },
})
</script>
