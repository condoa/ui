<template>
    <Primitive data-slot="empty" :data-variant="props.variant" :class="emptyStyles({ class: props.class, variant })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'

const emptyStyles = tv({
    base: 'flex min-w-0 flex-1 rounded-lg border-dashed text-balance',
    variants: {
        variant: {
            default: 'flex-col items-center justify-center gap-6 p-6 text-center md:p-12',
            horizontal: 'flex-row items-center gap-8 p-4',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

interface Props extends PrimitiveProps {
    /**
     * Additional classes to apply to the empty state container.
     */
    class?: ClassValue
    /**
     * Layout variant.
     * @default 'default'
     */
    variant?: VariantProps<typeof emptyStyles>['variant']
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, ['class', 'variant'])
</script>