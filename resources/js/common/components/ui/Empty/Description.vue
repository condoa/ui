<template>
    <Primitive
        data-slot="empty-description"
        :class="emptyDescriptionStyles({ class: props.class })"
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

const emptyDescriptionStyles = tv({
    base: 'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
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