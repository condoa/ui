<script setup lang="ts">
import { computed, ref } from 'vue'
import { tv } from 'tailwind-variants'
import ChartLegend, { type ChartLegendItem } from './Legend.vue'

const props = withDefaults(
    defineProps<{
        labels: string[]
        data: number[]
        colors?: string[]
        donut?: boolean
        showTotal?: boolean
        formatValue?: (value: number) => string
    }>(),
    {
        donut: false,
        showTotal: false,
    }
)

const palette = computed(() => props.colors ?? ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#f97316'])

const total = computed(() => {
    if (!props.data.length) return 1
    return Math.max(props.data.reduce((a, b) => a + b, 0), 1)
})

const hoveredIndex = ref<number | null>(null)

const slices = computed(() => {
    if (!props.data.length) return []
    let cumulative = 0
    return props.data.map((v, i) => {
        const start = cumulative
        cumulative += v / total.value
        const midAngle = ((start + cumulative) / 2) * 360 - 90
        const midRad = (midAngle * Math.PI) / 180
        return {
            label: props.labels[i],
            value: v,
            percentage: Math.round((v / total.value) * 100),
            color: palette.value[i % palette.value.length],
            startAngle: start * 360,
            endAngle: cumulative * 360,
            // Offset direction for hover lift effect
            offsetX: Math.cos(midRad) * 3,
            offsetY: Math.sin(midRad) * 3,
        }
    })
})

const legendItems = computed<ChartLegendItem[]>(() =>
    slices.value.map((slice) => ({
        label: slice.label,
        color: slice.color,
        value: slice.value,
        percentage: slice.percentage,
    }))
)

const outerRadius = 45
const innerRadius = computed(() => (props.donut ? 28 : 0))

const arc = (startAngle: number, endAngle: number, outer: number, inner: number): string => {
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1Outer = 50 + outer * Math.cos(startRad)
    const y1Outer = 50 + outer * Math.sin(startRad)
    const x2Outer = 50 + outer * Math.cos(endRad)
    const y2Outer = 50 + outer * Math.sin(endRad)

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    if (inner === 0) {
        return `M 50 50 L ${x1Outer} ${y1Outer} A ${outer} ${outer} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} Z`
    }

    const x1Inner = 50 + inner * Math.cos(startRad)
    const y1Inner = 50 + inner * Math.sin(startRad)
    const x2Inner = 50 + inner * Math.cos(endRad)
    const y2Inner = 50 + inner * Math.sin(endRad)

    return `M ${x1Outer} ${y1Outer} A ${outer} ${outer} 0 ${largeArc} 1 ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} A ${inner} ${inner} 0 ${largeArc} 0 ${x1Inner} ${y1Inner} Z`
}

const formatDisplayValue = (value: number): string => {
    if (props.formatValue) return props.formatValue(value)
    return value.toLocaleString()
}

const legendFormatValue = (value: number | string): string =>
    formatDisplayValue(typeof value === 'number' ? value : Number(value))

const sliceStyles = tv({
    base: 'pointer-events-none origin-[50px_50px] transition-[transform,opacity] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none motion-reduce:!transform-none',
    variants: {
        hovered: {
            true: '',
            false: '',
        },
        dimmed: {
            true: 'opacity-40',
            false: '',
        },
    },
    defaultVariants: {
        hovered: false,
        dimmed: false,
    },
})
</script>

<template>
    <div class="flex items-center gap-8">
        <!-- Chart -->
        <div class="relative shrink-0">
            <svg viewBox="-6 -6 112 112" class="size-48">
                <!-- Subtle shadow layer for depth -->
                <defs>
                    <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-opacity="0.15" />
                    </filter>
                </defs>

                <!-- Slices with group hover pattern to prevent flicker -->
                <g filter="url(#pie-shadow)">
                    <g
                        v-for="(slice, i) in slices"
                        :key="i"
                        class="slice-group"
                        @mouseenter="hoveredIndex = i"
                        @mouseleave="hoveredIndex = null"
                    >
                        <!-- Invisible hit area - stays in place -->
                        <path
                            :d="arc(slice.startAngle, slice.endAngle, outerRadius, innerRadius)"
                            fill="transparent"
                            class="cursor-pointer"
                        />
                        <!-- Visible slice - transforms on hover -->
                        <path
                            :class="sliceStyles({ hovered: hoveredIndex === i, dimmed: hoveredIndex !== null && hoveredIndex !== i })"
                            :d="arc(slice.startAngle, slice.endAngle, outerRadius, innerRadius)"
                            :fill="slice.color"
                            :style="{
                                transform: hoveredIndex === i ? `translate(${slice.offsetX}px, ${slice.offsetY}px) scale(1.02)` : undefined,
                            }"
                            stroke="var(--color-card)"
                            stroke-width="0.5"
                        />
                    </g>
                </g>

                <!-- Donut center background -->
                <circle v-if="donut" cx="50" cy="50" :r="innerRadius - 0.5" fill="var(--color-card)" />
            </svg>

            <!-- Center total for donut -->
            <div
                v-if="donut && showTotal"
                class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
                <span class="text-lg font-semibold tabular-nums leading-tight">{{ formatDisplayValue(total) }}</span>
                <span class="text-[0.65rem] text-muted-foreground">Total</span>
            </div>
        </div>

        <!-- Legend -->
        <ChartLegend
            v-model:hovered-index="hoveredIndex"
            :items="legendItems"
            :format-value="legendFormatValue"
            layout="vertical"
            item-width="full"
            size="md"
            show-value
            show-percentage
            class="flex-1 min-w-0"
        />
    </div>
</template>
