<template>
    <Primitive data-slot="sheet-header" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'flex flex-col gap-1.5 p-4',
})
</script>
