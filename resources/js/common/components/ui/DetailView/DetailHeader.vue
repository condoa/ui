<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <div class="bg-primary/5 rounded-md p-4 space-y-3">
        <h1 class="text-xl font-semibold">{{ title }}</h1>
        <div v-if="$slots.badges" class="flex items-center gap-2 flex-wrap">
            <slot name="badges" />
        </div>
    </div>
</template>
