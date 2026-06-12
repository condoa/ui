<template>
    <Primitive
        data-slot="sidebar-group"
        data-sidebar="group"
        :class="sideBarGroupStyles({ class: props.class })"
        v-bind="forwarded"
    >
        <slot />
    </Primitive>
</template>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const sideBarGroupStyles = tv({
    base: 'relative flex w-full min-w-0 flex-col p-2',
})

interface Props extends PrimitiveProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, ['class']))
</script>
