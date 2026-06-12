<template>
    <div data-slot="table-container" class="relative w-full overflow-x-auto">
        <table data-slot="table" :class="styles({ class: props.class })" v-bind="$attrs">
            <slot />
        </table>
    </div>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props {
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'w-full caption-bottom text-sm in-data-[slot=frame]:border-separate in-data-[slot=frame]:border-spacing-0',
})
</script>
