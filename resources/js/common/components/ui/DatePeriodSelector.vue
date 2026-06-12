<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import Icon from '@/common/components/Icon.vue'

interface Period {
    from: string // YYYY-MM-DD
    to: string // YYYY-MM-DD
}

const props = withDefaults(
    defineProps<{
        modelValue?: Period
        /** Earliest date available on the timeline (YYYY-MM-DD) */
        timelineStart?: string
        /** Latest date available on the timeline (YYYY-MM-DD), defaults to today */
        timelineEnd?: string
        /** Presets to show */
        presets?: Array<{ key: string; label: string; days: number } | { key: string; label: string; type: 'this_month' }>
    }>(),
    {
        presets: () => [
            { key: 'this_month', label: '', type: 'this_month' as const },
            { key: '7d', label: '', days: 7 },
            { key: '30d', label: '', days: 30 },
            { key: '90d', label: '', days: 90 },
        ],
    },
)

const emit = defineEmits<{
    'update:modelValue': [value: Period]
}>()

// --- Locale ---
const locale = computed(() => {
    const lang = (usePage().props as any).language ?? 'pt_BR'
    return lang.replace('_', '-')
})

// --- Date helpers ---
const today = new Date()
today.setHours(0, 0, 0, 0)

const toDateStr = (d: Date): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

const parseDate = (s: string): Date => {
    const [y, m, d] = s.split('-').map(Number)
    return new Date(y, m - 1, d)
}

const addDays = (d: Date, n: number): Date => {
    const r = new Date(d)
    r.setDate(r.getDate() + n)
    return r
}

const diffDays = (a: Date, b: Date): number => {
    return Math.round((b.getTime() - a.getTime()) / 86400000)
}

const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth() + 1, 0)

const formatMonthLabel = (d: Date): string => {
    return d.toLocaleDateString(locale.value, { month: 'long' })
}

const formatDateLabel = (d: Date): string => {
    const isToday = toDateStr(d) === toDateStr(today)
    if (isToday) return __('form.today')
    return d.toLocaleDateString(locale.value, { day: 'numeric', month: 'long' })
}

// --- Boundary (full allowed range) ---
const boundaryEnd = computed(() => (props.timelineEnd ? parseDate(props.timelineEnd) : new Date(today)))
const boundaryStart = computed(() => (props.timelineStart ? parseDate(props.timelineStart) : (() => { const d = new Date(today); d.setMonth(d.getMonth() - 6); d.setDate(1); return d })()))

// --- Visible window (what's rendered, ~5 months ending at boundaryEnd) ---
const VISIBLE_MONTHS = 5

const getDefaultViewStart = (): Date => {
    const d = new Date(boundaryEnd.value)
    d.setMonth(d.getMonth() - VISIBLE_MONTHS)
    d.setDate(1)
    // Don't go before boundary
    return d < boundaryStart.value ? new Date(boundaryStart.value) : d
}

const viewStart = ref(getDefaultViewStart())
const viewEnd = computed(() => boundaryEnd.value)
const viewTotalDays = computed(() => diffDays(viewStart.value, viewEnd.value))

// --- Selection state ---
const selection = ref<Period>(
    props.modelValue ?? {
        from: toDateStr(startOfMonth(today)),
        to: toDateStr(today),
    },
)

watch(
    () => props.modelValue,
    (v) => {
        if (v) selection.value = { ...v }
    },
)

const selectionFrom = computed(() => parseDate(selection.value.from))
const selectionTo = computed(() => parseDate(selection.value.to))
const selectionDays = computed(() => diffDays(selectionFrom.value, selectionTo.value) + 1)

const emitUpdate = () => {
    emit('update:modelValue', { ...selection.value })
}

// --- Preset logic ---
const activePreset = ref<string>('this_month')

const presetLabels: Record<string, string> = {
    this_month: __('form.this_month'),
    '7d': __('form.last_7d'),
    '30d': '30D',
    '90d': '90D',
}

const applyPreset = (preset: (typeof props.presets)[number]) => {
    activePreset.value = preset.key
    if ('type' in preset && preset.type === 'this_month') {
        selection.value = {
            from: toDateStr(startOfMonth(today)),
            to: toDateStr(today),
        }
    } else if ('days' in preset) {
        selection.value = {
            from: toDateStr(addDays(today, -(preset.days - 1))),
            to: toDateStr(today),
        }
    }
    ensureSelectionVisible()
    emitUpdate()
}

