<template>
    <SelectScrollUpButton :class="styles({ class: props.class })" data-slot="select-scroll-up-button" v-bind="forwarded">
        <slot>
            <Icon :name="icon || 'icon-chevron-up'" class="size-4"></Icon>
        </slot>
    </SelectScrollUpButton>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectScrollUpButton } from 'reka-ui'
import type { SelectScrollUpButtonProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectScrollUpButtonProps {
    /** Icon to render */
    icon?: string
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'icon')

const styles = tv({
    base: 'flex cursor-default items-center justify-center py-1',
})
</script>
