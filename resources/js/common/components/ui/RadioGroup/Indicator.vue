<template>
    <RadioGroupIndicator data-slot="radio-group-indicator" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon aria-hidden="true" :name="icon || 'icon-circle'" class="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary fill-primary stroke-primary"></Icon>
        </slot>
    </RadioGroupIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { RadioGroupIndicator, type RadioGroupIndicatorProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends RadioGroupIndicatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Icon to show */
    icon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'relative flex items-center justify-center',
})
</script>
