<template>
    <SliderRoot data-slot="slider" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot :props="props">
            <slot name="track" :props="props">
                <SliderTrack>
                    <slot name="range" :props="props">
                        <SliderRange />
                    </slot>
                </SliderTrack>
            </slot>
            <slot name="thumb" :props="props">
                <template v-if="showTooltip">
                    <TooltipProvider v-for="(_, key) in modelValue?.length" :key="key">
                        <Tooltip :open="showTooltipState">
                            <TooltipTrigger as-child>
                                <SliderThumb
                                    as="span"
                                    class="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow] outline-none hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50"
                                    data-slot="slider-thumb"
                                    @pointerdown="handlePointerDown"
                                />
                            </TooltipTrigger>
                            <TooltipContent
                                :side-offset="8"
                                :side="props.orientation === 'vertical' ? 'right' : 'top'"
                                class="px-2 py-1 text-xs"
                            >
                                {{ modelValue?.[key] }}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </template>
                <template v-else>
                    <SliderThumb v-for="(t, i) in modelValue?.length" :key="i" />
                </template>
            </slot>
        </slot>
    </SliderRoot>
</template>
<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SliderRoot, useForwardPropsEmits } from 'reka-ui'
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { onMounted, onUnmounted, ref } from 'vue'

interface Props extends SliderRootProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    min: 0,
    step: 1,
    max: 100,
    modelValue: () => [0],
    minStepsBetweenThumbs: 1,
})

const emits = defineEmits<SliderRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
})

const showTooltipState = ref(false)

const handlePointerDown = () => {
    if (props.showTooltip) {
        showTooltipState.value = true
    }
}

const handlePointerUp = () => {
    if (props.showTooltip) {
        showTooltipState.value = false
    }
}

onMounted(() => {
    if (props.showTooltip) {
        document.addEventListener('pointerup', handlePointerUp)
    }
})

onUnmounted(() => {
    if (props.showTooltip) {
        document.removeEventListener('pointerup', handlePointerUp)
    }
})
</script>
