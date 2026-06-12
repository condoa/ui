<template>
    <Primitive data-slot="skeleton" :class="styles({ loading, class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const styles = tv({
    base: 'animate-pulse motion-reduce:animate-none rounded-md bg-muted',
    variants: {
        loading: { true: 'cursor-wait', false: 'cursor-default' },
    },
})

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    /** Whether the skeleton is loading */
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const forwarded = reactiveOmit(props, 'class', 'loading')
</script>
