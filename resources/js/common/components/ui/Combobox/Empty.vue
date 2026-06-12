<template>
    <ComboboxEmpty data-slot="combobox-empty" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>No results found.</slot>
    </ComboboxEmpty>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxEmpty, type ComboboxEmptyProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxEmptyProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'p-2 text-center text-sm text-muted-foreground',
})
</script>
