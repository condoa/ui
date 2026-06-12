<template>
    <nav data-slot="data-table-pagination" class="flex flex-col gap-4 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-1 text-sm text-muted-foreground">
            <template v-if="table.getFilteredSelectedRowModel().rows.length > 0">
                {{ table.getFilteredSelectedRowModel().rows.length }} de {{ meta.total }} selecionado(s)
            </template>
            <template v-else>
                Total <span class="font-semibold text-foreground">{{ meta.total }}</span>
            </template>
        </div>

        <div class="flex items-center gap-4 sm:gap-6 lg:gap-8">
            <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">Por página</span>
                <Select :model-value="meta.per_page" @update:model-value="onPerPageChange">
                    <SelectTrigger class="h-8 w-[70px]">
                        <SelectValue :placeholder="String(meta.per_page)" />
                    </SelectTrigger>
                    <SelectContent side="top">
                        <SelectItem v-for="pageSize in pageSizeOptions" :key="pageSize" :value="pageSize">
                            {{ pageSize }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-sm text-muted-foreground">
                    Página {{ meta.current_page }} de {{ meta.last_page }}
                </span>
            </div>

            <div class="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon-sm"
                    :disabled="meta.current_page <= 1"
                    @click="goToPage(1)"
                >
                    <Icon name="icon-chevrons-left" class="size-4" />
                    <span class="sr-only">Primeira página</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    :disabled="meta.current_page <= 1"
                    @click="goToPage(meta.current_page - 1)"
                >
                    <Icon name="icon-chevron-left" class="size-4" />
                    <span class="sr-only">Página anterior</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    :disabled="meta.current_page >= meta.last_page"
                    @click="goToPage(meta.current_page + 1)"
                >
                    <Icon name="icon-chevron-right" class="size-4" />
                    <span class="sr-only">Próxima página</span>
                </Button>
                <Button
                    variant="outline"
                    size="icon-sm"
                    :disabled="meta.current_page >= meta.last_page"
                    @click="goToPage(meta.last_page)"
                >
                    <Icon name="icon-chevrons-right" class="size-4" />
                    <span class="sr-only">Última página</span>
                </Button>
            </div>
        </div>
    </nav>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import type { Table } from '@tanstack/vue-table'
import { router } from '@inertiajs/vue3'

interface PaginationMeta {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
    links: Array<{
        url: string | null
        label: string
        active: boolean
    }>
}

interface Props {
    table: Table<unknown>
    meta: PaginationMeta
    pageSizeOptions?: number[]
    preserveScroll?: boolean
    preserveState?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    pageSizeOptions: () => [10, 20, 30, 50, 100],
    preserveScroll: true,
    preserveState: true,
})

const goToPage = (page: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', String(page))

    router.get(url.toString(), {}, {
        preserveScroll: props.preserveScroll,
        preserveState: props.preserveState,
        replace: true,
    })
}

const onPerPageChange = (value: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set('per_page', String(value))
    url.searchParams.set('page', '1')

    router.get(url.toString(), {}, {
        preserveScroll: props.preserveScroll,
        preserveState: props.preserveState,
        replace: true,
    })
}
</script>
