<template>
    <NavigationMenuTrigger data-slot="navigation-menu-trigger" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>{{ title }}</slot>
        <slot name="icon">
            <Icon :name="icon || 'icon-chevron-down'" class="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
        </slot>
    </NavigationMenuTrigger>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { tv, type ClassValue } from 'tailwind-variants'
import Icon from '@/common/components/Icon.vue'
import { NavigationMenuTrigger } from 'reka-ui'
import type { NavigationMenuTriggerProps } from 'reka-ui'

const styles = tv({
    base: 'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm transition-[color,box-shadow] motion-reduce:transition-none outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent',
})

interface Props extends NavigationMenuTriggerProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Icon to show */
    icon?: string
    /** Title to show */
    title?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon', 'title')
</script>
