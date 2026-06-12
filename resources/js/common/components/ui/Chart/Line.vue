<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ChartLegendItem } from './Legend.vue'

export interface Dataset {
    label: string
    data: number[]
}

const props = withDefaults(
    defineProps<{
        labels: string[]
        datasets: Dataset[]
        colors?: string[]
        hideLegend?: boolean
        hideXAxis?: boolean
        hideYAxis?: boolean
        yAxisSteps?: number
        formatValue?: (value: number) => string
        formatTooltip?: (value: number) => string
    }>(),
    {
        yAxisSteps: 4,
    },
)

const palette = computed(() => props.colors ?? ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'])

const max = computed(() => {
    if (!props.datasets.length) return 1
    return Math.max(...props.datasets.flatMap((ds) => ds.data), 1)
})

// Y-axis tick values
const yTicks = computed(() => {
    const steps = props.yAxisSteps
    const stepValue = max.value / steps
    return Array.from({ length: steps + 1 }, (_, i) => Math.round(stepValue * (steps - i)))
})

// Format large numbers compactly for Y-axis ticks
const defaultCompact = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
}

const formatTickValue = (value: number): string =>
    props.formatValue ? props.formatValue(value) : defaultCompact(value)

const formatTooltipValue = (value: number): string =>
    props.formatTooltip ? props.formatTooltip(value) : (props.formatValue ? props.formatValue(value) : value.toString())

// Chart dimensions (viewBox units)
const chartPadding = { top: 8, right: 8, bottom: 4, left: 0 }
const svgW = 100
const svgH = 48
const chartW = svgW - chartPadding.left - chartPadding.right
const chartH = svgH - chartPadding.top - chartPadding.bottom

const paths = computed(() => {
    if (!props.datasets.length) return []
    const step = chartW / Math.max(props.labels.length - 1, 1)
    return props.datasets.map((ds, di) => ({
        label: ds.label,
        color: palette.value[di % palette.value.length],
        path: ds.data
            .map((v, i) => {
                const x = chartPadding.left + i * step
                const y = chartPadding.top + chartH - (v / max.value) * chartH
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
            })
            .join(' '),
        points: ds.data.map((v, i) => ({
            x: chartPadding.left + i * step,
            y: chartPadding.top + chartH - (v / max.value) * chartH,
            value: v,
            label: props.labels[i],
        })),
    }))
})

// Grid lines (horizontal)
const gridLines = computed(() => {
    return yTicks.value.map((_, i) => {
        const y = chartPadding.top + (i / props.yAxisSteps) * chartH
        return { y, x1: chartPadding.left, x2: svgW - chartPadding.right }
    })
})

const hoveredIndex = ref<number | null>(null)
const focusedSeriesIndex = ref<number | null>(null)

// Focused series from legend hover (v-model for external sync)
const legendHoveredIndex = defineModel<number | null>('legendHoveredIndex', { default: null })

// Legend items for external ChartLegend component
const legendItems = computed<ChartLegendItem[]>(() =>
    paths.value.map((p) => ({
        label: p.label,
        color: p.color,
    }))
)

// Active series is either legend-hovered or chart-hovered
const activeSeriesIndex = computed(() => {
    if (legendHoveredIndex.value !== null) return legendHoveredIndex.value
    return focusedSeriesIndex.value
})

const hoveredPoints = computed(() => {
    if (hoveredIndex.value === null) return []
    return paths.value.map((p, si) => ({
        ...p.points[hoveredIndex.value!],
        color: p.color,
        series: p.label,
        seriesIndex: si,
        isActive: activeSeriesIndex.value === null || activeSeriesIndex.value === si,
    }))
})

const crosshairX = computed(() => {
    if (hoveredIndex.value === null || !paths.value.length) return null
    return paths.value[0].points[hoveredIndex.value].x
})

// Tooltip follows the mouse pointer inside the chart area
const mousePos = ref<{ x: number; y: number } | null>(null)

const tooltipPosition = computed(() => {
    if (hoveredIndex.value === null || !mousePos.value || !chartRef.value) return null
    const rect = chartRef.value.getBoundingClientRect()
    return {
        x: mousePos.value.x,
        y: mousePos.value.y,
        flipX: mousePos.value.x > rect.width * 0.7,
        flipY: mousePos.value.y > rect.height * 0.6,
    }
})

