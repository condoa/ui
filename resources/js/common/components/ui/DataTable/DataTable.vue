<template>
    <div data-slot="data-table" :class="['w-full', props.class]">
        <slot name="toolbar" :table="table" />

        <component v-if="separateHeader" :is="headerWrapper" v-bind="headerWrapperProps">
            <Table :class="fixedLayout ? 'table-fixed' : undefined">
                <colgroup>
                    <col
                        v-for="column in table.getVisibleLeafColumns()"
                        :key="column.id"
                        :style="{ width: `${column.getSize()}px` }"
                    />
                </colgroup>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
        </component>

        <component :is="wrapper" v-bind="wrapperProps">
            <Table :class="fixedLayout ? 'table-fixed' : undefined">
                <colgroup>
                    <col
                        v-for="column in table.getVisibleLeafColumns()"
                        :key="column.id"
                        :style="{ width: `${column.getSize()}px` }"
                    />
                </colgroup>
                <TableHeader v-if="!separateHeader">
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :style="{ width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined }"
                        >
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody :framed="tableBodyFramed">
                    <template v-if="table.getRowModel().rows?.length">
                        <template v-for="(row, rowIndex) in table.getRowModel().rows" :key="row.id">
                            <TableRow
                                v-if="rowSeparator?.(row.original, rowIndex)"
                                :key="`${row.id}-separator`"
                                class="hover:bg-transparent"
                            >
                                <TableCell
                                    :colspan="row.getVisibleCells().length"
                                    :class="['bg-muted/40 py-2', rowSeparatorCellClass]"
                                >
                                    <slot
                                        name="row-separator"
                                        :row="row.original"
                                        :index="rowIndex"
                                        :label="rowSeparator?.(row.original, rowIndex)"
                                    >
                                        <div class="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                            <span class="h-px flex-1 bg-border" />
                                            <span class="shrink-0">{{ rowSeparator?.(row.original, rowIndex) }}</span>
                                            <span class="h-px flex-1 bg-border" />
                                        </div>
                                    </slot>
                                </TableCell>
                            </TableRow>
                            <TableRow
                                :data-state="row.getIsSelected() ? 'selected' : undefined"
                                :class="rowClass?.(row.original, rowIndex)"
                            >
                                <TableCell
                                    v-for="cell in row.getVisibleCells()"
                                    :key="cell.id"
                                    :style="{
                                        width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : undefined,
                                    }"
                                >
                                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                                </TableCell>
                            </TableRow>
                        </template>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="columns.length" class="h-24 text-center">
                                <slot name="empty">
                                    <div class="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <Icon
                                            v-if="emptyIcon"
                                            :name="emptyIcon"
                                            class="size-12 mb-3 text-muted-foreground"
                                        />
                                        <p>{{ emptyText || __('datatable.no_results') }}</p>
                                    </div>
                                </slot>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </component>

        <slot name="pagination" :table="table" :meta="meta">
            <DataTablePagination v-if="meta" :table="table as any" :meta="meta" />
        </slot>
    </div>
</template>

<script lang="ts" setup generic="TData, TValue">
import Icon from '@/common/components/Icon.vue';
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    RowSelectionState,
} from '@tanstack/vue-table';
import {
    FlexRender,
    getCoreRowModel,
    useVueTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from '@tanstack/vue-table';
import type { ClassValue } from 'tailwind-variants'
import type { Component } from 'vue';

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    /** Column definitions */
    columns: ColumnDef<TData, TValue>[];
    /** Table data */
    data: TData[];
    /** Pagination meta from Laravel */
    meta?: PaginationMeta;
    /** Enable row selection */
    enableRowSelection?: boolean;
    /** Enable multi-row selection */
    enableMultiRowSelection?: boolean;
    /** Custom class for wrapper */
    class?: ClassValue;
    /** Custom wrapper component */
    wrapper?: Component | string;
    /** Props for the wrapper component */
    wrapperProps?: Record<string, unknown>;
    /** Custom wrapper for a separated table header */
    headerWrapper?: Component | string;
    /** Props for the separated table header wrapper */
    headerWrapperProps?: Record<string, unknown>;
    /** Empty state icon */
    emptyIcon?: string;
    /** Empty state text */
    emptyText?: string;
    /** Server-side mode (disables client-side pagination/sorting) */
    serverSide?: boolean;
    /** Optional row class callback */
    rowClass?: (row: TData, index: number) => ClassValue;
    /** Optional separator label rendered before a row */
    rowSeparator?: (row: TData, index: number) => string | null | undefined;
    /** Optional separator cell class */
    rowSeparatorCellClass?: ClassValue;
    /** Render the table header outside the wrapper */
    separateHeader?: boolean;
    /** Apply frame-aware borders to the table body */
    tableBodyFramed?: boolean;
    /** Use fixed table layout with a shared colgroup */
    fixedLayout?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    enableRowSelection: false,
    enableMultiRowSelection: true,
    wrapper: 'div',
    headerWrapper: 'div',
    serverSide: true,
    separateHeader: false,
    tableBodyFramed: true,
    fixedLayout: false,
});

const emit = defineEmits<{
    'update:sorting': [sorting: SortingState];
    'update:columnFilters': [filters: ColumnFiltersState];
    'update:columnVisibility': [visibility: VisibilityState];
    'update:rowSelection': [selection: RowSelectionState];
}>();

const sorting = defineModel<SortingState>('sorting', { default: [] });
const columnFilters = defineModel<ColumnFiltersState>('columnFilters', { default: [] });
const columnVisibility = defineModel<VisibilityState>('columnVisibility', { default: {} });
const rowSelection = defineModel<RowSelectionState>('rowSelection', { default: {} });

const table = useVueTable({
    get data() {
        return props.data;
    },
    get columns() {
        return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: props.serverSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: props.serverSide ? undefined : getSortedRowModel(),
    getFilteredRowModel: props.serverSide ? undefined : getFilteredRowModel(),
    manualPagination: props.serverSide,
    manualSorting: props.serverSide,
    manualFiltering: props.serverSide,
    enableRowSelection: props.enableRowSelection,
    enableMultiRowSelection: props.enableMultiRowSelection,
    onSortingChange: (updaterOrValue) => {
        const value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue;
        sorting.value = value;
        emit('update:sorting', value);
    },
    onColumnFiltersChange: (updaterOrValue) => {
        const value = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue;
        columnFilters.value = value;
        emit('update:columnFilters', value);
    },
    onColumnVisibilityChange: (updaterOrValue) => {
        const value = typeof updaterOrValue === 'function' ? updaterOrValue(columnVisibility.value) : updaterOrValue;
        columnVisibility.value = value;
        emit('update:columnVisibility', value);
    },
    onRowSelectionChange: (updaterOrValue) => {
        const value = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelection.value) : updaterOrValue;
        rowSelection.value = value;
        emit('update:rowSelection', value);
    },
    state: {
        get sorting() {
            return sorting.value;
        },
        get columnFilters() {
            return columnFilters.value;
        },
        get columnVisibility() {
            return columnVisibility.value;
        },
        get rowSelection() {
            return rowSelection.value;
        },
    },
});

defineExpose({ table });
</script>
