<template>
    <Button
        :title="label"
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="ghost"
        size="icon"
        :class="sideBarTriggerStyles({ class: props.class })"
        @click="toggleSidebar"
    >
        <slot v-bind="{ state }">
        <Icon v-if="icon" :name="icon" aria-hidden="true" />
        <span class="sr-only">{{ label }}</span>
        </slot>
    </Button>
</template>
<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'

const sideBarTriggerStyles = tv({
    base: 'size-7',
})

const props = withDefaults(
    defineProps<{
        /**
         * The icon to display in the trigger.
         * @default "icon-panel-left"
         */
        icon?: string
        /**
         * Additional classes to apply to the parent element.
         */
        class?: ClassValue
        /**
         * The label for the trigger.
         * @default "Toggle Sidebar"
         */
        label?: string
    }>(),
    {
        icon: 'icon-panel-left',
        label: 'Toggle Sidebar',
    },
)

import { useSidebar } from './context'
import { type ClassValue, tv } from 'tailwind-variants'

const { toggleSidebar, state } = useSidebar()
</script>
