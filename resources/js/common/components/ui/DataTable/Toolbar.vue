<template>
    <div data-slot="data-table-toolbar" class="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-1 items-center gap-2">
            <slot name="search">
                <VeeInput
                    v-if="searchColumn"
                    :placeholder="searchPlaceholder"
                    :model-value="searchValue"
                    @update:model-value="onSearchChange"
                    class="max-w-sm pe-9"
                    type="search"
                    icon="icon-search"
                >
                    <template v-if="searchValue" #trailingIcon>
                        <button type="button" tabindex="-1" class="absolute inset-y-0 right-3 flex items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground" @click="onSearchChange('')">
                            <Icon name="icon-close" class="size-3.5" />
                        </button>
                    </template>
                </VeeInput>
            </slot>
            <slot name="filters" :table="table" />
        </div>

        <div class="flex items-center gap-2">
            <slot name="actions" :table="table" />

            <DropdownMenu v-if="enableColumnVisibility">
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" size="sm">
                        <Icon name="icon-settings-2" class="size-4" />
                        Colunas
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-40">
                    <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        v-for="column in table.getAllColumns().filter((col) => col.getCanHide())"
                        :key="column.id"
                        :model-value="column.getIsVisible()"
                        @update:model-value="(value: unknown) => column.toggleVisibility(!!value)"
                    >
                        {{ getColumnLabel(column) }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import type { Table, Column } from '@tanstack/vue-table'
import { router } from '@inertiajs/vue3'

const debounce = <Args extends unknown[]>(fn: (...args: Args) => void, wait: number) => {
    let timer: ReturnType<typeof setTimeout> | undefined
    return (...args: Args): void => {
        if (timer) { clearTimeout(timer) }
        timer = setTimeout(() => fn(...args), wait)
    }
}

interface Props {
    table: Table<unknown>
    searchColumn?: string
    searchPlaceholder?: string
    searchValue?: string
    enableColumnVisibility?: boolean
    serverSide?: boolean
    debounceMs?: number
}

const props = withDefaults(defineProps<Props>(), {
    searchPlaceholder: 'Buscar...',
    searchValue: '',
    enableColumnVisibility: true,
    serverSide: true,
    debounceMs: 300,
})

const emit = defineEmits<{
    'update:searchValue': [value: string]
}>()

const getColumnLabel = (column: Column<unknown, unknown>): string => {
    const header = column.columnDef.header
    if (typeof header === 'string') return header
    return column.id
}

const performSearch = debounce((value: string) => {
    if (props.serverSide && props.searchColumn) {
        const url = new URL(window.location.href)

        if (value) {
            url.searchParams.set(props.searchColumn, value)
        } else {
            url.searchParams.delete(props.searchColumn)
        }

        url.searchParams.set('page', '1')

        router.get(url.toString(), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        })
    }
}, props.debounceMs)

const onSearchChange = (value: string) => {
    emit('update:searchValue', value)

    if (props.serverSide) {
        performSearch(value)
    } else if (props.searchColumn) {
        props.table.getColumn(props.searchColumn)?.setFilterValue(value)
    }
}
</script>
