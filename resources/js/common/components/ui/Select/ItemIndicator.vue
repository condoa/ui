<template>
    <SelectItemIndicator data-slot="select-item-indicator" v-bind="forwarded" class="flex items-center justify-center">
        <slot>
            <Icon :class="styles({ class: props.class })" :name="icon || 'icon-check'"></Icon>
        </slot>
    </SelectItemIndicator>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectItemIndicator, type SelectItemIndicatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectItemIndicatorProps {
    /** Icon to render */
    icon?: string
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'size-4',
})
</script>
