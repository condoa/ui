<template>
    <AccordionHeader data-slot="accordion-header" v-bind="forwarded" :class="accordionHeaderStyle({ class: props.class })">
        <slot />
    </AccordionHeader>
</template>

<script lang="ts">
import { tv, type ClassValue } from 'tailwind-variants'

export const accordionHeaderStyle = tv({
    base: 'flex',
})
</script>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AccordionHeader } from 'reka-ui'
import type { AccordionHeaderProps } from 'reka-ui'

interface Props extends AccordionHeaderProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')
</script>
