<template>
    <thead data-slot="table-header" :class="styles({ class: props.class })">
        <slot />
    </thead>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: '[&_tr]:border-b in-data-[slot=frame]:**:[th]:h-9 in-data-[slot=frame]:*:[tr]:border-none in-data-[slot=frame]:*:[tr]:hover:bg-transparent',
})
</script>
