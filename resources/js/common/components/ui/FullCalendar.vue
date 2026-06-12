<template>
    <div class="w-full select-none">
        <!-- Header: month/year nav -->
        <div class="flex items-center justify-between mb-3" :class="headerClass">
            <button type="button" aria-label="Previous month" class="size-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" @click="prevMonth">
                <Icon name="icon-chevron-left" class="size-4" />
            </button>
            <span class="text-sm font-semibold capitalize-first">{{ monthYearLabel }}</span>
            <button type="button" aria-label="Next month" class="size-8 flex items-center justify-center rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none" @click="nextMonth">
                <Icon name="icon-chevron-right" class="size-4" />
            </button>
        </div>

        <!-- Day names -->
        <div class="grid grid-cols-7 mb-1">
            <div v-for="day in dayNames" :key="day" class="text-center text-xs font-semibold text-muted-foreground py-1.5">
                {{ day }}
            </div>
        </div>

        <!-- Day grid -->
        <div class="grid grid-cols-7">
            <button
                v-for="(day, index) in calendarDays"
                :key="index"
                type="button"
                :disabled="day.disabled"
                :title="day.marked?.label"
                class="relative aspect-square min-h-16 flex items-center justify-center text-base rounded-md transition-colors"
                :class="[
                    day.isToday && !day.isSelected && 'border border-border',
                    day.isSelected && 'bg-primary text-primary-foreground font-medium',
                    day.isOffset && !day.disabled && 'text-muted-foreground/40',
                    day.disabled && 'text-muted-foreground/30 cursor-not-allowed',
                    !day.isSelected && !day.disabled && 'hover:bg-accent cursor-pointer',
                    day.marked && !day.isSelected && day.marked.variant === 'destructive' && 'text-destructive font-medium',
                    day.marked && !day.isSelected && day.marked.variant === 'warning' && 'text-amber-600 dark:text-amber-500 font-medium',
                    day.marked && !day.isSelected && (!day.marked.variant || day.marked.variant === 'default') && 'text-primary font-medium',
                ]"
                @click="!day.disabled && selectDay(day.date)"
            >
                {{ day.label }}
                <span v-if="day.marks.length" class="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <span
                        v-for="(mark, mi) in day.marks"
                        :key="mi"
                        class="size-1 rounded-full"
                        :class="[
                            day.isSelected ? 'bg-primary-foreground' :
                            mark.variant === 'destructive' ? 'bg-destructive' :
                            mark.variant === 'warning' ? 'bg-amber-500' :
                            'bg-primary',
                        ]"
                    />
                </span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Icon from '@/common/components/Icon.vue'
interface MarkedDate {
    date: string // YYYY-MM-DD
    label?: string
    variant?: 'default' | 'destructive' | 'warning'
}

interface Props {
    modelValue?: Date | null
    minDate?: Date | null
    maxDate?: Date | null
    dayNames?: string[]
    locale?: string
    weekStart?: number
    markedDates?: MarkedDate[]
    headerClass?: string
    initialMonth?: Date | null
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    initialMonth: null,
    minDate: null,
    maxDate: null,
    locale: 'pt-BR',
    weekStart: 0,
    markedDates: () => [],
})

const emit = defineEmits<{
    'update:modelValue': [value: Date | null]
    'monthChange': [year: number, month: number]
}>()

const initialDate = props.modelValue ?? props.initialMonth ?? new Date()
const currentMonth = ref(initialDate.getMonth())
const currentYear = ref(initialDate.getFullYear())

const dayNames = computed(() => {
    if (props.dayNames) { return props.dayNames }
    const days = []
    const base = new Date(2024, 0, 7 + props.weekStart) // 2024-01-07 is a Sunday
    for (let i = 0; i < 7; i++) {
        const d = new Date(base)
        d.setDate(base.getDate() + i)
        days.push(d.toLocaleDateString(props.locale, { weekday: 'short' }).replace('.', ''))
    }
    return days
})

const monthYearLabel = computed(() => {
    const date = new Date(currentYear.value, currentMonth.value, 1)
    return date.toLocaleDateString(props.locale, { month: 'long', year: 'numeric' })
})

const isSameDay = (a: Date, b: Date): boolean => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const isBeforeDay = (a: Date, b: Date): boolean => {
    const ac = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const bc = new Date(b.getFullYear(), b.getMonth(), b.getDate())
    return ac < bc
}

const isAfterDay = (a: Date, b: Date): boolean => {
    const ac = new Date(a.getFullYear(), a.getMonth(), a.getDate())
    const bc = new Date(b.getFullYear(), b.getMonth(), b.getDate())
    return ac > bc
}

const calendarDays = computed(() => {
    const days: Array<{
        date: Date
        label: number
        isToday: boolean
        isSelected: boolean
        isOffset: boolean
        disabled: boolean
        marked?: MarkedDate
        marks: MarkedDate[]
    }> = []

    const firstOfMonth = new Date(currentYear.value, currentMonth.value, 1)
    const lastOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
    const today = new Date()

    // Days from previous month to fill first week
    let startDay = firstOfMonth.getDay() - props.weekStart
    if (startDay < 0) { startDay += 7 }

    for (let i = startDay - 1; i >= 0; i--) {
        const date = new Date(currentYear.value, currentMonth.value, -i)
        const marks = getMarks(date)
        days.push({
            date,
            label: date.getDate(),
            isToday: isSameDay(date, today),
            isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
            isOffset: true,
            disabled: isDayDisabled(date),
            marked: marks[0],
            marks,
        })
    }

    // Days of current month
    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
        const date = new Date(currentYear.value, currentMonth.value, d)
        const marks = getMarks(date)
        days.push({
            date,
            label: d,
            isToday: isSameDay(date, today),
            isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
            isOffset: false,
            disabled: isDayDisabled(date),
            marked: marks[0],
            marks,
        })
    }

    // Days from next month to fill last week
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
        for (let i = 1; i <= remaining; i++) {
            const date = new Date(currentYear.value, currentMonth.value + 1, i)
            const marks = getMarks(date)
            days.push({
                date,
                label: i,
                isToday: isSameDay(date, today),
                isSelected: props.modelValue ? isSameDay(date, props.modelValue) : false,
                isOffset: true,
                disabled: isDayDisabled(date),
                marked: marks[0],
                marks,
            })
        }
    }

    return days
})

const markedDateMap = computed(() => {
    const map = new Map<string, MarkedDate[]>()
    for (const m of props.markedDates) {
        const existing = map.get(m.date)
        if (existing) {
            existing.push(m)
        } else {
            map.set(m.date, [m])
        }
    }
    return map
})

const getMarks = (date: Date): MarkedDate[] => {
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return markedDateMap.value.get(key) ?? []
}

const isDayDisabled = (date: Date): boolean => {
    if (props.minDate && isBeforeDay(date, props.minDate)) { return true }
    if (props.maxDate && isAfterDay(date, props.maxDate)) { return true }
    return false
}

const selectDay = (date: Date) => {
    emit('update:modelValue', date)
}

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11
        currentYear.value--
    } else {
        currentMonth.value--
    }
    emit('monthChange', currentYear.value, currentMonth.value)
}

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0
        currentYear.value++
    } else {
        currentMonth.value++
    }
    emit('monthChange', currentYear.value, currentMonth.value)
}

// Sync when modelValue changes externally
watch(() => props.modelValue, (val) => {
    if (val) {
        currentMonth.value = val.getMonth()
        currentYear.value = val.getFullYear()
    }
})
</script>