// --- Month labels for the timeline ---
const months = computed(() => {
    const result: Array<{ date: Date; label: string; dayOffset: number; daysInMonth: number }> = []
    const d = new Date(viewStart.value)
    while (d <= viewEnd.value) {
        const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
        const monthEnd = endOfMonth(d)
        const dayOffset = diffDays(viewStart.value, monthStart)
        result.push({
            date: monthStart,
            label: formatMonthLabel(d),
            dayOffset: Math.max(0, dayOffset),
            daysInMonth: diffDays(monthStart, monthEnd) + 1,
        })
        d.setMonth(d.getMonth() + 1)
        d.setDate(1)
    }
    return result
})

// --- Scrubber dimensions ---
const trackRef = ref<HTMLElement | null>(null)
const trackWidth = ref(0)

const updateTrackWidth = () => {
    if (trackRef.value) {
        trackWidth.value = trackRef.value.clientWidth
    }
}

onMounted(() => {
    updateTrackWidth()
    window.addEventListener('resize', updateTrackWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateTrackWidth)
})

const dayWidth = computed(() => (trackWidth.value > 0 ? trackWidth.value / viewTotalDays.value : 0))

const selectionLeft = computed(() => {
    const offset = diffDays(viewStart.value, selectionFrom.value)
    return offset * dayWidth.value
})

const selectionWidth = computed(() => selectionDays.value * dayWidth.value)

// --- Day label text (compact when narrow) ---
const dayLabel = computed(() => {
    const d = selectionDays.value
    if (selectionWidth.value < 50) return `${d}`
    return `${d} ${d === 1 ? __('form.day') : __('form.days')}`
})

// --- Tick marks ---
const ticks = computed(() => {
    const result: Array<{ x: number; isMonthStart: boolean }> = []
    for (let i = 0; i <= viewTotalDays.value; i++) {
        const d = addDays(viewStart.value, i)
        result.push({
            x: i * dayWidth.value,
            isMonthStart: d.getDate() === 1,
        })
    }
    return result
})

// --- Drag selection window ---
const dragging = ref<'move' | 'resize-left' | 'resize-right' | null>(null)
const dragStartX = ref(0)
const dragStartFrom = ref('')
const dragStartTo = ref('')

const onPointerDown = (e: PointerEvent, mode: 'move' | 'resize-left' | 'resize-right') => {
    e.preventDefault()
    dragging.value = mode
    dragStartX.value = e.clientX
    dragStartFrom.value = selection.value.from
    dragStartTo.value = selection.value.to
    activePreset.value = ''

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
}

const onPointerMove = (e: PointerEvent) => {
    if (!dragging.value || dayWidth.value === 0) return

    const dx = e.clientX - dragStartX.value
    const dayDelta = Math.round(dx / dayWidth.value)
    if (dayDelta === 0 && dragging.value !== 'move') return

    const origFrom = parseDate(dragStartFrom.value)
    const origTo = parseDate(dragStartTo.value)

    if (dragging.value === 'move') {
        let clampedDelta = dayDelta

        // Don't allow moving past timeline end
        const maxForwardDelta = diffDays(origTo, boundaryEnd.value)
        if (clampedDelta > maxForwardDelta) clampedDelta = maxForwardDelta

        // Don't allow moving before timeline start
        const maxBackDelta = -diffDays(viewStart.value, origFrom)
        if (clampedDelta < maxBackDelta) clampedDelta = maxBackDelta

        const newFrom = addDays(origFrom, clampedDelta)
        const newTo = addDays(origTo, clampedDelta)

        selection.value = { from: toDateStr(newFrom), to: toDateStr(newTo) }
    } else if (dragging.value === 'resize-left') {
        let newFrom = addDays(origFrom, dayDelta)
        if (newFrom < viewStart.value) newFrom = new Date(viewStart.value)
        if (newFrom >= origTo) newFrom = addDays(origTo, -1)
        selection.value = { from: toDateStr(newFrom), to: toDateStr(origTo) }
    } else if (dragging.value === 'resize-right') {
        let newTo = addDays(origTo, dayDelta)
        if (newTo > boundaryEnd.value) newTo = new Date(boundaryEnd.value)
        if (newTo <= origFrom) newTo = addDays(origFrom, 1)
        selection.value = { from: toDateStr(origFrom), to: toDateStr(newTo) }
    }
}

const onPointerUp = () => {
    dragging.value = null
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    emitUpdate()
}

// --- Month click ---
const onMonthClick = (month: { date: Date }) => {
    const from = startOfMonth(month.date)
    let to = endOfMonth(month.date)
    if (to > boundaryEnd.value) to = new Date(boundaryEnd.value)
    activePreset.value = ''
    selection.value = { from: toDateStr(from), to: toDateStr(to) }
    ensureSelectionVisible()
    emitUpdate()
}

// --- Scroll arrows ---
const defaultViewStart = getDefaultViewStart()

