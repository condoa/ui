<template>
    <Primitive data-slot="frame-panel-description" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
        <slot>{{ description }}</slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Description text to display */
    description?: string
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: 'text-sm text-muted-foreground',
})
</script>
