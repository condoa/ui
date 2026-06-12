<template>
    <ScrollAreaRoot data-slot="scroll-area" v-bind="forwarded" :class="styles({ class: props.class })">
        <ScrollAreaViewport
            ref="viewportRef"
            data-slot="scroll-area-viewport"
            :class="viewportStyles({ class: viewportClass })"
            :data-axis="orientation === 'horizontal' ? 'x' : 'y'"
            :data-fade-start="fade && fadeStart ? '' : undefined"
            :data-fade-end="fade && fadeEnd ? '' : undefined"
            :style="maskSize ? { '--mask-size': maskSize } : undefined"
            @scroll.passive="updateFade"
        >
            <slot />
        </ScrollAreaViewport>
        <ScrollAreaScrollbar :orientation="orientation" />
        <ScrollAreaCorner />
    </ScrollAreaRoot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ScrollAreaRoot } from 'reka-ui'
import type { ScrollAreaRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends ScrollAreaRootProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Orientation for scrolling */
    orientation?: 'vertical' | 'horizontal'
    /** Custom class(es) for the inner viewport */
    viewportClass?: ClassValue
    /** Whether to apply the edge fade mask */
    fade?: boolean
    /** Override the fade size (CSS length, default 2rem) */
    maskSize?: string
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'vertical',
    fade: true,
})

const forwarded = reactiveOmit(props, 'class', 'viewportClass', 'fade', 'maskSize')

const viewportRef = ref<any>(null)
const fadeStart = ref(false)
const fadeEnd = ref(false)

function getEl(): HTMLElement | undefined {
    const r = viewportRef.value
    if (!r) return undefined
    const ve = r.viewportElement
    if (ve instanceof HTMLElement) return ve
    if (ve?.value instanceof HTMLElement) return ve.value
    if (r.$el instanceof HTMLElement) return r.$el
    return undefined
}

function updateFade() {
    const el = getEl()
    if (!el) return
    if (props.orientation === 'horizontal') {
        fadeStart.value = el.scrollLeft > 1
        fadeEnd.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    } else {
        fadeStart.value = el.scrollTop > 1
        fadeEnd.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1
    }
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
    nextTick(() => {
        updateFade()
        const el = getEl()
        if (!el) return
        resizeObserver = new ResizeObserver(updateFade)
        resizeObserver.observe(el)
        for (const child of Array.from(el.children)) {
            resizeObserver.observe(child)
        }
    })
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})

const styles = tv({
    base: 'relative',
})

const viewportStyles = tv({
    base: 'scroll-fade size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1',
})
</script>
