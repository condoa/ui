<template>
    <div
        data-slot="sidebar-content"
        data-sidebar="content"
        :class="sideBarContentStyles({ class: props.class })"
    >
        <slot />
    </div>
</template>
<script setup lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'

const sideBarContentStyles = tv({
    base: 'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
})

interface Props {
    /**
     * Additional classes to apply to the sidebar content.
     */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
