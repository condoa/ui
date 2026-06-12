<template>
  <Separator
    data-slot="sidebar-separator"
    data-sidebar="separator"
    :class="sideBarSeparatorStyles({ class: props.class })"
  >
    <slot />
  </Separator>
</template>

<script lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'
  import type { HTMLAttributes } from "vue";

  export const sideBarSeparatorStyles = tv({
    base: "mx-2 w-auto bg-sidebar-border",
  });

  export interface SidebarSeparatorProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue;
  }
</script>

<script setup lang="ts">
  const props = defineProps<SidebarSeparatorProps>();
</script>
