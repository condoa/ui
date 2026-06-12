<template>
    <tr data-slot="table-row" :class="styles({ class: props.class })">
        <slot />
    </tr>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'border-b transition-colors hover:bg-muted/72 data-[state=selected]:bg-muted/72 in-data-[slot=frame]:hover:bg-transparent in-data-[slot=frame]:data-[state=selected]:bg-transparent',
})
</script>
