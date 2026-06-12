<template>
    <Primitive :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ subtitle }}</slot>
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
    /** The subtitle of the component */
    subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
    as: 'p',
})

const forwarded = reactiveOmit(props, 'class', 'subtitle')

const styles = tv({
    base: 'text-sm text-muted-foreground',
})
</script>
