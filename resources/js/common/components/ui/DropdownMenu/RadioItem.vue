<template>
    <DropdownMenuRadioItem data-slot="dropdown-menu-radio-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <DropdownMenuItemIndicator class="col-start-1">
            <Icon v-if="icon" :name="icon" class="size-4"></Icon>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5.252 12.7 10.2 18.63 18.748 5.37" />
            </svg>
        </DropdownMenuItemIndicator>
        <span class="col-start-2">
            <slot>{{ title }}</slot>
        </span>
    </DropdownMenuRadioItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { DropdownMenuRadioItem, useForwardPropsEmits } from 'reka-ui'
import type { DropdownMenuRadioItemEmits, DropdownMenuRadioItemProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuRadioItemProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The icon to display */
    icon?: string
    /** The title text to display */
    title?: string
}

const props = defineProps<Props>()

const emits = defineEmits<DropdownMenuRadioItemEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'icon', 'title'), emits)

const styles = tv({
    base: "grid min-h-8 cursor-default select-none grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm text-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-64 sm:min-h-7 sm:text-sm [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
})
</script>
