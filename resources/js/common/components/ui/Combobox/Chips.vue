<template>
    <ComboboxAnchor data-slot="combobox-chips" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ComboboxAnchor>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxAnchor, type ComboboxAnchorProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxAnchorProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: [
        // Layout - flex-wrap for chips, gap for spacing, p-1 for inner padding
        'relative inline-flex w-full flex-wrap items-center gap-1 p-1',
        // Sizing - match default input height when empty
        'min-h-8',
        // Visual - same as Anchor/InputControl
        'rounded-md border border-input bg-background not-dark:bg-clip-padding text-base text-foreground shadow-xs/5 ring-ring/24 transition-shadow',
        // Before pseudo for subtle shadow
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)]',
        'not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)]',
        // Focus states
        'has-focus-visible:border-ring has-focus-visible:ring-[3px]',
        // Invalid states
        'has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16',
        'has-aria-invalid:border-destructive/36',
        // Other states
        'has-autofill:bg-foreground/4',
        'has-disabled:opacity-64',
        'has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none',
        // Responsive
        'md:text-sm',
        // Dark mode
        'dark:bg-input/32 dark:has-autofill:bg-foreground/8 dark:has-aria-invalid:ring-destructive/24',
        'dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]',
    ],
})
</script>
