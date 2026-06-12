<template>
    <Checkbox
        :model-value="isSelected"
        :indeterminate="isIndeterminate"
        @update:model-value="onToggle"
        :aria-label="ariaLabel"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Table, Row } from '@tanstack/vue-table'

interface Props {
    /** For header checkbox - select all */
    table?: Table<unknown>
    /** For row checkbox - select single row */
    row?: Row<unknown>
}

const props = defineProps<Props>()

const isSelected = computed(() => {
    if (props.table) {
        return props.table.getIsAllPageRowsSelected()
    }
    if (props.row) {
        return props.row.getIsSelected()
    }
    return false
})

const isIndeterminate = computed(() => {
    if (props.table) {
        return props.table.getIsSomePageRowsSelected()
    }
    return false
})

const ariaLabel = computed(() => {
    if (props.table) {
        return 'Selecionar todos'
    }
    return 'Selecionar linha'
})

const onToggle = (value: boolean) => {
    if (props.table) {
        props.table.toggleAllPageRowsSelected(value)
    } else if (props.row) {
        props.row.toggleSelected(value)
    }
}
</script>
