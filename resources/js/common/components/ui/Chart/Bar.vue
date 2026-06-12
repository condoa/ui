<script setup lang="ts">
import { computed, ref } from 'vue'
import ChartLegend, { type ChartLegendItem } from './Legend.vue'

export interface BarDataset {
    label: string
    data: number[]
    color?: string
}

const props = withDefaults(
    defineProps<{
        labels: string[]
        datasets: BarDataset[]
        colors?: string[]
        height?: number
        showLabels?: boolean
        showYAxis?: boolean
        showLegend?: boolean
        showTrend?: boolean
        yAxisSteps?: number
        formatValue?: (value: number) => string
    }>(),
    {
        height: 160,
        showLabels: true,
        showYAxis: false,
        showLegend: true,
        showTrend: true,
        yAxisSteps: 4,
    }
)

const palette = computed(() => props.colors ?? ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#f97316'])

const max = computed(() => {
    if (!props.datasets.length) return 1
    return Math.max(...props.datasets.flatMap((ds) => ds.data), 1)
})

// Y-axis ticks for grid lines
const yTicks = computed(() => {
    const steps = props.yAxisSteps
    const stepValue = max.value / steps
    return Array.from({ length: steps + 1 }, (_, i) => Math.round(stepValue * (steps - i)))
})

// Format large numbers compactly
const formatYValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
}

const hoveredIndex = ref<number | null>(null)

const getColor = (datasetIndex: number): string => {
    const ds = props.datasets[datasetIndex]
    return ds.color ?? palette.value[datasetIndex % palette.value.length]
}

const legendItems = computed<ChartLegendItem[]>(() =>
    props.datasets.map((ds, i) => ({
        label: ds.label,
        color: getColor(i),
    }))
)

