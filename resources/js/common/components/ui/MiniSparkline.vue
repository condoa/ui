<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    data: Array<{ date: string; value: number }>
    width?: number
    height?: number
}

const props = withDefaults(defineProps<Props>(), {
    width: 60,
    height: 20,
})

const points = computed(() => {
    if (props.data.length < 2) return ''

    const values = props.data.map((d) => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    return props.data
        .map((d, i) => {
            const x = (i / (props.data.length - 1)) * props.width
            const y = props.height - ((d.value - min) / range) * props.height
            return `${x.toFixed(1)},${y.toFixed(1)}`
        })
        .join(' ')
})
</script>

<template>
    <svg
        v-if="data.length >= 2"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        class="overflow-visible"
    >
        <polyline
            :points="points"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
        />
    </svg>
</template>
