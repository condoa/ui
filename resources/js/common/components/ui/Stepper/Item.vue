<template>
    <StepperItem
        v-slot="slotProps"
        data-slot="stepper-item"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    >
        <slot v-bind="slotProps" />
    </StepperItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { StepperItem, useForwardProps } from 'reka-ui'
import type { StepperItemProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperItemProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col',
})
</script>
