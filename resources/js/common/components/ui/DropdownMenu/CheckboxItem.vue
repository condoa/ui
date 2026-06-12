<template>
    <DropdownMenuCheckboxItem data-slot="dropdown-menu-checkbox-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <DropdownMenuItemIndicator class="col-start-1" icon="icon-check" />
        <span class="col-start-2">
            <slot>
                <span v-if="title">{{ title }}</span>
            </slot>
        </span>
        <slot name="shortcut">
            <DropdownMenuShortcut v-if="shortcut">{{ shortcut }}</DropdownMenuShortcut>
        </slot>
    </DropdownMenuCheckboxItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuCheckboxItem, useForwardPropsEmits } from 'reka-ui'
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuCheckboxItemProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The shortcut text to display */
    shortcut?: string
    /** The title text to display */
    title?: string
}

const props = defineProps<Props>()

const emits = defineEmits<DropdownMenuCheckboxItemEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'title', 'shortcut', 'class'), emits)

const styles = tv({
    base: "grid min-h-8 cursor-default select-none grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm text-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
})
</script>
