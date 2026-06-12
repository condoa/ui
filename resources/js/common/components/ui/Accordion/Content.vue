<template>
    <AccordionContent data-slot="accordion-content" v-bind="forwarded" :class="styles({ class: props.class })">
        <div class="pt-0 pb-4">
            <slot>{{ content }}</slot>
        </div>
    </AccordionContent>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AccordionContent } from 'reka-ui'
import type { AccordionContentProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends AccordionContentProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The content of the accordion */
    content?: unknown
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'content')

const styles = tv({
    base: 'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:data-[state=open]:!animate-none motion-reduce:data-[state=closed]:!animate-none',
})
</script>
