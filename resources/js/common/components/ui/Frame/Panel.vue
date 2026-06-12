<template>
    <Primitive data-slot="frame-panel" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
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
        'relative rounded-md border bg-background bg-clip-padding shadow-xs/5',
        // Inner glow pseudo-element
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)]',
        // Light mode: subtle shadow
        'before:shadow-[0_1px_rgba(0,0,0,0.04)]',
        // Dark mode: white top highlight
        'dark:before:shadow-[0_-1px_rgba(255,255,255,0.08)]',
    ],
})
</script>
