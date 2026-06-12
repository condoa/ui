<template>
    <Primitive
        data-slot="sidebar-footer"
        data-sidebar="footer"
        :class="sideBarFooterStyles({ class: props.class })"
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

const sideBarFooterStyles = tv({
    base: 'flex flex-col gap-2 p-2',
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
