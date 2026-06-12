<template>
    <PaginationListItem data-slot="pagination-item" v-bind="props">
        <slot>
            <Button :variant :size class="tabular-nums data-[selected=true]:border-transparent! data-[selected=true]:bg-primary! data-[selected=true]:text-primary-foreground!">
                {{ value }}
            </Button>
        </slot>
    </PaginationListItem>
</template>

<script lang="ts" setup>
import type { ButtonProps } from '../Button.variants'
import type { PaginationListItemProps } from 'reka-ui'

interface Props extends PaginationListItemProps {
    /** The variant of the button */
    variant?: ButtonProps['variant']
    /** The size of the button */
    size?: ButtonProps['size']
}

const props = withDefaults(defineProps<Props>(), { variant: 'outline', size: 'icon-sm' })
</script>
