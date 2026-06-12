<template>
    <SelectTrigger data-slot="select-trigger" :data-size="size" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>
            <SelectValue :placeholder="placeholder" />
        </slot>
        <SelectIcon :icon="icon" />
    </SelectTrigger>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectTrigger, type SelectTriggerProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectTriggerProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Icon to render */
    icon?: string
    /** Placeholder text */
    placeholder?: string
    /** Size of the select */
    size?: 'sm' | 'default'
}

const props = withDefaults(defineProps<Props>(), { size: 'default' })

const forwarded = reactiveOmit(props, 'class', 'icon', 'placeholder', 'size')

const styles = tv({
    base: "flex w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm whitespace-nowrap shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-8 data-[size=sm]:h-7 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
})
</script>
