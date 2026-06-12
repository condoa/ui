<template>
    <Primitive
        data-slot="drawer-header"
        v-bind="forwarded"
        :class="drawerHeaderStyles({ class: props.class })"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const drawerHeaderStyles = tv({
    base: 'grid gap-1.5 p-4 text-center sm:text-left',
})

interface Props extends PrimitiveProps {
    /**
     * Classes to add to the header.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
})

const forwarded = useForwardProps(reactiveOmit(props, ['class']))
</script>
