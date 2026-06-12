<template>
    <StepperIndicator v-slot="{ step }" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot :step>
            <span class="transition-all group-data-loading/step:scale-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none group-data-[state=completed]/step:scale-0 group-data-[state=completed]/step:opacity-0">
                {{ step }}
            </span>
            <Icon
                name="icon-check"
                class="absolute size-4 scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
                aria-hidden="true"
            />
            <span
                v-if="isLoading"
                class="absolute opacity-0 transition-all group-data-[state=active]/step:opacity-100 group-data-[state=active]/step:transition-none"
            >
                <Icon name="icon-loading" class="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            </span>
        </slot>
    </StepperIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { StepperIndicator, useForwardProps } from 'reka-ui'
import type { StepperIndicatorProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends StepperIndicatorProps {
    class?: ClassValue
    isLoading?: boolean
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, 'class', 'isLoading'))

const styles = tv({
    base: 'relative flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground group-data-[state=active]/step:bg-primary group-data-[state=active]/step:text-primary-foreground group-data-[state=completed]/step:bg-primary group-data-[state=completed]/step:text-primary-foreground',
})
</script>
