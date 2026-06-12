<template>
    <Primitive :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ title }}</slot>
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
    /** The title of the component */
    title?: string
}

const props = withDefaults(defineProps<Props>(), {
    as: 'p',
})

const forwarded = reactiveOmit(props, 'class', 'title')

const styles = tv({
    base: 'font-semibold',
})
</script>
