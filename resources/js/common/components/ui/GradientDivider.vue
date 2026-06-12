<template>
    <Separator v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Separator } from 'reka-ui'
import type { SeparatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SeparatorProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'h-px w-full border-t-0 bg-[linear-gradient(90deg,--alpha(var(--color-input)/10%),_var(--color-input),_--alpha(var(--color-input)/10%))]',
})
</script>
