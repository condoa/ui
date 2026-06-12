<template>
    <div
        data-slot="sidebar-group-content"
        data-sidebar="group-content"
        :class="sideBarGroupContentStyles({ class: props.class })"
    >
        <slot />
    </div>
</template>
<script setup lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'

const sideBarGroupContentStyles = tv({
    base: 'w-full text-sm',
})

interface Props {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
