<template>
    <div v-if="column.getCanSort()" class="flex items-center gap-2">
        <Button
            variant="ghost"
            size="sm"
            class="-ml-3 h-8 data-[state=open]:bg-accent"
            @click="toggleSorting"
        >
            <span>{{ title }}</span>
            <Icon
                v-if="column.getIsSorted() === 'desc'"
                name="icon-arrow-down"
                class="ml-2 size-4"
            />
            <Icon
                v-else-if="column.getIsSorted() === 'asc'"
                name="icon-arrow-up"
                class="ml-2 size-4"
            />
            <Icon
                v-else
                name="icon-chevrons-up-down"
                class="ml-2 size-4 opacity-50"
            />
        </Button>
    </div>
    <span v-else>{{ title }}</span>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import type { Column } from '@tanstack/vue-table'
import { router } from '@inertiajs/vue3'

interface Props {
    column: Column<unknown, unknown>
    title: string
    serverSide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    serverSide: true,
})

const toggleSorting = () => {
    if (props.serverSide) {
        const url = new URL(window.location.href)
        const currentSort = props.column.getIsSorted()

        if (currentSort === false) {
            url.searchParams.set('sort', props.column.id)
            url.searchParams.set('direction', 'asc')
        } else if (currentSort === 'asc') {
            url.searchParams.set('sort', props.column.id)
            url.searchParams.set('direction', 'desc')
        } else {
            url.searchParams.delete('sort')
            url.searchParams.delete('direction')
        }

        router.get(url.toString(), {}, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        })
    } else {
        props.column.toggleSorting()
    }
}
</script>
