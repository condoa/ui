<template>
    <SelectIcon data-slot="select-icon" v-bind="forwarded" class="flex items-center justify-center">
        <slot>
            <Icon :class="styles({ class: props.class })" :name="icon || 'icon-chevrons-up-down'"></Icon>
        </slot>
    </SelectIcon>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectIcon, useForwardProps } from 'reka-ui'
import type { SelectIconProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends SelectIconProps {
    /** Icon to render */
    icon?: string
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'size-4 shrink-0 text-muted-foreground',
})
</script>
