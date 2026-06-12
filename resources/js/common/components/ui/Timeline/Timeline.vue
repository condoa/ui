<template>
    <Primitive :data-orientation="orientation" data-slot="timeline" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { provide } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Primitive, useForwardProps } from 'reka-ui'
import { type TimelineData, type TimelineProps, timelineDataSymbol } from './useTimeline'
import { tv } from 'tailwind-variants'

const model = defineModel<number | undefined>({ default: 1 })

const props = withDefaults(defineProps<TimelineProps>(), {
    orientation: 'vertical',
})

provide<TimelineData>(timelineDataSymbol, {
    model,
    orientation: props.orientation,
})

const forwarded = useForwardProps(reactiveOmit(props, ['modelValue', 'class', 'orientation']))

const styles = tv({
    base: 'group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
})
</script>
