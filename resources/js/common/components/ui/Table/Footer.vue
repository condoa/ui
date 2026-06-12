<template>
    <tfoot data-slot="table-footer" :class="styles({ class: props.class })">
        <slot />
    </tfoot>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'border-t bg-muted/72 font-medium [&>tr]:last:border-b-0 in-data-[slot=frame]:border-none in-data-[slot=frame]:bg-transparent in-data-[slot=frame]:*:[tr]:hover:bg-transparent',
})
</script>
