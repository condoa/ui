<template>
    <div :class="[scrollFade && 'scroll-fade', 'min-h-0 flex-1 overflow-y-auto']">
        <Primitive data-slot="dialog-panel" :class="styles({ class: props.class })" v-bind="forwarded">
            <slot />
        </Primitive>
    </div>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Whether to show scroll fade effect */
    scrollFade?: boolean
}

const props = withDefaults(defineProps<Props>(), { as: 'div', scrollFade: true })

const forwarded = reactiveOmit(props, 'class', 'scrollFade')

const styles = tv({
    base: 'p-6 in-[[data-slot=dialog-popup]:has([data-slot=dialog-header])]:pt-1 in-[[data-slot=dialog-popup]:has([data-slot=dialog-footer]:not(.border-t))]:pb-1',
})
</script>
