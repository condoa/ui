<template>
    <DialogTitle data-slot="dialog-title" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ title }}</slot>
    </DialogTitle>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogTitle } from 'reka-ui'
import type { DialogTitleProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DialogTitleProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The title text */
    title?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'title')

const styles = tv({
    base: 'font-heading text-xl font-semibold leading-none',
})
</script>
