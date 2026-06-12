<template>
    <ToggleRoot v-slot="slotProps" data-slot="toggle" v-bind="forwarded" :class="toggleStyles({ variant, size, class: props.class })">
        <slot v-bind="slotProps" />
    </ToggleRoot>
</template>

<script lang="ts">
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'

export const toggleStyles = tv({
    base: 'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors motion-reduce:transition-none hover:bg-muted hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    variants: {
        variant: {
            default: 'bg-transparent',
            outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        },
        size: {
            xs: 'h-7 min-w-7 px-2',
            default: 'h-9 min-w-9 px-3',
            sm: 'h-8 min-w-8 px-2.5',
            lg: 'h-10 min-w-10 px-5',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
})

export type ToggleVariants = VariantProps<typeof toggleStyles>
</script>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Toggle as ToggleRoot } from 'reka-ui'
import type { ToggleProps } from 'reka-ui'
import { computed } from 'vue'

interface Props extends /* @vue-ignore */ Omit<ToggleProps, 'modelValue'> {
    /** Additional classes for the toggle */
    class?: ClassValue
    /** Variant of the toggle */
    variant?: ToggleVariants['variant']
    /** Size of the toggle */
    size?: ToggleVariants['size']
}

const props = defineProps<Props>()

const modelValue = defineModel<boolean>({ default: false })

const forwarded = computed(() => ({
    ...reactiveOmit(props, 'class', 'variant', 'size'),
    modelValue: modelValue.value,
    'onUpdate:modelValue': (value: boolean) => {
        modelValue.value = value
    },
}))
</script>
