<template>
  <SidebarMenuButtonChild v-if="!tooltip" v-bind="({ ...forwarded, ...$attrs } as any)">
    <slot />
  </SidebarMenuButtonChild>

  <Tooltip v-else>
    <TooltipTrigger as-child>
      <SidebarMenuButtonChild v-bind="({ ...forwarded, ...$attrs } as any)">
        <slot />
      </SidebarMenuButtonChild>
    </TooltipTrigger>
    <TooltipContent side="right" align="center" :hidden="state !== 'collapsed' || isMobile">
      <template v-if="typeof tooltip === 'string'">
        {{ tooltip }}
      </template>
      <component :is="tooltip" v-else />
    </TooltipContent>
  </Tooltip>
</template>

<script lang="ts">
  import { useForwardProps } from "reka-ui";
  import type { SidebarMenuButtonProps } from "./MenuButtonChild.vue";
  import type { Component } from "vue";
</script>
<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core";
import { useSidebar } from './context'

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<
    SidebarMenuButtonProps & {
      tooltip?: string | Component;
    }
  >(),
  {
    as: "button",
    variant: "default",
    size: "default",
  }
);

const { isMobile, state } = useSidebar();

  const forwarded = useForwardProps(reactiveOmit(props, ["tooltip"]));
</script>
