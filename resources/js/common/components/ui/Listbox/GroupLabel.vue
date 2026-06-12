<template>
    <ListboxGroupLabel data-slot="listbox-group-label" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ListboxGroupLabel>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ListboxGroupLabel, useForwardProps } from 'reka-ui'
import type { ListboxGroupLabelProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ListboxGroupLabelProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'py-1.5 pr-8 pl-1 text-sm font-semibold',
})
</script>