// Tooltip shows only focused series when one is active, otherwise all
const tooltipPoints = computed(() => {
    if (activeSeriesIndex.value !== null) {
        return hoveredPoints.value.filter((p) => p.seriesIndex === activeSeriesIndex.value)
    }
    return hoveredPoints.value
})

const chartRef = ref<HTMLDivElement | null>(null)

const handleMouseMove = (event: MouseEvent) => {
    if (!chartRef.value || !paths.value.length) return

    const rect = chartRef.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const chartWidth = rect.width
    mousePos.value = { x: mouseX, y: event.clientY - rect.top }

    // Data points only span chartW of the viewBox (svgW minus padding).
    // Map cursor position to that usable range, not the full container.
    const usableWidthPx = chartWidth * (chartW / svgW)
    const offsetPx = chartWidth * (chartPadding.left / svgW)
    const xRel = Math.max(0, Math.min(usableWidthPx, mouseX - offsetPx))
    const xPercent = usableWidthPx > 0 ? xRel / usableWidthPx : 0
    const pointCount = props.labels.length
    const index = Math.round(xPercent * (pointCount - 1))
    hoveredIndex.value = Math.max(0, Math.min(pointCount - 1, index))

    // Find closest series by Y position
    const mouseY = event.clientY - rect.top
    const chartHeight = rect.height

    let closestSeriesIdx = 0
    let closestDistance = Infinity

    paths.value.forEach((path, si) => {
        const point = path.points[hoveredIndex.value!]
        if (!point) return
        const pointYPercent = point.y / svgH
        const pointYPx = pointYPercent * chartHeight
        const distance = Math.abs(mouseY - pointYPx)
        if (distance < closestDistance) {
            closestDistance = distance
            closestSeriesIdx = si
        }
    })

    // Only focus series if cursor is close enough (within 30px)
    if (closestDistance < 30) {
        focusedSeriesIndex.value = closestSeriesIdx
    } else {
        focusedSeriesIndex.value = null
    }
}

const handleMouseLeave = () => {
    hoveredIndex.value = null
    focusedSeriesIndex.value = null
    mousePos.value = null
}

const handleLegendEnter = (index: number) => {
    legendHoveredIndex.value = index
}

const handleLegendLeave = () => {
    legendHoveredIndex.value = null
}

// X-axis label positions (as percentages, matching data point X positions exactly)
const xLabelPositions = computed(() => {
    const count = props.labels.length
    if (count === 0) return []
    if (count === 1) return [{ label: props.labels[0], left: 0, visible: true, isHovered: hoveredIndex.value === 0 }]

    const step = Math.ceil(count / 7)
    return props.labels.map((label, i) => {
        // Data points go from chartPadding.left to (svgW - chartPadding.right)
        // So x = chartPadding.left + i * (chartW / (count - 1))
        // As percentage: x / svgW * 100
        const x = chartPadding.left + (i / (count - 1)) * chartW
        return {
            label,
            left: (x / svgW) * 100,
            visible: count <= 7 || i % step === 0 || i === count - 1,
            isHovered: hoveredIndex.value === i,
        }
    })
})

// Y-axis label positions (as percentages, matching grid line Y positions exactly)
const yLabelPositions = computed(() => {
    return yTicks.value.map((tick, i) => {
        // Grid lines go from chartPadding.top to (svgH - chartPadding.bottom)
        // y = chartPadding.top + (i / yAxisSteps) * chartH
        // As percentage: y / svgH * 100
        const y = chartPadding.top + (i / props.yAxisSteps) * chartH
        return {
            value: formatTickValue(tick),
            top: (y / svgH) * 100,
        }
    })
})

defineExpose({ legendItems })
</script>

