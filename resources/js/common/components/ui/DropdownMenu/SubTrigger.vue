<template>
    <DropdownMenuSubTrigger data-slot="dropdown-menu-sub-trigger" v-bind="forwarded" :class="styles({ inset, class: props.class })">
        <slot>
            <Icon v-if="icon" :name="icon" class="size-4"></Icon>
            <span v-if="title">{{ title }}</span>
        </slot>
        <Icon :name="trailingIcon || 'icon-chevron-right'" class="-me-0.5 ms-auto text-muted-foreground"></Icon>
    </DropdownMenuSubTrigger>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { DropdownMenuSubTrigger } from 'reka-ui'
import type { DropdownMenuSubTriggerProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuSubTriggerProps {
    /** Custom class(es) to add to the element */
    class?: ClassValue
    /** Whether to inset the content */
    inset?: boolean
    /** The icon to display */
    icon?: string
    /** The title for the item */
    title?: string
    /** The trailing icon to display */
    trailingIcon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'inset', 'icon', 'title', 'trailingIcon')

const styles = tv({
    base: 'flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm text-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground data-[disabled]:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*="size-"])]:size-4.5 sm:[&_svg:not([class*="size-"])]:size-4 [&_svg]:pointer-events-none',
    variants: {
        inset: {
            true: 'ps-8',
        },
    },
})
</script>
