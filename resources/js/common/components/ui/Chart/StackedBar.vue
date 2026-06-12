<script setup lang="ts">
import { computed } from 'vue'
import { tv } from 'tailwind-variants'
import ChartLegend, { type ChartLegendItem } from './Legend.vue'

interface StackedBarSegment {
    label: string
    value: number
    color?: string
}

const props = withDefaults(
    defineProps<{
        segments: StackedBarSegment[]
        showLegend?: boolean
        showValues?: boolean
        height?: 'sm' | 'md' | 'lg'
    }>(),
    {
        showLegend: true,
        showValues: true,
        height: 'md',
    }
)

const defaultColors = [
    '#3b82f6', // blue-500
    '#10b981', // emerald-500
    '#f59e0b', // amber-500
    '#8b5cf6', // violet-500
    '#f43f5e', // rose-500
    '#06b6d4', // cyan-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
]

const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))

const segmentsWithMeta = computed(() =>
    props.segments.map((segment, i) => ({
        ...segment,
        color: segment.color ?? defaultColors[i % defaultColors.length],
        percentage: total.value > 0 ? (segment.value / total.value) * 100 : 0,
    }))
)

const legendItems = computed<ChartLegendItem[]>(() =>
    segmentsWithMeta.value.map((segment) => ({
        label: segment.label,
        color: segment.color,
        percentage: Math.round(segment.percentage),
    }))
)

const hoveredIndex = defineModel<number | null>('hoveredIndex', { default: null })

defineExpose({ legendItems })

const barStyles = tv({
    base: 'relative rounded-full bg-muted overflow-hidden',
    variants: {
        height: {
            sm: 'h-2',
            md: 'h-4',
            lg: 'h-6',
        },
    },
    defaultVariants: {
        height: 'md',
    },
})

const segmentStyles = tv({
    base: 'absolute inset-y-0 transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
    variants: {
        dimmed: {
            true: 'opacity-40',
            false: '',
        },
    },
    defaultVariants: {
        dimmed: false,
    },
})
</script>

<template>
    <div>
        <!-- Stacked Bar -->
        <div :class="barStyles({ height })">
            <div
                v-for="(segment, i) in segmentsWithMeta"
                :key="i"
                :class="segmentStyles({ dimmed: hoveredIndex !== null && hoveredIndex !== i })"
                :style="{
                    left: `${segmentsWithMeta.slice(0, i).reduce((sum, s) => sum + s.percentage, 0)}%`,
                    width: `${segment.percentage}%`,
                    backgroundColor: segment.color,
                }"
                @mouseenter="hoveredIndex = i"
                @mouseleave="hoveredIndex = null"
            />
        </div>

        <!-- Legend -->
        <ChartLegend
            v-if="showLegend"
            v-model:hovered-index="hoveredIndex"
            :items="legendItems"
            :show-percentage="showValues"
            class="mt-3"
        />
    </div>
</template>
