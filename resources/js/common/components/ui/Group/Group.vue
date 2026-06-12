<template>
    <div
        :class="styles({ orientation, class: props.class })"
        :data-orientation="orientation"
        data-slot="group"
        role="group"
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the group */
    class?: ClassValue

    /** The orientation of the group */
    orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
})

const styles = tv({
    base: 'flex w-fit *:focus-visible:z-1 has-[>[data-slot=group]]:gap-2 *:has-focus-visible:z-1 dark:*:[[data-slot=button]:hover~[data-slot=separator]:not([data-slot]:hover~[data-slot=separator]~[data-slot=separator]),[data-slot][data-pressed]~[data-slot=separator]:not([data-slot][data-pressed]~[data-slot=separator]~[data-slot=separator])]:before:bg-input/64 dark:*:[[data-slot=separator]:has(~[data-slot=button]:hover):not(:has(~[data-slot=separator]~[data-slot]:hover)),[data-slot=separator]:has(~[data-slot][data-pressed]):not(:has(~[data-slot=separator]~[data-slot][data-pressed]))]:before:bg-input/64',
    variants: {
        orientation: {
            horizontal:
                "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-start-[0.5px] *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-end-[0.5px] *:pointer-coarse:after:min-w-auto *:data-slot:has-[~[data-slot]]:rounded-e-none *:data-slot:has-[~[data-slot]]:border-e-0 *:data-slot:has-[~[data-slot]]:before:rounded-e-none *:[[data-slot]~[data-slot]]:rounded-s-none *:[[data-slot]~[data-slot]]:border-s-0 *:[[data-slot]~[data-slot]]:before:rounded-s-none",
            vertical:
                "*:[[data-slot]~[data-slot]:not([data-slot=separator])]:before:-top-[0.5px] *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:-bottom-[0.5px] flex-col *:pointer-coarse:after:min-h-auto *:data-slot:has-[~[data-slot]]:rounded-b-none *:data-slot:has-[~[data-slot]]:border-b-0 *:data-slot:not-data-[slot=separator]:has-[~[data-slot]]:before:hidden *:data-slot:has-[~[data-slot]]:before:rounded-b-none dark:*:last:before:hidden dark:*:first:before:block *:[[data-slot]~[data-slot]]:rounded-t-none *:[[data-slot]~[data-slot]]:border-t-0 *:[[data-slot]~[data-slot]]:before:rounded-t-none",
        },
    },
})
</script>
