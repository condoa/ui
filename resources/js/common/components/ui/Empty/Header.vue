<template>
    <Primitive
        data-slot="empty-header"
        :class="emptyHeaderStyles({ class: props.class })"
        v-bind="forwarded"
    >
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

const emptyHeaderStyles = tv({
    base: 'flex flex-col gap-2 [[data-variant=default]>&]:items-center [[data-variant=default]>&]:text-center [[data-variant=horizontal]>&]:items-start [[data-variant=horizontal]>&]:text-left',
})

interface Props extends PrimitiveProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, ['class'])
</script>