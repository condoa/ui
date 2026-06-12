<template>
    <PinInputInput data-slot="input-pin-input" v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { PinInputInput } from 'reka-ui'
import type { PinInputInputProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PinInputInputProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: [
        'size-9 rounded-md border border-input bg-transparent p-1 text-center text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    ],
})
</script>
