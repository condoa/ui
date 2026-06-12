<template>
  <Primitive
    data-slot="sidebar-header"
    data-sidebar="header"
    :class="sideBarHeaderStyles({ class: props.class })"
    v-bind="forwarded"
  >
    <slot />
  </Primitive>
</template>
<script lang="ts">
  import { reactiveOmit } from "@vueuse/core";
  import { Primitive, useForwardProps } from "reka-ui";
  import type { PrimitiveProps } from "reka-ui";
import { type ClassValue, tv } from 'tailwind-variants'
  import type { HTMLAttributes } from "vue";

  export const sideBarHeaderStyles = tv({
    base: "flex flex-col gap-2 p-2",
  });
</script>
<script setup lang="ts">
  const props = defineProps<
    PrimitiveProps & {
      /**
       * Additional classes to apply to the parent element.
       */
      class?: ClassValue;
    }
  >();

  const forwarded = useForwardProps(reactiveOmit(props, ["class"]));
</script>
