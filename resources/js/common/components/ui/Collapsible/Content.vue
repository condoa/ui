<template>
    <CollapsibleContent data-slot="collapsible-content" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </CollapsibleContent>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { CollapsibleContent } from 'reka-ui'
import type { CollapsibleContentProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends CollapsibleContentProps {
    /** Customer class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'overflow-hidden transition duration-200 will-change-auto data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:data-[state=open]:!animate-none motion-reduce:data-[state=closed]:!animate-none',
})
</script>
