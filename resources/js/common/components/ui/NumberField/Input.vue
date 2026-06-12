<template>
    <NumberFieldInput data-slot="number-field-input" v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { NumberFieldInput, useForwardProps } from 'reka-ui'
import type { NumberFieldInputProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends NumberFieldInputProps {
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {})

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'h-full w-full border-transparent focus-visible:ring-transparent grow bg-transparent text-center text-sm placeholder:text-muted-foreground/80 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
})
</script>
