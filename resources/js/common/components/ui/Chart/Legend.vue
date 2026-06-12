<script setup lang="ts">
import { tv } from 'tailwind-variants'
import Badge from '../Badge.vue'

export interface ChartLegendItem {
    label: string
    color: string
    value?: number | string
    percentage?: number
}

const props = withDefaults(
    defineProps<{
        items: ChartLegendItem[]
        layout?: 'vertical' | 'horizontal'
        itemWidth?: 'auto' | 'full'
        size?: 'sm' | 'md'
        dotShape?: 'square' | 'circle'
        showValue?: boolean
        showPercentage?: boolean
        interactive?: boolean
        formatValue?: (value: number | string) => string
    }>(),
    {
        layout: 'horizontal',
        itemWidth: 'auto',
        size: 'sm',
        dotShape: 'square',
        showValue: false,
        showPercentage: true,
        interactive: true,
    }
)

const hoveredIndex = defineModel<number | null>('hoveredIndex', { default: null })

const containerStyles = tv({
    base: '',
    variants: {
        layout: {
            vertical: 'flex flex-col',
            horizontal: 'flex flex-wrap',
        },
        size: {
            sm: '',
            md: '',
        },
    },
    compoundVariants: [
        { layout: 'vertical', size: 'sm', class: 'gap-1' },
        { layout: 'vertical', size: 'md', class: 'gap-1.5' },
        { layout: 'horizontal', size: 'sm', class: 'gap-x-1 gap-y-1' },
        { layout: 'horizontal', size: 'md', class: 'gap-x-2 gap-y-1.5' },
    ],
    defaultVariants: {
        layout: 'horizontal',
        size: 'sm',
    },
})

const itemStyles = tv({
    base: 'flex items-center rounded-md cursor-default transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none',
    variants: {
        size: {
            sm: 'gap-1.5 px-2 py-1 text-xs',
            md: 'gap-3 px-2 py-1.5 text-sm',
        },
        itemWidth: {
            auto: '',
            full: 'w-full',
        },
        highlighted: {
            true: 'bg-muted',
            false: '',
        },
        dimmed: {
            true: 'opacity-50',
            false: '',
        },
    },
    defaultVariants: {
        size: 'sm',
        itemWidth: 'auto',
        highlighted: false,
        dimmed: false,
    },
})

const dotStyles = tv({
    base: 'shrink-0 transition-transform duration-150 ease-out motion-reduce:transition-none',
    variants: {
        size: {
            sm: 'size-2.5',
            md: 'size-3',
        },
        dotShape: {
            square: 'rounded-sm',
            circle: 'rounded-full',
        },
        highlighted: {
            true: 'scale-125',
            false: '',
        },
    },
    defaultVariants: {
        size: 'sm',
        dotShape: 'square',
        highlighted: false,
    },
})

const formatDisplayValue = (value: number | string): string => {
    if (props.formatValue) return props.formatValue(value)
    if (typeof value === 'number') return value.toLocaleString()
    return value
}
</script>

<template>
    <div :class="containerStyles({ layout, size })">
        <div
            v-for="(item, i) in items"
            :key="i"
            :class="itemStyles({
                size,
                itemWidth,
                highlighted: interactive && hoveredIndex === i,
                dimmed: interactive && hoveredIndex !== null && hoveredIndex !== i,
            })"
            @mouseenter="interactive && (hoveredIndex = i)"
            @mouseleave="interactive && (hoveredIndex = null)"
        >
            <span
                :class="dotStyles({ size, dotShape, highlighted: interactive && hoveredIndex === i })"
                :style="{ backgroundColor: item.color }"
            />
            <span class="text-muted-foreground" :class="{ 'flex-1 truncate': itemWidth === 'full' }">
                {{ item.label }}
            </span>
            <span v-if="showValue && item.value !== undefined" class="font-mono tabular-nums text-muted-foreground">
                {{ formatDisplayValue(item.value) }}
            </span>
            <template v-if="showPercentage && item.percentage !== undefined">
                <span v-if="size === 'sm'" class="font-medium tabular-nums">{{ item.percentage }}%</span>
                <Badge v-else variant="outline" size="sm" class="font-mono text-[0.625rem] tabular-nums">
                    {{ item.percentage }}%
                </Badge>
            </template>
        </div>
    </div>
</template>
