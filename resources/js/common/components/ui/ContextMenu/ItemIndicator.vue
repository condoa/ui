<template>
    <ContextMenuItemIndicator v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon v-if="icon" :name="icon" class="size-4" aria-hidden="true" />
        </slot>
    </ContextMenuItemIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import Icon from '@/common/components/Icon.vue'
import { ContextMenuItemIndicator, type ContextMenuItemIndicatorProps } from 'reka-ui'

interface Props extends ContextMenuItemIndicatorProps {
    /** The icon to display */
    icon?: string
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'icon')

const styles = tv({
    base: 'flex items-center justify-center',
})
</script>