const formatShortLabel = (label: string): string => {
    if (label.length <= 5) return label
    const parts = label.split('-')
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`
    return label.slice(-5)
}

const formatDisplayValue = (value: number): string => {
    if (props.formatValue) return props.formatValue(value)
    return value.toLocaleString()
}

// Calculate trend by comparing first half vs second half of data
const trend = computed(() => {
    if (!props.datasets.length || props.labels.length < 2) {
        return null
    }
    const mid = Math.floor(props.labels.length / 2)
    const firstHalf = props.datasets.reduce((sum, ds) => sum + ds.data.slice(0, mid).reduce((a, b) => a + b, 0), 0)
    const secondHalf = props.datasets.reduce((sum, ds) => sum + ds.data.slice(mid).reduce((a, b) => a + b, 0), 0)
    if (firstHalf === 0) return null
    const percent = Math.round(((secondHalf - firstHalf) / firstHalf) * 100)
    if (percent === 0) return null
    return {
        direction: percent > 0 ? 'up' : 'down',
        percent: Math.abs(percent),
        text: `${percent > 0 ? '+' : '-'}${Math.abs(percent)}%`,
    }
})

const total = computed(() => {
    if (!props.datasets.length) return 0
    return props.datasets.reduce((sum, ds) => sum + ds.data.reduce((a, b) => a + b, 0), 0)
})

// Tooltip follows the mouse pointer inside the chart area
const chartAreaRef = ref<HTMLDivElement | null>(null)
const mousePos = ref<{ x: number; y: number } | null>(null)

const handleMouseMove = (event: MouseEvent) => {
    if (!chartAreaRef.value) return
    const rect = chartAreaRef.value.getBoundingClientRect()
    mousePos.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }
}

const handleMouseLeave = () => {
    hoveredIndex.value = null
    mousePos.value = null
}

const tooltipPosition = computed(() => {
    if (hoveredIndex.value === null || !mousePos.value || !chartAreaRef.value) return null
    const rect = chartAreaRef.value.getBoundingClientRect()
    return {
        x: mousePos.value.x,
        y: mousePos.value.y,
        flipX: mousePos.value.x > rect.width * 0.7,
    }
})

defineExpose({ trend, total, legendItems })
</script>

<template>
    <div class="chart-bar-container">
        <!-- Header: Legend + Trend -->
        <div v-if="(showLegend && datasets.length > 1) || (showTrend && trend)" class="flex items-center justify-between gap-4 mb-3">
            <!-- Legend (only for multiple datasets) -->
            <ChartLegend
                v-if="showLegend && datasets.length > 1"
                :items="legendItems"
                :interactive="false"
                :show-percentage="false"
                dot-shape="circle"
                class="text-muted-foreground"
            />
            <div v-else />

            <!-- Trend badge -->
            <Badge v-if="showTrend && trend" :variant="trend.direction === 'up' ? 'success' : 'destructive'" size="sm" class="tabular-nums">
                <svg v-if="trend.direction === 'up'" class="-ml-0.5 mr-px size-3" viewBox="0 0 12 12" fill="none">
                    <path d="M6 3v6M6 3L3.5 5.5M6 3l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <svg v-else class="-ml-0.5 mr-px size-3" viewBox="0 0 12 12" fill="none">
                    <path d="M6 9V3M6 9L3.5 6.5M6 9l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ trend.text }}
            </Badge>
        </div>

        <!-- Chart area -->
        <div class="chart-bar-area" :class="{ 'has-y-axis': showYAxis }">
            <!-- Y-axis labels -->
            <div v-if="showYAxis" class="chart-bar-y-axis">
                <span
                    v-for="(tick, i) in yTicks"
                    :key="i"
                    class="chart-bar-y-label"
                    :style="{ top: `${(i / yAxisSteps) * 100}%` }"
                >
                    {{ formatYValue(tick) }}
                </span>
            </div>

            <!-- Chart -->
            <div ref="chartAreaRef" class="chart-bar-chart relative" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
                <!-- Grid lines -->
                <div v-if="showYAxis" class="chart-bar-grid">
                    <div
                        v-for="(_, i) in yTicks"
                        :key="i"
                        class="chart-bar-grid-line"
                        :style="{ top: `${(i / yAxisSteps) * 100}%` }"
                    />
                </div>

                <!-- Bars container -->
                <div class="flex gap-[2px] relative z-[1]" :style="{ height: `${height}px` }">
                    <div
                        v-for="(label, li) in labels"
                        :key="li"
                        class="chart-bar-column"
                        @mouseenter="hoveredIndex = li"
                    >
                        <div
                            v-for="(ds, di) in datasets"
                            :key="di"
                            class="chart-bar"
                            :class="{ 'is-hovered': hoveredIndex === li, 'is-dimmed': hoveredIndex !== null && hoveredIndex !== li }"
                            :style="{
                                height: `${Math.max((ds.data[li] / max) * 100, 1)}%`,
                                backgroundColor: getColor(di),
                            }"
                        />
                    </div>
                </div>

                <!-- Tooltip -->
                <Transition name="chart-tooltip">
                    <div
                        v-if="hoveredIndex !== null && tooltipPosition"
                        class="chart-bar-tooltip"
                        :class="{ 'flip-x': tooltipPosition.flipX }"
                        :style="{
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                        }"
                    >
                        <div class="chart-bar-tooltip-label">{{ labels[hoveredIndex] }}</div>
                        <div v-for="(ds, di) in datasets" :key="di" class="chart-bar-tooltip-row">
                            <span v-if="datasets.length > 1" class="chart-bar-tooltip-dot" :style="{ backgroundColor: getColor(di) }" />
                            <span v-if="datasets.length > 1" class="chart-bar-tooltip-series">{{ ds.label }}</span>
                            <span class="chart-bar-tooltip-value">{{ formatDisplayValue(ds.data[hoveredIndex]) }}</span>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- X-axis labels -->
        <div v-if="showLabels" class="chart-bar-x-axis" :class="{ 'has-y-axis': showYAxis }">
            <div
                v-for="(label, li) in labels"
                :key="li"
                class="chart-bar-label"
                :class="{ 'is-hovered': hoveredIndex === li }"
            >
                <template v-if="labels.length <= 12 || li % Math.ceil(labels.length / 12) === 0">
                    {{ formatShortLabel(label) }}
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Custom easing */
.chart-bar-container {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}

/* Chart area layout */
.chart-bar-area {
    display: flex;
    gap: 8px;
    overflow: visible;
}

/* Y-axis */
.chart-bar-y-axis {
    position: relative;
    min-width: 32px;
    text-align: right;
}

.chart-bar-y-label {
    position: absolute;
    right: 0;
    transform: translateY(-50%);
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-feature-settings: 'tnum';
    color: var(--color-muted-foreground);
    line-height: 1;
    white-space: nowrap;
}

/* Chart container */
.chart-bar-chart {
    flex: 1;
    position: relative;
    overflow: visible;
}

/* Grid lines */
.chart-bar-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.chart-bar-grid-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--color-border);
    opacity: 0.5;
}

/* X-axis with Y-axis offset */
.chart-bar-x-axis {
    display: flex;
    margin-top: 8px;
}

.chart-bar-x-axis.has-y-axis {
    margin-left: 40px;
}

/* Bar column (hit target) */
.chart-bar-column {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 1px;
    cursor: pointer;
}

/* Individual bar */
.chart-bar {
    flex: 1;
    border-radius: 3px 3px 0 0;
    opacity: 0.7;
    transform: translateY(0);
    transition:
        opacity 180ms var(--ease-out),
        transform 180ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
    .chart-bar.is-hovered {
        opacity: 1;
        transform: translateY(-2px);
    }

    .chart-bar.is-dimmed {
        opacity: 0.3;
    }
}

@media (hover: none) {
    .chart-bar.is-hovered {
        opacity: 1;
    }

    .chart-bar.is-dimmed {
        opacity: 0.35;
    }
}

/* Tooltip */
.chart-bar-tooltip {
    position: absolute;
    transform: translateX(12px) translateY(-50%);
    white-space: nowrap;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    background: var(--color-popover);
    padding: 8px 10px;
    font-size: 0.75rem;
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    z-index: 50;
    pointer-events: none;
    min-width: 80px;
}

.chart-bar-tooltip.flip-x {
    transform: translateX(-100%) translateX(-12px) translateY(-50%);
}

.chart-bar-tooltip-label {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-foreground);
}

.chart-bar-tooltip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
}

.chart-bar-tooltip-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    flex-shrink: 0;
}

.chart-bar-tooltip-series {
    color: var(--color-muted-foreground);
    flex: 1;
}

.chart-bar-tooltip-value {
    font-family: var(--font-mono);
    font-feature-settings: 'tnum';
    font-weight: 500;
}

.chart-tooltip-enter-active {
    transition: opacity 120ms var(--ease-out);
}

.chart-tooltip-leave-active {
    transition: opacity 60ms var(--ease-out);
}

.chart-tooltip-enter-from,
.chart-tooltip-leave-to {
    opacity: 0;
}

/* X-axis labels */
.chart-bar-label {
    flex: 1;
    text-align: center;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-feature-settings: 'tnum';
    color: var(--color-muted-foreground);
    transition: color 150ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
    .chart-bar-label.is-hovered {
        color: var(--color-foreground);
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .chart-bar,
    .chart-bar-legend-item,
    .chart-tooltip-enter-active,
    .chart-tooltip-leave-active {
        transition: none;
    }
}
</style>
