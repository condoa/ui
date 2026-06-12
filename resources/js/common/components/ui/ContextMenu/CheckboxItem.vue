<template>
    <ContextMenuCheckboxItem data-slot="context-menu-checkbox-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
            <ContextMenuItemIndicator icon="icon-check" />
        </span>
        <slot>
            <span v-if="title">{{ title }}</span>
        </slot>
        <slot name="shortcut">
            <ContextMenuShortcut v-if="shortcut">{{ shortcut }}</ContextMenuShortcut>
        </slot>
    </ContextMenuCheckboxItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { ContextMenuCheckboxItem, useForwardPropsEmits } from 'reka-ui'
import type { ContextMenuCheckboxItemEmits, ContextMenuCheckboxItemProps } from 'reka-ui'

interface Props extends ContextMenuCheckboxItemProps {
    /**Custom class(es) to add to the element */
    class?: ClassValue
    /**The shortcut for the item */
    shortcut?: string
    /**The title for the item */
    title?: string
}

const props = defineProps<Props>()

const emits = defineEmits<ContextMenuCheckboxItemEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'shortcut', 'title'), emits)

const styles = tv({
    base: "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
})
</script>
