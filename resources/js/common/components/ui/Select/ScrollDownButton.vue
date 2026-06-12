<template>
    <SelectScrollDownButton data-slot="select-scroll-down-button" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>
            <Icon :name="icon || 'icon-chevron-down'" class="size-4"></Icon>
        </slot>
    </SelectScrollDownButton>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectScrollDownButton, type SelectScrollDownButtonProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectScrollDownButtonProps {
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
