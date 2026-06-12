<template>
    <PaginationNext data-slot="pagination-next" aria-label="Go to next page" v-bind="forwarded">
        <slot>
            <Button v-if="icon" :variant :size>
                <Icon :name="icon"></Icon>
            </Button>
        </slot>
    </PaginationNext>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import type { ButtonProps } from '../Button.variants'
import { PaginationNext, type PaginationNextProps } from 'reka-ui'

interface Props extends PaginationNextProps {
    /** Icon to show */
    icon?: string
    /** The variant of the button */
    variant?: ButtonProps['variant']
    /** The size of the button */
    size?: ButtonProps['size']
}

const props = withDefaults(defineProps<Props>(), { variant: 'ghost', size: 'icon-sm' })

const forwarded = reactiveOmit(props, 'icon')
</script>
