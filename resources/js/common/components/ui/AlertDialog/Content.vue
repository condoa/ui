<template>
    <AlertDialogPortal :to="to">
        <slot name="overlay">
            <AlertDialogOverlay />
        </slot>
        <AlertDialogContent
            data-slot="alert-dialog-popup"
            :class="styles({ bottomStickOnMobile, class: props.class })"
            v-bind="{ ...forwarded, ...$attrs }"
        >
            <slot />
        </AlertDialogContent>
    </AlertDialogPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AlertDialogContent, useForwardPropsEmits } from 'reka-ui'
import type { AlertDialogContentEmits, AlertDialogContentProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props extends AlertDialogContentProps {
    /** Custom class(es) to add to the `AlertDialogContent` */
    class?: ClassValue
    /** The element to render the portal into */
    to?: string | HTMLElement
    /** Whether to stick to bottom on mobile */
    bottomStickOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bottomStickOnMobile: true,
})

const emit = defineEmits<AlertDialogContentEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'to', 'bottomStickOnMobile'), emit)

const styles = tv({
    base: 'relative z-50 flex max-h-full min-h-0 w-full min-w-0 flex-col rounded-md border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none transition-all duration-200 will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(1rem-1px)] before:shadow-[0_1px_var(--color-black)/4%] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 md:max-w-lg dark:before:shadow-[0_-1px_var(--color-white)/6%]',
    variants: {
        bottomStickOnMobile: {
            true: 'fixed inset-x-0 bottom-0 top-auto max-md:max-w-none max-md:rounded-b-none max-md:border-x-0 max-md:border-b-0 max-md:before:hidden max-md:before:rounded-none max-md:data-[state=closed]:slide-out-to-bottom-4 max-md:data-[state=open]:slide-in-from-bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
            false: 'fixed left-1/2 top-1/2 max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
        },
    },
    defaultVariants: {
        bottomStickOnMobile: true,
    },
})
</script>