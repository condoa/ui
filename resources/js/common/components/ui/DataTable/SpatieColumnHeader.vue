<template>
    <div v-if="sortable" class="flex items-center gap-2">
        <Button
            variant="ghost"
            size="sm"
            class="-ml-3 h-8 data-[state=open]:bg-accent"
            @click="onSort"
        >
            <span>{{ title }}</span>
            <Icon
                v-if="sortDirection === 'desc'"
                name="icon-arrow-down"
                class="ml-2 size-4"
            />
            <Icon
                v-else-if="sortDirection === 'asc'"
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
import { computed } from 'vue'
import Icon from '@/common/components/Icon.vue'
import { router, usePage } from '@inertiajs/vue3'

interface Props {
    /** Column ID for sorting */
    columnId: string
    /** Display title */
    title: string
    /** Whether column is sortable */
    sortable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    sortable: true,
})

const page = usePage()

// Get current sort from URL (reactive via usePage)
const sortDirection = computed((): 'asc' | 'desc' | false => {
    const url = new URL(page.url, window.location.origin)
    const sort = url.searchParams.get('sort')

    if (!sort) return false

    const desc = sort.startsWith('-')
    const id = desc ? sort.slice(1) : sort

    if (id !== props.columnId) return false

    return desc ? 'desc' : 'asc'
})

const onSort = () => {
    const url = new URL(page.url, window.location.origin)
    const currentDirection = sortDirection.value

    if (currentDirection === false) {
        // No sort -> ascending
        url.searchParams.set('sort', props.columnId)
    } else if (currentDirection === 'asc') {
        // Ascending -> descending
        url.searchParams.set('sort', `-${props.columnId}`)
    } else {
        // Descending -> no sort
        url.searchParams.delete('sort')
    }

    router.get(url.toString(), {}, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    })
}
</script>
