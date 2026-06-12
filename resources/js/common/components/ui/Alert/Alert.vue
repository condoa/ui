<template>
    <div v-if="shown" data-slot="alert" :role="variant === 'destructive' || variant === 'warning' ? 'alert' : 'status'" :class="styles().base({ variant, filled, class: props.class })">
        <slot :props="props" name="icon">
            <Icon v-if="icon" aria-hidden="true" data-slot="alert-icon" :name="icon" :class="styles().icon({ variant, filled, class: props.iconClass })"></Icon>
        </slot>
        <div data-slot="alert-content" :class="styles().content({ variant, filled })">
            <slot :props="props">
                <slot name="title">
                    <AlertTitle v-if="title" :title="title" />
                </slot>
                <slot name="description">
                    <AlertDescription v-if="description" :description="description" />
                </slot>
            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'

interface Props {
    /** Custom class to add to the `Alert` parent */
    class?: ClassValue
    /** Classes to add to the icon */
    iconClass?: ClassValue
    /** Whether the alert should have a filled/colored background */
    filled?: boolean
    /** The variant of the `Alert` */
    variant?: VariantProps<typeof styles>['variant']
    /** The title that is passed to the `AlertTitle` component */
    title?: string
    /** The description that is passed to the `AlertDescription` component */
    description?: string
    /** The icon that should be displayed*/
    icon?: string
}

const props = withDefaults(defineProps<Props>(), { modelValue: true, variant: 'default' })

const shown = defineModel<boolean>({ default: true })

const styles = tv({
    slots: {
        base: 'relative flex w-full gap-3 rounded-lg border p-4',
        icon: 'size-4 shrink-0',
        content: 'grow',
    },
    variants: {
        variant: {
            default: {
                base: 'bg-background text-foreground shadow-xs',
                icon: 'text-foreground',
            },
            destructive: {
                base: 'border-destructive/50 text-destructive dark:border-destructive',
                icon: 'text-destructive',
            },
            info: {
                base: 'border-blue-500/50 text-blue-600',
                icon: 'text-blue-600',
            },
            success: {
                base: 'border-emerald-500/50 text-emerald-600',
                icon: 'text-emerald-500',
            },
            warning: {
                base: 'border-amber-500/50 text-amber-600',
                icon: 'text-amber-600',
            },
        },
        filled: {
            true: {},
        },
    },
    defaultVariants: {
        variant: 'default',
        filled: false,
    },
    compoundVariants: [
        {
            filled: true,
            variant: 'default',
            class: { base: 'bg-muted/50 text-foreground', icon: 'text-foreground' },
        },
        {
            filled: true,
            variant: 'destructive',
            class: {
                base: 'bg-destructive text-red-50 shadow-xs',
                icon: 'text-red-50',
            },
        },
        {
            filled: true,
            variant: 'info',
            class: { base: 'bg-blue-500 text-blue-50 shadow-xs', icon: 'text-blue-50' },
        },
        {
            filled: true,
            variant: 'success',
            class: { base: 'bg-emerald-500 text-emerald-50 shadow-xs', icon: 'text-emerald-50' },
        },
        {
            filled: true,
            variant: 'warning',
            class: { base: 'bg-amber-500 text-amber-50 shadow-xs', icon: 'text-amber-50' },
        },
    ],
})
</script>
