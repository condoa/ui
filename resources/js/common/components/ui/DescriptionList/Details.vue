<template>
    <Primitive data-slot="description-list-details" v-bind="reactiveOmit(props, 'class', 'text')" :class="descriptionListDetailsStyles({ class: props.class })">
        <slot>{{ text }}</slot>
    </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

export type DescriptionDetailsProps = PrimitiveProps & {
    /**
     * Text to display in the description details
     */
    text?: string
    /**
     * Custom class(es) to add to the element
     */
    class?: ClassValue
}
</script>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

const descriptionListDetailsStyles = tv({
    base: 'pt-1 pb-3 text-foreground sm:border-t sm:py-3 sm:[&:nth-child(2)]:border-none',
})

const props = withDefaults(defineProps<DescriptionDetailsProps>(), {
    as: 'dd',
})
</script>
