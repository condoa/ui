<template>
    <Separator v-bind="forwarded" :class="styles({ class: props.class })" data-slot="command-separator" cmdk-separator>
        <slot />
    </Separator>
</template>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { Separator } from 'reka-ui'
import type { SeparatorProps } from 'reka-ui'

interface Props extends SeparatorProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: '-mx-1 h-px bg-border',
})
</script>
