<template>
    <component :is="elementType" :class="badgeVariants({ disabled, size, variant, isCircle, class: props.class })" v-bind="forwarded" @click="onClick">
        <slot />
    </component>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'
import { computed, resolveComponent } from 'vue'

const badgeVariants = tv({
    base: 'inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[0.625rem] border tracking-wide whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
    variants: {
        variant: {
            default: 'border-transparent bg-neutral-800 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 [a&]:hover:bg-neutral-700 dark:[a&]:hover:bg-neutral-200',
            primary: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            success:
                'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive:
                'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
            destructivesolid:
                'border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90',
            destructiveoutline:
                'border-destructive-subtle bg-destructive-subtle/50 hover:bg-destructive-subtle text-destructive shadow-xs dark:bg-input/30 dark:hover:bg-destructive-subtle/50',
            warning:
                'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
            info: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300',
            purple: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300',
            amber: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        },
        disabled: {
            true: 'cursor-not-allowed opacity-50',
        },
        size: {
            sm: 'px-2 h-5 text-xs font-medium [&>svg]:size-[14px]',
            md: 'px-2.5 h-6 text-sm font-medium [&>svg]:size-4',
            lg: 'px-2.5 h-7 text-sm font-medium [&>svg]:size-4',
        },
        isCircle: {
            true: 'rounded-full px-2',
            false: 'rounded-sm px-1.5',
        },
    },
    defaultVariants: {
        isCircle: false,
        variant: 'default',
        disabled: false,
        size: 'sm',
    },
})

type BadgeProps = VariantProps<typeof badgeVariants>

interface Props {
    /** Any additional class that should be added to the badge */
    class?: ClassValue
    /** The variant of the badge */
    variant?: BadgeProps['variant']
    /** The size of the badge */
    size?: BadgeProps['size']
    /** The curve of the badge */
    isCircle?: boolean
    /** The action to perform when the badge is clicked */
    onClick?: () => void
    /** Should the badge be disabled or not */
    disabled?: boolean
    /** The element to render the badge as */
    tag?: string

    href?: string
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class', 'variant', 'onClick', 'disabled'))

const elementType = computed(() => {
    if (props.tag) {
        return props.tag
    }

    if (props.href) {
        return resolveComponent('Link')
    }

    if (props.onClick) {
        return 'button'
    }

    return 'div'
})
</script>
