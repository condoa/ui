<template>
    <StepperSeparator
        data-slot="stepper-separator"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    >
        <slot />
    </StepperSeparator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { StepperSeparator, useForwardProps } from 'reka-ui'
import type { StepperSeparatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperSeparatorProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({
    base: 'm-0.5 bg-muted group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=vertical]/stepper:w-0.5 group-data-[state=completed]/step:bg-primary',
})
</script>
