<template>
    <UiSeparator
        :class="
            cn(
                '[[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+input+&]:-translate-x-px pointer-events-none relative z-2 bg-input before:absolute before:inset-0 has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:translate-x-px has-[+[data-slot=input-control]:focus-within,+[data-slot=input-group]:focus-within,+[data-slot=select-trigger]:focus-visible+*,+[data-slot=number-field]:focus-within]:bg-ring dark:before:bg-input/32 [[data-slot=input-control]:focus-within+&,[data-slot=input-group]:focus-within+&,[data-slot=select-trigger]:focus-visible+*+&,[data-slot=number-field]:focus-within+&,[data-slot=number-field]:focus-within+input+&]:bg-ring',
                props.class,
            )
        "
        :orientation="orientation"
    />
</template>

<script lang="ts" setup>
import { cn } from '@/common/helpers/cn'
import UiSeparator from '../Separator.vue'
import type { ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the separator */
    class?: ClassValue

    /** The orientation of the separator */
    orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
})
</script>
