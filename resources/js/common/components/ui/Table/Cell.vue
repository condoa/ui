<template>
    <td data-slot="table-cell" :class="styles({ class: props.class })">
        <slot />
    </td>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'whitespace-nowrap p-2.5 align-middle leading-none has-[[role=checkbox]]:pe-0 in-data-[slot=frame]:first:p-[calc(var(--spacing)*2.5-1px)] in-data-[slot=frame]:last:p-[calc(var(--spacing)*2.5-1px)]',
})
</script>
