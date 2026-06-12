<template>
    <Primitive :data-completed="timelineData?.model?.value != null && step <= timelineData.model.value ? '' : undefined" :data-step="step" data-slot="timeline-item" aria-hidden="true" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { type TimelineData, timelineDataSymbol } from './useTimeline'
import { tv, type ClassValue } from 'tailwind-variants'

const timelineData = inject<TimelineData>(timelineDataSymbol)

interface Props extends PrimitiveProps {
    class?: ClassValue
    step: number
}

const props = defineProps<Props>()

const forwarded = useForwardProps(reactiveOmit(props, ['class', 'step']))

const styles = tv({
    base: 'group/timeline-item relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-12 has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary',
})
</script>
