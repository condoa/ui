<template>
    <NumberFieldRoot v-slot="rootSlotProps" data-slot="number-field" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot v-bind="rootSlotProps">
            <slot name="decrement">
                <NumberFieldDecrement />
            </slot>
            <slot name="input">
                <NumberFieldInput />
            </slot>
            <slot name="increment">
                <NumberFieldIncrement />
            </slot>
        </slot>
    </NumberFieldRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { NumberFieldRoot, useForwardPropsEmits } from 'reka-ui'
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends NumberFieldRootProps {
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits<NumberFieldRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emit)

const styles = tv({
    base: 'flex h-9 w-full items-center gap-1 rounded-md border border-input bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
})
</script>
