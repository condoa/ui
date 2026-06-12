<template>
    <NavigationMenuIndicator data-slot="navigation-menu-indicator" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
        <div class="relative top-[70%] h-[12px] w-[12px] rotate-[45deg] bg-popover border" />
    </NavigationMenuIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuIndicator } from 'reka-ui'
import type { NavigationMenuIndicatorProps } from 'reka-ui'

interface Props extends NavigationMenuIndicatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'absolute data-[state=hidden]:opacity-0 duration-200 data-[state=visible]:animate-fadeIn data-[state=hidden]:animate-fadeOut top-full w-[var(--reka-navigation-menu-indicator-size)] translate-x-[var(--reka-navigation-menu-indicator-position)] mt-[1px] z-[100] flex h-[10px] items-end justify-center overflow-hidden transition-[all,transform_250ms_ease] motion-reduce:transition-none',
})
</script>
