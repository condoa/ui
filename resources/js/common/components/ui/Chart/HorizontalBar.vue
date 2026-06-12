<script setup lang="ts">
import { computed } from 'vue'

interface HorizontalBarItem {
    label: string
    primary: number
    secondary: number
}

const props = withDefaults(
    defineProps<{
        items: HorizontalBarItem[]
        primaryLabel?: string
        secondaryLabel?: string
        primaryColor?: string
        secondaryColor?: string
        format?: 'currency' | 'number'
    }>(),
    {
        primaryLabel: 'Primary',
        secondaryLabel: 'Secondary',
        primaryColor: 'bg-blue-500 dark:bg-blue-400',
        secondaryColor: 'bg-blue-200 dark:bg-blue-900',
        format: 'currency',
    },
)

const maxValue = computed(() => {
    if (!props.items.length) return 1
    return Math.max(...props.items.flatMap((d) => [d.primary, d.secondary]), 1)
})

const formatValue = (value: number) => {
    if (props.format === 'number') {
        return new Intl.NumberFormat('pt-BR').format(value)
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value)
}
</script>

<template>
    <div v-if="items.length > 0">
        <div class="space-y-3">
            <div v-for="item in items" :key="item.label" class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                    <span class="text-muted-foreground">{{ item.label }}</span>
                    <span class="font-mono tabular-nums text-muted-foreground">
                        {{ formatValue(item.primary) }} / {{ formatValue(item.secondary) }}
                    </span>
                </div>
                <div class="relative h-2 rounded-full bg-muted overflow-hidden">
                    <div
                        class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        :class="secondaryColor"
                        :style="{ width: `${(item.secondary / maxValue) * 100}%` }"
                    />
                    <div
                        class="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        :class="primaryColor"
                        :style="{ width: `${(item.primary / maxValue) * 100}%` }"
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-32 text-sm text-muted-foreground">
        {{ __('analytics.no_data') }}
    </div>
</template>
