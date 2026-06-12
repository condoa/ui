<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import { type ClassValue, tv, type VariantProps } from 'tailwind-variants'
import Badge from './Badge.vue'

interface Props {
    class?: ClassValue
    iconClass?: ClassValue
    percentageClass?: ClassValue
    icon?: string
    value?: string
    description?: string
    percentage?: number
    variant?: VariantProps<typeof styles>['variant']
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
})

const styles = tv({
    slots: {
        base: 'relative p-4 rounded-md border flex flex-row items-center justify-between gap-2',
        value: 'text-md tabular-nums font-bold',
        description: 'text-xs text-muted-foreground',
        icon: 'absolute top-1/2 right-6 -translate-y-1/2 size-6',
        percentage: 'text-primary-foreground text-[0.625rem] font-medium',
    },
    variants: {
        variant: {
            default: {
                base: 'bg-background text-foreground border border-input',
                value: 'text-accent-foreground',
                description: '',
                icon: 'text-muted-foreground',
                percentage: 'bg-accent-foreground',
            },
            destructive: {
                base: 'border-destructive/30',
                value: 'text-destructive',
                description: '',
                icon: 'text-destructive',
                percentage: 'bg-destructive',
            },
            warning: {
                base: 'border-amber-500/50',
                value: 'text-amber-600',
                description: '',
                icon: 'text-amber-600',
                percentage: 'bg-amber-600',
            },
        },
    },
})
</script>

<template>
    <div :class="styles().base({ variant, class: props.class })">
        <slot>
            <div class="leading-none">
                <div :class="styles().value({ variant, class: props.iconClass })">{{ value }}</div>
                <div :class="styles().description({ variant, class: props.iconClass })">{{ description }}</div>
            </div>
        </slot>
        <Icon v-if="icon && !percentage" :name="icon" :class="styles().icon({ variant, class: props.iconClass })" aria-hidden="true" />
        <template v-if="percentage">
            <Badge class="items-baseline gap-1.5" :class="styles().percentage({ variant, class: props.percentageClass })">
                {{ percentage }}%
            </Badge>
        </template>
    </div>
</template>