const scrollTimeline = (direction: 'left' | 'right') => {
    const shift = direction === 'left' ? -3 : 3
    const d = new Date(viewStart.value)
    d.setMonth(d.getMonth() + shift)

    // Clamp: don't go before boundary start
    if (d < boundaryStart.value) {
        viewStart.value = new Date(boundaryStart.value)
        return
    }
    // Clamp: don't go past the default view start (which shows the end)
    if (d > defaultViewStart) {
        viewStart.value = new Date(defaultViewStart)
        return
    }
    viewStart.value = d
}

const canScrollLeft = computed(() => viewStart.value > boundaryStart.value)
const canScrollRight = computed(() => viewStart.value < defaultViewStart)

const ensureSelectionVisible = () => {
    const from = parseDate(selection.value.from)
    if (from < viewStart.value) {
        const d = new Date(from)
        d.setDate(1)
        viewStart.value = d < boundaryStart.value ? new Date(boundaryStart.value) : d
    }
}

// --- Check if month is within selection ---
const isMonthInSelection = (monthDate: Date): boolean => {
    const monthEnd = endOfMonth(monthDate)
    return monthDate <= selectionTo.value && monthEnd >= selectionFrom.value
}

// --- Header text ---
const headerText = computed(() => {
    return `${formatDateLabel(selectionFrom.value)} – ${formatDateLabel(selectionTo.value)}`
})
</script>

<template>
    <div class="rounded-xl border border-border bg-card overflow-hidden select-none">
        <!-- Top row: date range + presets -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-border">
            <span class="text-sm font-medium">{{ headerText }}</span>
            <div class="flex items-center gap-1">
                <button
                    v-for="preset in presets"
                    :key="preset.key"
                    type="button"
                    :class="[
                        'px-3 py-1 text-sm rounded-md transition-colors',
                        activePreset === preset.key
                            ? 'border border-border bg-background font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                    ]"
                    @click="applyPreset(preset)"
                >
                    {{ preset.label || presetLabels[preset.key] || preset.key }}
                </button>
            </div>
        </div>

        <!-- Bottom row: timeline scrubber -->
        <div class="px-4 py-3">
            <div class="flex items-center gap-2">
                <!-- Scroll arrows -->
                <button
                    v-if="canScrollLeft"
                    type="button"
                    aria-label="Scroll timeline left"
                    class="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                    @click="scrollTimeline('left')"
                >
                    <Icon name="icon-chevrons-left" class="size-4" />
                </button>
                <button
                    v-else-if="canScrollRight"
                    type="button"
                    aria-label="Scroll timeline right"
                    class="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                    @click="scrollTimeline('right')"
                >
                    <Icon name="icon-chevrons-right" class="size-4" />
                </button>
                <div v-else class="w-6" />

                <!-- Track -->
                <div ref="trackRef" class="relative flex-1 h-10">
                    <!-- Tick marks -->
                    <svg class="absolute inset-0 w-full h-5 pointer-events-none" preserveAspectRatio="none">
                        <line
                            v-for="(tick, i) in ticks"
                            :key="i"
                            :x1="tick.x"
                            :x2="tick.x"
                            y1="4"
                            :y2="tick.isMonthStart ? 18 : 14"
                            class="stroke-muted-foreground/30"
                            stroke-width="1"
                        />
                    </svg>

                    <!-- Selection window -->
                    <div
                        class="absolute top-0 left-0 h-6 rounded-md border border-border bg-background flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                        :style="{
                            width: `${selectionWidth}px`,
                            transform: `translateX(${selectionLeft}px)`,
                        }"
                        @pointerdown="onPointerDown($event, 'move')"
                    >
                        <!-- Resize handles -->
                        <div
                            class="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-20"
                            @pointerdown.stop="onPointerDown($event, 'resize-left')"
                        />
                        <div
                            class="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20"
                            @pointerdown.stop="onPointerDown($event, 'resize-right')"
                        />

                        <!-- Day count label -->
                        <span class="text-xs font-medium whitespace-nowrap pointer-events-none">
                            {{ dayLabel }}
                        </span>
                    </div>

                    <!-- Month labels -->
                    <div class="absolute bottom-0 left-0 right-0 flex pointer-events-none" style="top: 24px">
                        <button
                            v-for="month in months"
                            :key="month.dayOffset"
                            type="button"
                            :aria-label="month.label"
                            class="text-xs truncate text-left pointer-events-auto cursor-pointer transition-colors"
                            :class="isMonthInSelection(month.date) ? 'text-foreground font-semibold' : 'text-muted-foreground'"
                            :style="{ position: 'absolute', left: `${month.dayOffset * dayWidth}px`, width: `${month.daysInMonth * dayWidth}px` }"
                            @click="onMonthClick(month)"
                        >
                            {{ month.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
