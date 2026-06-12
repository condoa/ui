<template>
    <AccordionTrigger data-slot="accordion-trigger" v-bind="forwarded" :class="accordionTriggerStyle({ class: props.class })">
        <slot :props="props">
            {{ title }}
        </slot>
        <slot name="icon" :props="props">
            <Icon v-if="icon" aria-hidden="true" data-slot="accordion-trigger-icon" :name="icon" class="pointer-events-none size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none" />
        </slot>
    </AccordionTrigger>
</template>

<script lang="ts">
import { tv, type ClassValue } from 'tailwind-variants'

export const accordionTriggerStyle = tv({
    base: 'flex w-full flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>[data-slot=accordion-trigger-icon]]:rotate-180',
})
</script>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { AccordionTrigger } from 'reka-ui'
import type { AccordionTriggerProps } from 'reka-ui'

interface Props extends AccordionTriggerProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The title of the accordion trigger */
    title?: string
    /** The icon to show next to the title */
    icon?: string
}

const props = withDefaults(defineProps<Props>(), {
    class: undefined,
    title: '',
    icon: 'icon-chevron-down',
})

const forwarded = reactiveOmit(props, 'class', 'icon', 'title')
</script>
