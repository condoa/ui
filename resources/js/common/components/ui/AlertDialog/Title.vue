<template>
    <AlertDialogTitle
        data-slot="alert-dialog-title"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    >
        <slot>{{ title }}</slot>
    </AlertDialogTitle>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogTitle } from 'reka-ui'
import type { AlertDialogTitleProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends AlertDialogTitleProps {
    /** Text to display in the title */
    title?: string
    /** Custom class(es) to add to the title */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'title')

const styles = tv({ base: 'text-xl leading-none font-semibold' })
</script>
