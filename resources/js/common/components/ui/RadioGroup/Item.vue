<template>
    <RadioGroupItem data-slot="radio-group-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <RadioGroupIndicator :icon="props.icon" />
        </slot>
    </RadioGroupItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { RadioGroupItem, type RadioGroupItemProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends RadioGroupItemProps {
    /** Class to apply to the item */
    class?: ClassValue
    /** Icon to show */
    icon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
})
</script>
