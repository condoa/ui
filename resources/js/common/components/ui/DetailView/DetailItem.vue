<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
defineProps<{
    label: string
    icon?: string
}>()
</script>

<template>
    <div>
        <div class="text-xs text-muted-foreground mb-1">{{ label }}</div>
        <div class="flex items-center gap-1.5 text-sm">
            <Icon v-if="icon" :name="icon" aria-hidden="true" class="size-4 text-muted-foreground shrink-0" />
            <slot />
        </div>
    </div>
</template>
