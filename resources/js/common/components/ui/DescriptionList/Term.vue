<template>
    <Primitive data-slot="description-list-term" v-bind="reactiveOmit(props, 'class', 'text')" :class="descriptionListTermStyles({ class: props.class })">
        <slot>{{ text }}</slot>
    </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

export type DescriptionTermProps = PrimitiveProps & {
    /**
     * Text to display in the description term
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

const descriptionListTermStyles = tv({
    base: 'border-t pt-3 text-muted-foreground first:border-none sm:py-3',
})

const props = withDefaults(defineProps<DescriptionTermProps>(), {
    as: 'dt',
})
</script>
