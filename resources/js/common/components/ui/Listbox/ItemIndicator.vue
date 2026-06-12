<template>
    <ListboxItemIndicator data-slot="listbox-indicator" v-bind="forwarded">
        <slot>
          <Icon :class="styles({ class: props.class })" :name="icon || 'icon-check'" />
        </slot>
    </ListboxItemIndicator>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { ListboxItemIndicator, useForwardPropsEmits } from 'reka-ui'
import type { ListboxItemIndicatorProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ListboxItemIndicatorProps {
    class?: ClassValue
    icon?: string
}

const props = defineProps<Props>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'size-4 shrink-0 text-primary',
})
</script>
