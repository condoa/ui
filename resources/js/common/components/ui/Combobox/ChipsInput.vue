<template>
    <ComboboxInput data-slot="combobox-chips-input" v-bind="forwarded" :class="styles({ class: props.class })" />
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
        // Flex to fill space, h-6 to match chip height
        'h-5.5 min-w-20 flex-1',
        // No border, transparent bg
        'border-0 bg-transparent px-1 outline-none ring-0',
        // Placeholder and focus
        'placeholder:text-muted-foreground/72 focus:outline-none focus:ring-0',
    ],
})
</script>
