<template>
    <Primitive data-slot="timeline-indicator" aria-hidden="true" v-bind="forwarded" :class="styles({ class: props.class })">
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
    base: 'absolute size-4 rounded-full border-2 border-primary/20 group-data-completed/timeline-item:border-primary group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2',
})
</script>
