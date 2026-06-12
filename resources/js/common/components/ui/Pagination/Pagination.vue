<template>
    <PaginationRoot role="navigation" aria-label="pagination" data-slot="pagination" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <PaginationList v-slot="{ items }">
                <slot name="first"><PaginationFirst as-child :icon="firstIcon" /></slot>
                <slot name="prev"><PaginationPrev as-child :icon="prevIcon" /></slot>

                <template v-for="(page, index) in items" :key="index">
                    <PaginationItem v-if="page.type === 'page'" as-child v-bind="page" />
                    <PaginationEllipsis v-else-if="page.type === 'ellipsis'" as-child v-bind="page" :icon="ellipsisIcon" />
                </template>

                <slot name="next"><PaginationNext as-child :icon="nextIcon" /></slot>
                <slot name="last"><PaginationLast as-child :icon="lastIcon" /></slot>
            </PaginationList>
        </slot>
    </PaginationRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { useForwardPropsEmits } from 'reka-ui'
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PaginationRootProps {
    ellipsisIcon?: string
    firstIcon?: string
    lastIcon?: string
    nextIcon?: string
    prevIcon?: string
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    defaultPage: 1,
    total: 10,
    itemsPerPage: 10,
    siblingCount: 3,
    showEdges: true,
    ellipsisIcon: 'icon-ellipsis',
    firstIcon: 'icon-chevrons-left',
    lastIcon: 'icon-chevrons-right',
    nextIcon: 'icon-chevron-right',
    prevIcon: 'icon-chevron-left',
})

const emits = defineEmits<PaginationRootEmits>()

const forwarded = useForwardPropsEmits(
    reactiveOmit(props, 'ellipsisIcon', 'firstIcon', 'lastIcon', 'nextIcon', 'prevIcon'),
    emits,
)

const styles = tv({
    base: 'mx-auto flex w-full justify-center',
})
</script>
