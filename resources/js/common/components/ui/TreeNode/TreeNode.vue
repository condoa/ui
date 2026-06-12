<script setup lang="ts">
import { ref, watch } from 'vue'
import Icon from '@/common/components/Icon.vue'

const props = withDefaults(
    defineProps<{
        code?: string
        name?: string
        depth?: number
        isFirstChild?: boolean
        isLastChild?: boolean
        hasChildren?: boolean
        forceCollapsed?: boolean
        showRow?: boolean
    }>(),
    { depth: 1, isFirstChild: true, isLastChild: true, hasChildren: false, forceCollapsed: false, showRow: true },
)

const isCollapsed = ref(props.forceCollapsed)

watch(
    () => props.forceCollapsed,
    (val) => {
        if (props.hasChildren) {
            isCollapsed.value = val
        }
    },
)

defineExpose({ isCollapsed })
</script>

<template>
    <div class="relative">
        <!-- Vertical guide line spanning full node height (including children) -->
        <div
            v-if="depth > 1 && !isLastChild"
            class="absolute top-0 bottom-0 w-px bg-neutral-300 dark:bg-neutral-600"
            :style="{ left: `calc(${depth}rem - 0.5rem)` }"
        ></div>

        <!-- Row -->
        <div
            v-show="showRow"
            class="group relative flex items-center justify-between px-4 py-2.5 border-t border-border/50 hover:bg-muted/50"
            :class="[depth === 1 ? 'bg-muted/30 py-3 hover:bg-muted/50' : '']"
            :style="{ paddingLeft: `${depth * 1}rem` }"
        >
            <!-- Last child: L-shape (top to center only) -->
            <div
                v-if="depth > 1 && isLastChild"
                class="absolute -top-px h-[calc(50%+1px)] w-px bg-neutral-300 dark:bg-neutral-600"
                :style="{ left: `calc(${depth}rem - 0.5rem)` }"
            ></div>
            <!-- Horizontal connector -->
            <div
                v-if="depth > 1"
                class="absolute h-px bg-neutral-300 dark:bg-neutral-600"
                style="top: 50%"
                :style="{ left: `calc(${depth}rem - 0.5rem)`, width: hasChildren ? '0.5rem' : '1.25rem' }"
            ></div>

            <div
                class="flex items-center gap-2 min-w-0 rounded outline-none"
                :class="[depth > 1 ? 'ml-0.5' : '', hasChildren ? 'cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1' : '']"
                :tabindex="hasChildren ? 0 : undefined"
                :role="hasChildren ? 'button' : undefined"
                :aria-expanded="hasChildren ? !isCollapsed : undefined"
                @click="hasChildren && (isCollapsed = !isCollapsed)"
                @keydown.enter.prevent="hasChildren && (isCollapsed = !isCollapsed)"
                @keydown.space.prevent="hasChildren && (isCollapsed = !isCollapsed)"
            >
                <Icon
                    v-if="hasChildren"
                    name="icon-chevron-right"
                    aria-hidden="true"
                    class="size-3.5 text-muted-foreground shrink-0 transition-transform duration-150"
                    :class="{ 'rotate-90': !isCollapsed }"
                />
                <span v-else class="size-3.5 shrink-0" />
                <slot name="content">
                    <span v-if="code" class="font-mono text-xs text-muted-foreground shrink-0">{{ code }}</span>
                    <span v-if="name" class="text-sm truncate" :class="{ 'font-medium': depth === 1 }">{{ name }}</span>
                </slot>
                <slot name="badges" />
            </div>

            <slot name="actions" />
        </div>

        <!-- Extra content between row and children (e.g., inline editing) -->
        <slot name="extra" />

        <!-- Children -->
        <div v-if="hasChildren" v-show="!isCollapsed">
            <slot name="children" />
        </div>

        <!-- Append content after children (e.g., quick-add form) -->
        <slot name="append" />
    </div>
</template>
