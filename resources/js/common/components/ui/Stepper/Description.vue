<template>
    <StepperDescription
        v-slot="slotProps"
        data-slot="stepper-description"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    >
        <slot v-bind="slotProps" />
    </StepperDescription>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { StepperDescription, useForwardProps } from 'reka-ui'
import type { StepperDescriptionProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperDescriptionProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class'))

const styles = tv({ base: 'text-sm text-muted-foreground' })
</script>
