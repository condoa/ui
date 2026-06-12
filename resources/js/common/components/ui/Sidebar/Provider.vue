<template>
  <TooltipProvider :delay-duration="0">
    <div
      data-slot="sidebar-wrapper"
      :style="{
        '--sidebar-width': SIDEBAR_WIDTH,
        '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
      }"
      :class="sideBarProviderStyles({ class: props.class })"
    >
      <slot v-bind="{ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }" />
    </div>
  </TooltipProvider>
</template>

<script lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'
import type { Ref } from 'vue'

export const sideBarProviderStyles = tv({
    base: 'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
})
</script>

<script setup lang="ts">
import { useEventListener, useLocalStorage, useMediaQuery, useVModel } from '@vueuse/core'
import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue'
import {
  provideSidebarContext,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
} from './context'

const props = withDefaults(
    defineProps<{
      /**
       * Default open state of the sidebar.
       * @default true
       */
      defaultOpen?: boolean;
      /**
       * Open state of the sidebar (controlled).
       * @default undefined
       */
      open?: boolean;
      /**
       * Additional classes to apply to the parent element.
       */
      class?: ClassValue;
    }>(),
    {
      defaultOpen: true,
      open: undefined,
    }
  );

  // This uses localStorage to persist the sidebar state.
  const SIDEBAR_STATE = useLocalStorage<boolean>(SIDEBAR_COOKIE_NAME, false);

  const emits = defineEmits<{ "update:open": [open: boolean] }>();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const openMobile = ref(false);

  const open = useVModel(props, "open", emits, {
    defaultValue: props.defaultOpen ? props.defaultOpen : SIDEBAR_STATE.value,
    passive: (props.open === undefined) as false,
  }) as Ref<boolean>;

  function setOpen(value: MaybeRefOrGetter<boolean>) {
    value = toValue(value);
    open.value = value; // emits('update:open', value)
    SIDEBAR_STATE.value = value;
  }

  function setOpenMobile(value: MaybeRefOrGetter<boolean>) {
    value = toValue(value);
    openMobile.value = value;
  }

  // Helper to toggle the sidebar.
  function toggleSidebar() {
    return isMobile.value ? setOpenMobile(!openMobile.value) : setOpen(!open.value);
  }

  useEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  });

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = computed(() => (open.value ? "expanded" : "collapsed"));

  provideSidebarContext({
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  });
</script>
