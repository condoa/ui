<template>
    <Primitive data-slot="description-list" v-bind="reactiveOmit(props, 'class')" :class="descriptionListDetailsStyles({ class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'

export type DescriptionDetailsProps = PrimitiveProps & {
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
    base: 'grid grid-cols-1 text-sm/6 sm:grid-cols-2',
})

const props = withDefaults(defineProps<DescriptionDetailsProps>(), {
    as: 'dl',
})
</script>
