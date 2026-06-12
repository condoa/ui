<template>
    <div class="perspective-[2000px] absolute top-full left-1/2 -translate-x-1/2 flex justify-center">
        <NavigationMenuViewport data-slot="navigation-menu-viewport" v-bind="{ ...forwarded, ...$attrs }" :class="styles({ class: props.class })" />
    </div>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import { NavigationMenuViewport } from 'reka-ui'
import type { NavigationMenuViewportProps } from 'reka-ui'

defineOptions({ inheritAttrs: false })

interface Props extends NavigationMenuViewportProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'relative mt-[10px] h-[var(--reka-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-sm transition-[width,height] duration-300 motion-reduce:transition-none sm:w-[var(--reka-navigation-menu-viewport-width)] data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut',
})
</script>
