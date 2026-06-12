<template>
    <PaginationFirst data-slot="pagination-first" aria-label="Go to the first page" v-bind="forwarded">
        <slot>
            <Button v-if="icon" :variant :size>
                <Icon :name="icon"></Icon>
            </Button>
        </slot>
    </PaginationFirst>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import type { ButtonProps } from '../Button.variants'
import { PaginationFirst, type PaginationFirstProps } from 'reka-ui'

interface Props extends PaginationFirstProps {
    /** Icon to show */
    icon?: string
    /** The variant of the button */
    variant?: ButtonProps['variant']
    /** The size of the button */
    size?: ButtonProps['size']
}

const props = withDefaults(defineProps<Props>(), { variant: 'ghost', size: 'icon-sm' })

const forwarded = reactiveOmit(props, 'icon', 'variant', 'size')
</script>
