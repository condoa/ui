<template>
    <Primitive data-slot="timeline-date" v-bind="forwarded" :class="styles({ class: props.class })">
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

const props = withDefaults(defineProps<Props>(), { as: 'time' })

const forwarded = useForwardProps(reactiveOmit(props, ['class']))

const styles = tv({
    base: 'mb-1 block text-xs font-medium text-muted-foreground group-data-[orientation=vertical]/timeline:max-md:h-4',
})
</script>
