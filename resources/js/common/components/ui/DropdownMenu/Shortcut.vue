<template>
    <Primitive data-slot="dropdown-menu-shortcut" :class="styles({ variant: props.variant, class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /**
     * The variant of the item.
     *
     * @default "default"
     */
    variant?: 'default' | 'destructive'
}

const props = withDefaults(defineProps<Props>(), {
    as: 'span',
})

const forwarded = reactiveOmit(props, 'class', 'variant')

const styles = tv({
    base: 'ms-auto font-medium font-sans text-xs tracking-widest',
    variants: {
        variant: {
            default: 'text-muted-foreground/72',
            destructive: 'text-destructive',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})
</script>
