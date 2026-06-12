<template>
    <PaginationEllipsis data-slot="pagination-ellipsis" v-bind="forwarded">
        <slot>
            <div v-if="icon" class="flex size-9 items-center justify-center hover:bg-transparent">
                <Icon aria-hidden="true" :name="icon"></Icon>
            </div>
        </slot>
    </PaginationEllipsis>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { PaginationEllipsis, type PaginationEllipsisProps } from 'reka-ui'

interface Props extends PaginationEllipsisProps {
    icon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'icon')
</script>
