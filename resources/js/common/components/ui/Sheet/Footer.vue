<template>
    <Primitive data-slot="sheet-footer" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'mt-auto flex flex-col-reverse gap-2 border-t bg-muted/72 px-6 py-4 sm:flex-row sm:justify-end',
})
</script>
