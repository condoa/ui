<script setup lang="ts">
import { computed, ref } from 'vue'

interface FunnelResult {
    step: number
    label: string
    channel: string
    event: string
    count: number
    percentage: number
    overall_percentage: number
}

type FunnelVariant = 'smooth' | 'sharp' | 'stepped' | 'organic'
type LabelVariant = 'minimal' | 'cards' | 'inline' | 'stacked'

const props = withDefaults(
    defineProps<{
        steps: Array<Pick<FunnelResult, 'label' | 'count' | 'percentage'> & Partial<FunnelResult>>
        colors?: string[]
        formatValue?: (value: number) => string
        variant?: FunnelVariant
        labelVariant?: LabelVariant
    }>(),
    {
        variant: 'smooth',
        labelVariant: 'minimal',
    }
)

const palette = computed(() => props.colors ?? ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'])

const svgWidth = 900
const svgHeight = 160
const SAMPLES = 200

const hoveredIndex = ref<number | null>(null)

// Interpolation functions for different variants
const cosInterp = (a: number, b: number, t: number): number => a + ((b - a) * (1 - Math.cos(t * Math.PI))) / 2

const linearInterp = (a: number, b: number, t: number): number => a + (b - a) * t

// Stronger ease-in-out for organic feel
const organicInterp = (a: number, b: number, t: number): number => {
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    return a + (b - a) * ease
}

const layers = computed(() => {
    const n = props.steps.length
    if (n === 0) return []

    const maxCount = Math.max(...props.steps.map((s) => s.count), 1)
    const heights = props.steps.map((r) => {
        const pct = r.count > 0 ? (r.count / maxCount) * 100 : 0
        return (Math.max(pct, 8) / 100) * svgHeight * 0.9
    })

    const cy = svgHeight / 2
    const cw = svgWidth / n

    // Variant: stepped - no curves, just rectangles
    if (props.variant === 'stepped') {
        return props.steps.map((_, s) => {
            const xStart = s * cw
            const xEnd = svgWidth
            const h = heights[s]
            const top = cy - h / 2
            const bottom = cy + h / 2
            return {
                d: `M ${xStart} ${top} L ${xEnd} ${top} L ${xEnd} ${bottom} L ${xStart} ${bottom} Z`,
                color: palette.value[s % palette.value.length],
                xStart,
                xEnd,
            }
        })
    }

    // Variant: sharp - linear transitions at segment boundaries
    if (props.variant === 'sharp') {
        return props.steps.map((_, s) => {
            const xStart = s * cw
            const parts: string[] = []

            // Top edge
            for (let i = s; i < n; i++) {
                const x1 = i * cw
                const x2 = (i + 1) * cw
                const h = heights[i] / 2
                if (i === s) {
                    parts.push(`M ${x1} ${cy - h}`)
                }
                parts.push(`L ${x2} ${cy - h}`)
                if (i < n - 1) {
                    const nextH = heights[i + 1] / 2
                    parts.push(`L ${x2} ${cy - nextH}`)
                }
            }

            // Right edge
            parts.push(`L ${svgWidth} ${cy + heights[n - 1] / 2}`)

            // Bottom edge (reverse)
            for (let i = n - 1; i >= s; i--) {
                const x1 = i * cw
                const h = heights[i] / 2
                if (i < n - 1) {
                    parts.push(`L ${(i + 1) * cw} ${cy + h}`)
                }
                parts.push(`L ${x1} ${cy + h}`)
            }

            parts.push('Z')
            return {
                d: parts.join(' '),
                color: palette.value[s % palette.value.length],
                xStart,
                xEnd: svgWidth,
            }
        })
    }

    // Smooth and Organic variants use sampling
    const firstCenter = 0.5 * cw
    const lastCenter = (n - 0.5) * cw
    const curveWidth = props.variant === 'organic' ? 0.6 : 0.45
    const interpFn = props.variant === 'organic' ? organicInterp : cosInterp

    const halfHeightAt = (x: number): number => {
        if (x <= firstCenter) return heights[0] / 2
        if (x >= lastCenter) return heights[n - 1] / 2
        const seg = (x - firstCenter) / cw
        const a = Math.floor(seg)
        const local = seg - a
        const tStart = 0.5 - curveWidth / 2
        const tEnd = 0.5 + curveWidth / 2
        if (local <= tStart) return heights[a] / 2
        if (local >= tEnd) return heights[Math.min(a + 1, n - 1)] / 2
        const t = (local - tStart) / curveWidth
        return interpFn(heights[a], heights[Math.min(a + 1, n - 1)], t) / 2
    }

    const result: { d: string; color: string; xStart: number; xEnd: number }[] = []

    for (let s = 0; s < n; s++) {
        const xStart = s * cw
        const xEnd = (s + 1) * cw
        const range = svgWidth - xStart
        const count = Math.max(Math.round((range / svgWidth) * SAMPLES), 2)

        const parts: string[] = []

        for (let j = 0; j <= count; j++) {
            const x = xStart + (range * j) / count
            const hh = halfHeightAt(x)
            parts.push(`${j === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${(cy - hh).toFixed(1)}`)
        }

        for (let j = count; j >= 0; j--) {
            const x = xStart + (range * j) / count
            const hh = halfHeightAt(x)
            parts.push(`L ${x.toFixed(1)} ${(cy + hh).toFixed(1)}`)
        }

        parts.push('Z')
        result.push({
            d: parts.join(' '),
            color: palette.value[s % palette.value.length],
            xStart,
            xEnd,
        })
    }

    return result
})

const dividers = computed(() => {
    const n = props.steps.length
    if (n <= 1) return []
    const cw = svgWidth / n
    return Array.from({ length: n - 1 }, (_, i) => (i + 1) * cw)
})

const formatDisplayValue = (value: number): string => {
    if (props.formatValue) return props.formatValue(value)
    return value.toLocaleString()
}

// Handle hover on SVG by calculating which segment was hit
const handleSvgHover = (event: MouseEvent) => {
    const svg = event.currentTarget as SVGElement
    const rect = svg.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * svgWidth
    const cw = svgWidth / props.steps.length
    hoveredIndex.value = Math.min(Math.floor(x / cw), props.steps.length - 1)
}
</script>

<template>
    <div class="chart-funnel">
        <!-- SVG Funnel -->
        <svg
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            class="w-full h-40"
            preserveAspectRatio="none"
            @mousemove="handleSvgHover"
            @mouseleave="hoveredIndex = null"
        >
            <defs>
                <filter id="funnel-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
                </filter>
            </defs>

            <g filter="url(#funnel-shadow)">
                <path
                    v-for="(layer, i) in layers"
                    :key="i"
                    class="funnel-layer"
                    :class="{
                        'is-hovered': hoveredIndex === i,
                        'is-dimmed': hoveredIndex !== null && hoveredIndex !== i,
                    }"
                    :d="layer.d"
                    :fill="layer.color"
                />
            </g>

            <line
                v-for="(x, i) in dividers"
                :key="'d' + i"
                :x1="x"
                y1="0"
                :x2="x"
                :y2="svgHeight"
                stroke="var(--color-background)"
                stroke-width="2"
            />
        </svg>

        <!-- Labels: Variant 1 - Minimal -->
        <div v-if="labelVariant === 'minimal'" class="flex mt-3">
            <button
                v-for="(step, i) in steps"
                :key="i"
                type="button"
                class="funnel-label flex-1 text-center py-2 rounded-md"
                :class="{ 'is-dimmed': hoveredIndex !== null && hoveredIndex !== i }"
                @mouseenter="hoveredIndex = i"
                @mouseleave="hoveredIndex = null"
            >
                <div class="text-lg font-semibold tabular-nums">{{ formatDisplayValue(step.count) }}</div>
                <div class="text-[0.65rem] text-muted-foreground truncate">{{ step.label }}</div>
                <div v-if="i > 0" class="text-[0.6rem] tabular-nums mt-0.5" :class="step.percentage >= 50 ? 'text-emerald-500' : step.percentage >= 25 ? 'text-amber-500' : 'text-red-500'">
                    {{ step.percentage }}%
                </div>
            </button>
        </div>

        <!-- Labels: Variant 2 - Cards -->
        <div v-else-if="labelVariant === 'cards'" class="flex gap-2 mt-4">
            <button
                v-for="(step, i) in steps"
                :key="i"
                type="button"
                class="funnel-label flex-1 bg-muted/50 rounded-lg p-3 text-center border border-transparent hover:border-border"
                :class="{ 'is-dimmed': hoveredIndex !== null && hoveredIndex !== i, '!border-border bg-muted': hoveredIndex === i }"
                @mouseenter="hoveredIndex = i"
                @mouseleave="hoveredIndex = null"
            >
                <div class="flex items-center justify-center gap-1.5 mb-1">
                    <span class="size-2 rounded-full" :style="{ backgroundColor: palette[i % palette.length] }" />
                    <span class="text-xs font-medium text-muted-foreground">{{ step.label }}</span>
                </div>
                <div class="text-xl font-bold tabular-nums">{{ formatDisplayValue(step.count) }}</div>
                <div v-if="i > 0" class="mt-1">
                    <Badge :variant="step.percentage >= 50 ? 'success' : step.percentage >= 25 ? 'warning' : 'destructive'" size="sm" class="tabular-nums">
                        {{ step.percentage }}%
                    </Badge>
                </div>
            </button>
        </div>

        <!-- Labels: Variant 3 - Inline -->
        <div v-else-if="labelVariant === 'inline'" class="flex mt-4">
            <div v-for="(step, i) in steps" :key="i" class="relative flex-1 flex justify-center">
                <svg v-if="i > 0" class="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 size-4 text-muted-foreground/30" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <button
                    type="button"
                    class="funnel-label flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-muted"
                    :class="{ 'is-dimmed': hoveredIndex !== null && hoveredIndex !== i, 'bg-muted': hoveredIndex === i }"
                    @mouseenter="hoveredIndex = i"
                    @mouseleave="hoveredIndex = null"
                >
                    <span class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: palette[i % palette.length] }" />
                    <span class="text-sm font-medium truncate">{{ step.label }}</span>
                    <span class="text-sm font-bold tabular-nums">{{ formatDisplayValue(step.count) }}</span>
                    <span v-if="i > 0" class="text-xs tabular-nums" :class="step.percentage >= 50 ? 'text-emerald-500' : step.percentage >= 25 ? 'text-amber-500' : 'text-red-500'">
                        {{ step.percentage }}%
                    </span>
                </button>
            </div>
        </div>

        <!-- Labels: Variant 4 - Stacked -->
        <div v-else-if="labelVariant === 'stacked'" class="mt-4 space-y-1">
            <button
                v-for="(step, i) in steps"
                :key="i"
                type="button"
                class="funnel-label w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-left"
                :class="{ 'is-dimmed': hoveredIndex !== null && hoveredIndex !== i, 'bg-muted': hoveredIndex === i }"
                @mouseenter="hoveredIndex = i"
                @mouseleave="hoveredIndex = null"
            >
                <span class="size-3 rounded-sm shrink-0" :style="{ backgroundColor: palette[i % palette.length] }" />
                <span class="text-sm flex-1 truncate">{{ step.label }}</span>
                <span class="text-sm font-semibold tabular-nums">{{ formatDisplayValue(step.count) }}</span>
                <span v-if="i > 0" class="text-xs tabular-nums w-10 text-right" :class="step.percentage >= 50 ? 'text-emerald-500' : step.percentage >= 25 ? 'text-amber-500' : 'text-red-500'">
                    {{ step.percentage }}%
                </span>
                <span v-else class="w-10" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.chart-funnel {
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}

.funnel-layer {
    opacity: 0.75;
    transition: opacity 180ms var(--ease-out);
    cursor: pointer;
}

@media (hover: hover) and (pointer: fine) {
    .funnel-layer.is-hovered {
        opacity: 1;
    }

    .funnel-layer.is-dimmed {
        opacity: 0.35;
    }
}

@media (hover: none) {
    .funnel-layer.is-hovered {
        opacity: 1;
    }

    .funnel-layer.is-dimmed {
        opacity: 0.4;
    }
}

.funnel-label {
    transition:
        opacity 150ms var(--ease-out),
        background-color 150ms var(--ease-out),
        transform 100ms var(--ease-out);
}

.funnel-label:active {
    transform: scale(0.97);
}

@media (hover: hover) and (pointer: fine) {
    .funnel-label:hover {
        background-color: var(--color-muted);
    }

    .funnel-label.is-dimmed {
        opacity: 0.4;
    }
}

@media (prefers-reduced-motion: reduce) {
    .funnel-layer,
    .funnel-label {
        transition: none;
    }
}
</style>
