<template>
    <Primitive data-slot="dialog-header" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
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
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'flex shrink-0 flex-col gap-2 p-6 max-md:pb-4',
})
</script>
