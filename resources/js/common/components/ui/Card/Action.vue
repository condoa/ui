<template>
    <Primitive data-slot="card-action" :class="styles({ class: props.class })" :as="as" :as-child="asChild">
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
    base: 'col-start-2 row-span-2 row-start-1 inline-flex justify-self-end self-start',
})
</script>
