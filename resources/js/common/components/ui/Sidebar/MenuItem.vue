<template>
  <li
    data-slot="sidebar-menu-item"
    data-sidebar="menu-item"
    :class="sideBarMenuItemStyles({ class: props.class })"
  >
    <slot />
  </li>
</template>
<script lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'
  import type { HTMLAttributes } from "vue";

  export const sideBarMenuItemStyles = tv({
    base: "group/menu-item relative",
  });

  export interface SidebarMenuItemProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue;
  }
</script>
<script setup lang="ts">
  const props = defineProps<SidebarMenuItemProps>();
</script>
