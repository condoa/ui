<template>
    <Primitive data-slot="frame" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: [
        'relative flex flex-col rounded-md bg-muted/72 p-1',
        // Spacing between stacked panels
        '*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1',
    ],
})
</script>
