<template>
    <Primitive data-slot="timeline-title" aria-hidden="true" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, ['class']))

const styles = tv({
    base: 'text-sm font-medium',
})
</script>
