<template>
    <div
        data-slot="group-text"
        :class="
            cn(
                'relative inline-flex items-center whitespace-nowrap gap-2 rounded-lg border border-input bg-muted not-dark:bg-clip-padding px-[calc(--spacing(3)-1px)] text-muted-foreground text-base sm:text-sm shadow-xs/5 outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/64 dark:before:shadow-[0_-1px_--theme(--color-white/6%)] [&_svg:not([class*=\'size-\'])]:size-4.5 sm:[&_svg:not([class*=\'size-\'])]:size-4 [&_svg]:shrink-0 [&_svg]:-mx-0.5',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>

<script lang="ts" setup>
import { cn } from '@/common/helpers/cn'
import type { ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the group text */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
