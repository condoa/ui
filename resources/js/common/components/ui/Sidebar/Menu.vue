<template>
    <ul
        data-slot="sidebar-menu"
        data-sidebar="menu"
        :class="sideBarMenuStyles({ class: props.class })"
    >
        <slot />
    </ul>
</template>
<script setup lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'

const sideBarMenuStyles = tv({
    base: 'flex w-full min-w-0 flex-col gap-1',
})

interface Props {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
