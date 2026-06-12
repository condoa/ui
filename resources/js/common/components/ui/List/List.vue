<template>
    <Primitive :class="styles({ class: props.class })" v-bind="forwarded">
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
}

const props = withDefaults(defineProps<Props>(), {
    as: 'ul',
})

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'w-full py-2',
})
</script>
