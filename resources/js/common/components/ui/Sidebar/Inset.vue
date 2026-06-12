<template>
    <main data-slot="sidebar-inset" :class="sideBarInsetStyles({ class: props.class })">
        <slot />
    </main>
</template>

<script lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'

export const sideBarInsetStyles = tv({
    base: 'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-md md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
})

export interface SidebarInsetProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}
</script>

<script setup lang="ts">
const props = defineProps<SidebarInsetProps>()
</script>
