<template>
    <ComboboxGroup data-slot="combobox-group" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ComboboxGroup>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxGroup, type ComboboxGroupProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxGroupProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'overflow-hidden [[role=group]+&]:mt-1.5',
})
</script>
