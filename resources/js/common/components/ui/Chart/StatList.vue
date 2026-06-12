<script setup lang="ts">
import Badge from '../Badge.vue'
import { Link } from '@inertiajs/vue3'

type BadgeVariant = 'default' | 'primary' | 'destructive' | 'destructiveoutline' | 'outline' | 'secondary' | 'warning' | 'success' | 'info' | 'amber' | 'destructivesolid' | 'purple'

interface StatListItem {
    label: string
    value: string
    sub_label?: string | null
    badge?: { text: string; variant: string } | null
    link?: string | null
    icon?: string | null
}

defineProps<{
    items: StatListItem[]
    emptyText?: string
    compact?: boolean
}>()

const getBadgeTrend = (text: string): 'up' | 'down' | null => {
    // Only show arrows for numeric trends like "+12%", "-0.5%", "+3"
    if (/^\+[\d.,]+%?$/.test(text.trim())) return 'up'
    if (/^-[\d.,]+%?$/.test(text.trim())) return 'down'
    return null
}

const ALLOWED_BADGE_VARIANTS: ReadonlySet<BadgeVariant> = new Set([
    'default', 'primary', 'destructive', 'destructiveoutline', 'outline',
    'secondary', 'warning', 'success', 'info', 'amber', 'destructivesolid', 'purple',
])

const toBadgeVariant = (variant: string | undefined | null): BadgeVariant => {
    return variant && ALLOWED_BADGE_VARIANTS.has(variant as BadgeVariant) ? (variant as BadgeVariant) : 'outline'
}
</script>

<template>
    <div v-if="items.length > 0" class="divide-y divide-border">
        <component
            :is="item.link ? Link : 'div'"
            v-for="(item, index) in items"
            :key="index"
            :href="item.link || undefined"
            class="stat-item group flex items-center justify-between gap-3 px-4 transition-colors duration-150 ease-out"
            :class="[
                compact ? 'py-2' : 'py-3',
                item.link ? 'hover:bg-muted/50 cursor-pointer' : 'hover:bg-muted/30',
            ]"
            :style="{ '--stagger': index }"
        >
            <!-- Left: Icon + Label -->
            <div class="flex items-center gap-3 min-w-0">
                <div
                    v-if="item.icon"
                    class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors duration-150 group-hover:bg-muted group-hover:text-foreground"
                >
                    <Icon :name="item.icon" class="size-4" />
                </div>
                <div class="min-w-0">
                    <p class="text-sm text-muted-foreground truncate">{{ item.label }}</p>
                    <p v-if="item.sub_label" class="text-xs text-muted-foreground/70">{{ item.sub_label }}</p>
                </div>
            </div>

            <!-- Right: Value + Badge -->
            <div class="flex items-center gap-2 shrink-0">
                <span class="text-sm font-semibold tabular-nums">{{ item.value }}</span>
                <Badge v-if="item.badge" :variant="toBadgeVariant(item.badge.variant)" size="sm" class="font-medium tabular-nums">
                    <svg v-if="getBadgeTrend(item.badge.text) === 'up'" class="-ml-0.5 mr-px size-3" viewBox="0 0 12 12" fill="none">
                        <path d="M6 3v6M6 3L3.5 5.5M6 3l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg v-else-if="getBadgeTrend(item.badge.text) === 'down'" class="-ml-0.5 mr-px size-3" viewBox="0 0 12 12" fill="none">
                        <path d="M6 9V3M6 9L3.5 6.5M6 9l2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    {{ item.badge.text }}
                </Badge>
                <!-- Link arrow indicator -->
                <svg
                    v-if="item.link"
                    class="size-4 text-muted-foreground/50 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-muted-foreground"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>
        </component>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div class="flex size-10 items-center justify-center rounded-full bg-muted">
            <svg class="size-5 text-muted-foreground" viewBox="0 0 20 20" fill="none">
                <path d="M3 10h14M10 3v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
            </svg>
        </div>
        <p class="text-sm text-muted-foreground">{{ emptyText || __('analytics.no_data') }}</p>
    </div>
</template>

<style scoped>
/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    .stat-item {
        transition: none;
    }

    .stat-item svg {
        transition: none;
    }
}
</style>
