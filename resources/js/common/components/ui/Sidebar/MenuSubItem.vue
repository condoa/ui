<template>
  <li
    data-slot="sidebar-menu-sub-item"
    data-sidebar="menu-sub-item"
    :class="sideBarMenuSubItemStyles({ class: props.class })"
  >
    <slot />
  </li>
</template>

<script lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'
  import type { HTMLAttributes } from "vue";

  export const sideBarMenuSubItemStyles = tv({
    base: "group/menu-sub-item relative",
  });

  export interface SidebarMenuSubItemProps {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue;
  }
</script>
<script setup lang="ts">
  const props = defineProps<SidebarMenuSubItemProps>();
</script>
