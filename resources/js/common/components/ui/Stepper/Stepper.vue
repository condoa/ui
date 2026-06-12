<template>
    <StepperRoot
        v-slot="slotProps"
        data-slot="stepper"
        v-bind="forwarded"
        :class="styles({ class: props.class })"
    >
        <slot v-bind="slotProps" />
    </StepperRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { StepperRoot, useForwardPropsEmits } from 'reka-ui'
import type { StepperRootEmits, StepperRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperRootProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const emit = defineEmits<StepperRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emit)

const styles = tv({
    base: 'group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
})
</script>
