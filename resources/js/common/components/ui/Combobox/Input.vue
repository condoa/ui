<template>
    <ComboboxInput data-slot="combobox-input" v-bind="forwarded" :class="styles({ class: props.class })" />
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxInput, type ComboboxInputProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxInputProps {
    class?: ClassValue
    placeholder?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: [
        'h-8.5 w-full min-w-0 flex-1 border-0 bg-transparent rounded-[inherit] px-[calc(--spacing(3)-1px)] leading-8.5 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 selection:bg-primary selection:text-primary-foreground',
        '[transition:background-color_5000000s_ease-in-out_0s]',
        'placeholder:text-muted-foreground/72',
        'md:h-7.5 md:leading-7.5',
    ],
})
</script>
