<template>
    <Primitive
        data-slot="empty-title"
        :class="emptyTitleStyles({ class: props.class })"
        v-bind="forwarded"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const emptyTitleStyles = tv({
    base: 'text-lg font-medium tracking-tight',
})

interface Props extends PrimitiveProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'h3' })

const forwarded = reactiveOmit(props, ['class'])
</script>