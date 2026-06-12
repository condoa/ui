<template>
    <Primitive data-slot="frame-panel-title" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
        <slot>{{ title }}</slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Title text to display */
    title?: string
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: 'text-sm font-medium',
})
</script>
