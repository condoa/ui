<template>
    <Primitive
        data-slot="alert-dialog-footer"
        :class="styles({ variant, class: props.class })"
        v-bind="forwarded"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    /** Footer variant */
    variant?: 'default' | 'bare'
}

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    class: undefined,
    variant: 'default',
})

const forwarded = reactiveOmit(props, 'class', 'variant')

const styles = tv({
    base: 'flex shrink-0 flex-col-reverse gap-2 px-6 max-md:*:w-full md:flex-row md:justify-end md:rounded-b-[calc(1rem-1px)]',
    variants: {
        variant: {
            default: 'border-t bg-muted/72 py-4',
            bare: 'pb-6',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})
</script>
