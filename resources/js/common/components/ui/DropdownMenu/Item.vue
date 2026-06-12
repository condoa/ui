<template>
    <DropdownMenuItem data-slot="dropdown-menu-item" v-bind="forwarded" :data-inset="inset" :data-variant="variant" :class="styles({ inset, class: props.class })">
        <slot>
            <slot name="icon">
                <Icon v-if="icon" :name="icon" class="size-4"></Icon>
            </slot>
            <div class="flex flex-col">
                <slot name="title">
                    <span v-if="title">{{ title }}</span>
                </slot>
                <slot name="subtitle">
                    <span v-if="subtitle" class="text-xs text-muted-foreground">{{ subtitle }}</span>
                </slot>
            </div>
        </slot>
        <slot name="shortcut">
            <DropdownMenuShortcut v-if="shortcut" :variant>{{ shortcut }}</DropdownMenuShortcut>
        </slot>
    </DropdownMenuItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuItem, useForwardPropsEmits } from 'reka-ui'
import Icon from '@/common/components/Icon.vue'
import type { DropdownMenuItemEmits, DropdownMenuItemProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuItemProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Whether to inset the content */
    inset?: boolean
    /** The shortcut text to display */
    shortcut?: string
    /** The title text to display */
    title?: string
    /** The subtitle text to display */
    subtitle?: string
    /** The icon to display */
    icon?: string
    /**
     * The variant of the item.
     *
     * @default "default"
     */
    variant?: 'default' | 'destructive'
}

const props = defineProps<Props>()

const emits = defineEmits<DropdownMenuItemEmits>()

const forwarded = useForwardPropsEmits(
    reactiveOmit(props, 'class', 'inset', 'shortcut', 'title', 'subtitle', 'icon'),
    emits,
)

const styles = tv({
    base: "relative flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm text-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-64 data-[variant=destructive]:text-destructive-foreground sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg]:-mx-0.5",
    variants: {
        inset: {
            true: 'ps-8',
        },
    },
})
</script>
