<template>
    <Primitive data-slot="card-frame" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: [
        // Base styles - border with muted fill via before pseudo
        'relative flex flex-col rounded-lg border border-sidebar-border bg-card not-dark:bg-clip-padding text-card-foreground shadow-lg/5',
        // Clip-path CSS variables for nested cards
        '[--clip-bottom:-1rem] [--clip-top:-1rem]',
        // Before pseudo-element for muted background fill + inner glow
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:bg-muted/72 before:shadow-[0_1px_rgba(0,0,0,0.04)]',
        // Dark mode
        'dark:bg-background dark:before:shadow-[0_-1px_rgba(255,255,255,0.06)]',
        // Nested card resets - remove shadow and before pseudo
        '*:data-[slot=card]:-m-px *:data-[slot=card]:bg-clip-padding *:data-[slot=card]:shadow-none *:data-[slot=card]:before:hidden',
        // Nested card rounding
        '*:not-first:data-[slot=card]:rounded-t-lg *:not-last:data-[slot=card]:rounded-b-lg',
        '*:not-first:data-[slot=card]:before:rounded-t-[calc(var(--radius-lg)-1px)] *:not-last:data-[slot=card]:before:rounded-b-[calc(var(--radius-lg)-1px)]',
        // Nested card clip-path with CSS variable control
        '*:data-[slot=card]:[clip-path:inset(var(--clip-top)_1px_var(--clip-bottom)_1px_round_calc(var(--radius-lg)-1px))]',
        '*:data-[slot=card]:first:[--clip-top:1px] *:data-[slot=card]:last:[--clip-bottom:1px]',
    ],
})
</script>
