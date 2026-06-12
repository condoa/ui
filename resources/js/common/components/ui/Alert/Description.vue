<template>
    <Primitive data-slot="alert-description" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>{{ description }}</slot>
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PrimitiveProps {
    /** Custom class to add to the parent */
    class?: ClassValue
    /** The description text that should be displayed */
    description?: string
}

const props = withDefaults(defineProps<Props>(), { as: 'div' })

const forwarded = reactiveOmit(props, 'class', 'description')

const styles = tv({
    base: 'col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
})
</script>
