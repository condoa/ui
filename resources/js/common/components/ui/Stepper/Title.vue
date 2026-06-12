<template>
    <StepperTitle
        v-bind="forwarded"
        data-slot="stepper-title"
        :class="styles({ class: props.class })"
    >
        <slot />
    </StepperTitle>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { StepperTitle, useForwardProps } from 'reka-ui'
import type { StepperTitleProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperTitleProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({ base: 'text-sm font-medium' })
</script>
