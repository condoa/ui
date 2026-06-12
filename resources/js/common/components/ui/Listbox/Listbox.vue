<template>
    <ListboxRoot v-slot="{ modelValue }" data-slot="listbox" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot :model-value="modelValue" />
    </ListboxRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ListboxRoot, useForwardPropsEmits } from 'reka-ui'
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ListboxRootProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const emits = defineEmits<ListboxRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'relative flex flex-col gap-4',
})
</script>
