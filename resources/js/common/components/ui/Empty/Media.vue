<template>
    <Primitive
        data-slot="empty-icon"
        :data-variant="props.variant"
        :class="emptyMediaStyles({ class: props.class, variant })"
        v-bind="forwarded"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'

const emptyMediaStyles = tv({
    base: 'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
    variants: {
        variant: {
            default: 'mb-2 bg-transparent',
            icon: "mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
            illustration: 'mb-0 flex size-48 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-muted-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})

interface Props extends PrimitiveProps {
    /**
     * Additional classes to apply to the empty media container.
     */
    class?: ClassValue
    /**
     * The variant of the empty media component.
     * @default 'default'
     */
    variant?: VariantProps<typeof emptyMediaStyles>['variant']
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, ['class', 'variant'])
</script>