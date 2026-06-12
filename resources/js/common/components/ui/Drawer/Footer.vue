<template>
    <Primitive
        data-slot="drawer-footer"
        v-bind="forwarded"
        :class="drawerFooterStyles({ class: props.class })"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const drawerFooterStyles = tv({
    base: 'mt-auto flex flex-col gap-2 p-4',
})

interface Props extends PrimitiveProps {
    /**
     * Classes to add to the parent.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
})

const forwarded = useForwardProps(reactiveOmit(props, ['class']))
</script>
