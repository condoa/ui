<template>
    <Primitive data-slot="kbd" :class="styles({ size, class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue, type VariantProps } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** The size of the component */
    size?: VariantProps<typeof styles>['size']
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    as: 'kbd',
    size: 'sm',
})

const forwarded = reactiveOmit(props, 'class', 'size')

const styles = tv({
    base: 'pointer-events-none inline-flex items-center justify-center gap-1 rounded bg-muted px-1 font-sans font-medium text-muted-foreground select-none [&_svg]:!size-3',
    variants: {
        size: {
            xs: 'h-4 min-w-4 text-[10px]',
            sm: 'h-5 min-w-5 text-xs',
            md: 'h-6 min-w-6 text-xs',
        },
    },
    defaultVariants: {
        size: 'sm',
    },
})
</script>
