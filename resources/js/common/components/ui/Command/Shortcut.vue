<template>
    <Primitive :as="as || 'span'" :as-child="asChild" :class="styles({ class: props.class })" aria-hidden="true">
        <slot>{{ shortcut }}</slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    /** The shortcut text to render */
    shortcut?: any
}

const props = defineProps<Props>()

const styles = tv({
    base: 'ml-auto text-xs tracking-widest text-muted-foreground',
})
</script>
