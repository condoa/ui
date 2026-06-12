<template>
    <NavigationMenuItem :class="styles({ class: props.class })" data-slot="navigation-menu-item" v-bind="props">
        <slot />
    </NavigationMenuItem>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuItem } from 'reka-ui'
import type { NavigationMenuItemProps } from 'reka-ui'

interface Props extends NavigationMenuItemProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({ base: 'relative' })
</script>
