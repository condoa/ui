<template>
    <AccordionItem v-slot="slotProps" data-slot="accordion-item" v-bind="forwarded" :class="accordionItemStyle({ class: props.class })">
        <slot v-bind="slotProps" />
    </AccordionItem>
</template>

<script lang="ts">
import { tv, type ClassValue } from 'tailwind-variants'

export const accordionItemStyle = tv({
    base: 'border-b last:border-b-0',
})
</script>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AccordionItem } from 'reka-ui'
import type { AccordionItemProps } from 'reka-ui'

interface Props extends AccordionItemProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')
</script>
