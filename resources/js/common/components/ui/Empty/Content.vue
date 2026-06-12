<template>
    <Primitive
        data-slot="empty-content"
        :class="emptyContentStyles({ class: props.class })"
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

const emptyContentStyles = tv({
    base: 'flex w-full min-w-0 flex-col gap-4 text-sm text-balance [[data-variant=default]>&]:items-center [[data-variant=horizontal]>&]:items-start',
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