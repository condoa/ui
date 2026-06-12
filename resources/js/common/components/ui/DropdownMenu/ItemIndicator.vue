<template>
    <DropdownMenuItemIndicator data-slot="dropdown-menu-item-indicator" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon v-if="icon" :name="icon" class="size-4"></Icon>
        </slot>
    </DropdownMenuItemIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { DropdownMenuItemIndicator } from 'reka-ui'
import type { DropdownMenuItemIndicatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuItemIndicatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The icon to display */
    icon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'flex items-center justify-center',
})
</script>
