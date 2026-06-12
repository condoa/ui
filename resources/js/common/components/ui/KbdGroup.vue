<template>
    <kbd data-slot="kbd-group" :class="cn('inline-flex items-center gap-1', props.class)">
        <slot />
    </kbd>
</template>

<script setup lang="ts">
import { cn } from '@/common/helpers/cn'
import type { ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the component */
    class?: ClassValue
}

const props = defineProps<Props>()
</script>