<template>
    <div class="chart-line">
        <!-- Legend -->
        <div v-if="!hideLegend && paths.length > 0" class="chart-line-legend">
            <button
                v-for="(lp, i) in paths"
                :key="i"
                type="button"
                class="chart-line-legend-item"
                :class="{
                    'is-active': activeSeriesIndex === i,
                    'is-dimmed': activeSeriesIndex !== null && activeSeriesIndex !== i,
                }"
                @mouseenter="handleLegendEnter(i)"
                @mouseleave="handleLegendLeave"
            >
                <span class="chart-line-legend-dot" :style="{ backgroundColor: lp.color }" />
                {{ lp.label }}
            </button>
        </div>

        <div class="chart-line-container">
            <!-- Y-axis labels (absolutely positioned to match grid lines) -->
            <div v-if="!hideYAxis" class="chart-line-y-axis">
                <span
                    v-for="(pos, i) in yLabelPositions"
                    :key="i"
                    class="chart-line-y-label"
                    :style="{ top: `${pos.top}%` }"
                >
                    {{ pos.value }}
                </span>
            </div>

            <!-- Chart area -->
            <div ref="chartRef" class="chart-line-chart" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
                <svg :viewBox="`0 0 ${svgW} ${svgH}`" preserveAspectRatio="none" class="chart-line-svg">
                    <!-- Grid lines -->
                    <line
                        v-for="(line, i) in gridLines"
                        :key="'grid-' + i"
                        :x1="line.x1"
                        :y1="line.y"
                        :x2="line.x2"
                        :y2="line.y"
                        class="chart-line-grid"
                    />

                    <!-- Crosshair (vertical line on hover) -->
                    <line
                        v-if="crosshairX !== null"
                        :x1="crosshairX"
                        :y1="chartPadding.top"
                        :x2="crosshairX"
                        :y2="svgH - chartPadding.bottom"
                        class="chart-line-crosshair"
                    />

                    <!-- Data lines -->
                    <path
                        v-for="(lp, i) in paths"
                        :key="i"
                        :d="lp.path"
                        fill="none"
                        :stroke="lp.color"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        vector-effect="non-scaling-stroke"
                        class="chart-line-path"
                        :class="{
                            'is-active': activeSeriesIndex === i,
                            'is-dimmed': activeSeriesIndex !== null && activeSeriesIndex !== i,
                        }"
                    />

                </svg>

                <!-- Hover dots (HTML so they stay circular regardless of SVG aspect) -->
                <template v-if="hoveredIndex !== null">
                    <span
                        v-for="(hp, i) in hoveredPoints"
                        :key="'dot-' + i"
                        class="chart-line-dot"
                        :class="{ 'is-dimmed': !hp.isActive }"
                        :style="{
                            left: `${(hp.x / svgW) * 100}%`,
                            top: `${(hp.y / svgH) * 100}%`,
                            backgroundColor: hp.color,
                        }"
                    />
                </template>

                <!-- Tooltip -->
                <Transition name="chart-tooltip">
                    <div
                        v-if="hoveredIndex !== null && tooltipPoints.length > 0 && tooltipPosition"
                        class="chart-line-tooltip"
                        :class="{
                            'flip-x': tooltipPosition.flipX,
                            'flip-y': tooltipPosition.flipY,
                        }"
                        :style="{
                            left: `${tooltipPosition.x}px`,
                            top: `${tooltipPosition.y}px`,
                        }"
                    >
                        <div class="chart-line-tooltip-label">{{ tooltipPoints[0].label }}</div>
                        <div v-for="(hp, i) in tooltipPoints" :key="i" class="chart-line-tooltip-row">
                            <span class="chart-line-tooltip-dot" :style="{ backgroundColor: hp.color }" />
                            <span class="chart-line-tooltip-series">{{ hp.series }}</span>
                            <span class="chart-line-tooltip-value">{{ formatTooltipValue(hp.value) }}</span>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- X-axis labels (absolutely positioned to match data points) -->
        <div v-if="!hideXAxis" class="chart-line-x-axis" :class="{ 'has-y-axis': !hideYAxis }">
            <span
                v-for="(pos, i) in xLabelPositions"
                :key="i"
                class="chart-line-x-label"
                :class="{ 'is-visible': pos.visible, 'is-hovered': pos.isHovered }"
                :style="{ left: `${pos.left}%` }"
            >
                {{ pos.label }}
            </span>
        </div>
    </div>
</template>

<style scoped>
/* Custom easing */
.chart-line {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    overflow: visible;
}

