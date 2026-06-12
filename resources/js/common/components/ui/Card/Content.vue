<template>
    <Primitive data-slot="card-panel" :as="as" :as-child="asChild" :class="styles({ class: props.class })">
        <slot>
            {{ content }}
        </slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Content to display in the card */
    content?: string
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const styles = tv({
    base: 'flex-1 px-6 pb-6',
})
</script>
