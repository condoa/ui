<template>
    <Primitive data-slot="navbar-mobile" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: [
        'group/navbar-mobile flex items-center gap-x-3 px-4 py-2 md:hidden',
        'group-has-data-navbar-sticky/navbar:sticky group-has-data-navbar-sticky/navbar:top-0',
    ],
})
</script>
