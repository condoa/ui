<template>
  <NavigationMenuList data-slot="navigation-menu-list" v-bind="forwarded" :class="styles({ class: props.class })">
    <slot />
  </NavigationMenuList>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuList } from 'reka-ui'
import type { NavigationMenuListProps } from 'reka-ui'

interface Props extends NavigationMenuListProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'group flex flex-1 list-none items-center justify-center gap-1',
})
</script>
