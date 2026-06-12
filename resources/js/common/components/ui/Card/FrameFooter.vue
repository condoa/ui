<template>
    <Primitive data-slot="card-frame-footer" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
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

const props = withDefaults(defineProps<Props>(), { as: 'footer' })

const styles = tv({
    base: 'flex items-center px-4 py-4 lg:rounded-b-md lg:px-6',
})
</script>
