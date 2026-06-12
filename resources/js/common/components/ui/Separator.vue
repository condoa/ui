<template>
    <Separator
        data-slot="separator"
        v-bind="forwarded"
        :class="styles({ orientation, class: props.class })"
    />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Separator, useForwardProps } from 'reka-ui'
import type { SeparatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SeparatorProps {
    /** Custom class(es) to add to the separator */
    class?: ClassValue

    orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    decorative: true,
})

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'shrink-0 bg-border',
    variants: {
        orientation: {
            horizontal: 'h-px w-full',
            vertical: 'h-full w-px',
        },
    },
})
</script>
