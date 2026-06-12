<template>
    <DialogTitle data-slot="sheet-title" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ title }}</slot>
    </DialogTitle>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogTitle } from 'reka-ui'
import type { DialogTitleProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends DialogTitleProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    /** Title text */
    title?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'title')

const styles = tv({
    base: 'font-semibold text-foreground',
})
</script>
