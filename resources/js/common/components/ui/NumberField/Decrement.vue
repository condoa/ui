<template>
    <NumberFieldDecrement data-slot="number-field-decrement" aria-label="Decrease value" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon :name="props.icon" class="size-4"></Icon>
        </slot>
    </NumberFieldDecrement>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { NumberFieldDecrement, useForwardProps } from 'reka-ui'
import type { NumberFieldDecrementProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends NumberFieldDecrementProps {
    class?: ClassValue
    icon?: string
}

const props = withDefaults(defineProps<Props>(), { icon: 'icon-minus' })

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'flex h-full shrink-0 items-center justify-center bg-transparent p-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50',
})
</script>
