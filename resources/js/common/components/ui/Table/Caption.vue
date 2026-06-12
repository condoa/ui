<template>
    <caption data-slot="table-caption" :class="styles({ class: props.class })">
        <slot />
    </caption>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'mt-4 text-sm text-muted-foreground in-data-[slot=frame]:my-4',
})
</script>
