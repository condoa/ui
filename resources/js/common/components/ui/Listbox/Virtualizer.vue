<template>
    <ListboxVirtualizer v-slot="{ option }" data-slot="listbox-virtualizer" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot :option="option" />
    </ListboxVirtualizer>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ListboxVirtualizer, useForwardProps } from 'reka-ui'
import type { ListboxVirtualizerProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ListboxVirtualizerProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: '',
})
</script>
