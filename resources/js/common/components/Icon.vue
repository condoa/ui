<template>
    <span
        v-html="svg"
        :class="cn('size-5', props.class, 'inline-flex items-center justify-center shrink-0 [&>svg]:size-full [&>svg]:block')"
    />
</template>

<script setup>
import { cn } from '@/common/helpers/cn'
import iconMap from '@/icons'

const props = defineProps({
    name: '',
    class: '',
})

const resolvedKey = computed(() => {
    const name = props.name ?? ''
    if (iconMap[name]) return name
    const prefixed = `icon-${name}`
    if (iconMap[prefixed]) return prefixed
    return name
})

const svg = computed(() => {
    const key = resolvedKey.value
    if (!iconMap[key]) {
        console.error(`Icon "${props.name}" not found in map.`)
        return ''
    }
    return iconMap[key]
})
</script>