/* Legend */
.chart-line-legend {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    font-size: 0.75rem;
    color: var(--color-muted-foreground);
}

.chart-line-legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    margin: -4px -8px;
    border-radius: 6px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition:
        opacity 180ms var(--ease-out),
        background-color 180ms var(--ease-out);
}

.chart-line-legend-item:hover {
    background-color: var(--color-muted);
}

.chart-line-legend-item.is-dimmed {
    opacity: 0.4;
}

.chart-line-legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    transition: transform 180ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
    .chart-line-legend-item.is-active .chart-line-legend-dot {
        transform: scale(1.25);
    }
}

/* Container layout */
.chart-line-container {
    display: flex;
    flex: 1 1 0;
    gap: 8px;
    min-height: 0;
    overflow: visible;
}

/* Y-axis */
.chart-line-y-axis {
    position: relative;
    min-width: 32px;
    text-align: right;
}

.chart-line-y-label {
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

/* Chart area */
.chart-line-chart {
    flex: 1;
    position: relative;
    min-height: 0;
    overflow: visible;
}

.chart-line-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    cursor: crosshair;
}

/* Grid lines */
.chart-line-grid {
    stroke: var(--color-border);
    stroke-width: 1;
    stroke-dasharray: 2 2;
    vector-effect: non-scaling-stroke;
    opacity: 0.5;
}

/* Crosshair */
.chart-line-crosshair {
    stroke: var(--color-border);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    opacity: 0.8;
}

/* Data paths */
.chart-line-path {
    transition:
        opacity 180ms var(--ease-out),
        stroke-width 180ms var(--ease-out);
}

.chart-line-path.is-active {
    stroke-width: 3;
}

.chart-line-path.is-dimmed {
    opacity: 0.2;
}

/* Hover dots */
.chart-line-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    border: 2px solid var(--color-background);
    transform: translate(-50%, -50%);
    pointer-events: none;
    transition: opacity 150ms var(--ease-out);
}

.chart-line-dot.is-dimmed {
    opacity: 0.3;
}

/* Tooltip */
.chart-line-tooltip {
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
    min-width: 100px;
}

/* Flip tooltip when near edges */
.chart-line-tooltip.flip-x {
    transform: translateX(-100%) translateX(-12px) translateY(-50%);
}

.chart-line-tooltip.flip-y {
    transform: translateX(12px) translateY(-100%) translateY(-8px);
}

.chart-line-tooltip.flip-x.flip-y {
    transform: translateX(-100%) translateX(-12px) translateY(-100%) translateY(-8px);
}

.chart-line-tooltip-label {
    font-weight: 500;
    margin-bottom: 4px;
    color: var(--color-foreground);
}

.chart-line-tooltip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
}

.chart-line-tooltip-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    flex-shrink: 0;
}

.chart-line-tooltip-series {
    color: var(--color-muted-foreground);
    flex: 1;
}

.chart-line-tooltip-value {
    font-family: var(--font-mono);
    font-feature-settings: 'tnum';
    font-weight: 500;
}

/* Tooltip animation - opacity only to avoid transform conflicts */
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

/* X-axis */
.chart-line-x-axis {
    position: relative;
    height: 16px;
    margin-top: 6px;
}

.chart-line-x-axis.has-y-axis {
    margin-left: 40px;
}

.chart-line-x-label {
    position: absolute;
    transform: translateX(-50%);
    font-size: 0.625rem;
    font-family: var(--font-mono);
    font-feature-settings: 'tnum';
    color: var(--color-muted-foreground);
    text-align: center;
    white-space: nowrap;
    opacity: 0;
    transition:
        opacity 180ms var(--ease-out),
        color 180ms var(--ease-out),
        font-weight 180ms var(--ease-out);
}

.chart-line-x-label.is-visible {
    opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
    .chart-line-x-label.is-hovered {
        color: var(--color-foreground);
        font-weight: 500;
        opacity: 1;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .chart-line-path,
    .chart-line-dot,
    .chart-line-legend-item,
    .chart-line-legend-dot,
    .chart-line-x-label,
    .chart-tooltip-enter-active,
    .chart-tooltip-leave-active {
        transition-duration: 0ms;
    }
}
</style>
