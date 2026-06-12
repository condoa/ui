<template>
    <Primitive v-bind="forwarded" :class="styles({ class: props.class })" data-slot="navbar-label">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({ base: 'col-start-2 row-start-1 truncate' })
</script>
