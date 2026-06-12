<template>
    <span
        :data-size="size"
        :data-slot="dataSlot"
        :class="styles({ class: props.class, unstyled })"
    >
        <slot />
    </span>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    /** Additional classes to add to the control wrapper */
    class?: ClassValue
    /** The size variant of the input */
    size?: 'sm' | 'default' | 'lg'
    /** When true, removes all control styles */
    unstyled?: boolean
    /** The data-slot attribute value */
    dataSlot?: string
}

const props = withDefaults(defineProps<Props>(), {
    size: 'default',
    unstyled: false,
    dataSlot: 'input-control',
})

const styles = tv({
    base: '',
    variants: {
        unstyled: {
            false: [
                'relative inline-flex w-full rounded-md border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow',
                'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)]',
                'not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]',
                'has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16',
                'has-aria-invalid:border-destructive/36',
                'has-focus-visible:border-ring',
                'has-autofill:bg-foreground/4',
                'has-disabled:opacity-64',
                'has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none',
                'has-focus-visible:ring-[3px]',
                'md:text-sm',
                'dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24',
                'dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]',
            ],
            true: '',
        },
    },
    defaultVariants: {
        unstyled: false,
    },
})
</script>
