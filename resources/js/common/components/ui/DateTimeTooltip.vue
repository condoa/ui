<script setup lang="ts">
interface Datetime {
    human: string
    formatted: string
}

defineProps<{
    date: Datetime
}>()
</script>

<template>
    <Tooltip>
        <TooltipTrigger as-child>
            <span class="text-xs text-muted-foreground cursor-default"><slot>{{ date.human }}</slot></span>
        </TooltipTrigger>
        <TooltipContent class="dark px-2 py-1 text-xs" :show-arrow="true">
            {{ date.formatted }}
        </TooltipContent>
    </Tooltip>
</template>
