<template>
    <div ref="root" data-slot="scrollspy" v-bind="$attrs" :class="(props.class as any)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { unrefElement, useEventListener, useMutationObserver, useThrottleFn } from '@vueuse/core'
import type { ClassValue } from 'tailwind-variants'
import { onMounted, ref, shallowRef, watch, type MaybeRefOrGetter } from 'vue'

type TargetLike = HTMLElement | Window | Document | null | undefined

interface Props {
    /** Optional scroll container (pass a ref to a scrollable element). Defaults to window. */
    target?: MaybeRefOrGetter<TargetLike>
    /** Default offset in px from the top when computing active section / scrolling. */
    offset?: number
    /** Smooth scrolling on anchor click. */
    smooth?: boolean
    /** Base data-* attribute, e.g. data-scrollspy-anchor. */
    dataAttribute?: string
    /** Reflect active id in URL hash. */
    history?: boolean
    /** Throttle time (ms) for scroll handler. */
    throttleTime?: number
    /** Optional callback on change (also emits 'change'). */
    onUpdate?: (id: string) => void
    /**
     * Custom class(es) to add to the scrollspy container.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    offset: 0,
    smooth: true,
    dataAttribute: 'scrollspy',
    history: true,
    throttleTime: 50,
})

const emit = defineEmits<(e: 'change', id: string) => void>()

const root = ref<HTMLDivElement | null>(null)
const anchors = shallowRef<Element[]>([])
const prevId = ref<string | null>(null)

const scroller = shallowRef<Window | HTMLElement>(window as any)

function resolveScroller() {
    const t = unrefElement(props.target as any)
    scroller.value = !t || t === document || t === window ? window : (t as HTMLElement)
}
onMounted(resolveScroller)
watch(() => unrefElement(props.target as any), resolveScroller, { immediate: true })

function queryAnchors() {
    anchors.value = root.value ? Array.from(root.value.querySelectorAll(`[data-${props.dataAttribute}-anchor]`)) : []
}
onMounted(queryAnchors)
useMutationObserver(root, queryAnchors, { childList: true, subtree: true })

function getScrollTop(se: Window | HTMLElement) {
    return se === window ? window.scrollY || document.documentElement.scrollTop : (se as HTMLElement).scrollTop
}
function getScrollHeight(se: Window | HTMLElement) {
    return se === window ? document.documentElement.scrollHeight : (se as HTMLElement).scrollHeight
}
function getClientHeight(se: Window | HTMLElement) {
    return se === window ? window.innerHeight : (se as HTMLElement).clientHeight
}

function sectionTopWithinScroller(sectionEl: HTMLElement): number {
    const se = scroller.value
    const rect = sectionEl.getBoundingClientRect()
    if (se === window) {
        return rect.top + (window.scrollY || document.documentElement.scrollTop)
    }
    const scRect = (se as HTMLElement).getBoundingClientRect()
    return rect.top - scRect.top + (se as HTMLElement).scrollTop
}

function setActive(sectionId: string | null, force = false) {
    if (!sectionId) {
        return
    }
    anchors.value.forEach((el) => {
        const id = el.getAttribute(`data-${props.dataAttribute}-anchor`)
        if (id === sectionId) {
            el.setAttribute('data-active', 'true')
        } else {
            el.removeAttribute('data-active')
        }
    })
    if (props.history && (force || prevId.value !== sectionId)) {
        window.history.replaceState({}, '', `#${sectionId}`)
    }
    if (prevId.value !== sectionId) {
        props.onUpdate?.(sectionId)
        emit('change', sectionId)
        prevId.value = sectionId
    }
}

function handleScroll() {
    if (!anchors.value.length) {
        return
    }
    const se = scroller.value
    const scrollTop = getScrollTop(se)
    let activeIdx = 0
    let minDelta = Number.POSITIVE_INFINITY
    anchors.value.forEach((anchor, idx) => {
        const sectionId = anchor.getAttribute(`data-${props.dataAttribute}-anchor`)
        if (!sectionId) {
            return
        }
        const sectionEl = document.getElementById(sectionId)
        if (!sectionEl) {
            return
        }
        let customOffset = props.offset
        const dataOffset = anchor.getAttribute(`data-${props.dataAttribute}-offset`)
        if (dataOffset) {
            customOffset = Number.parseInt(dataOffset, 10)
        }
        const top = sectionTopWithinScroller(sectionEl) - customOffset
        const delta = Math.abs(top - scrollTop)
        if (top <= scrollTop && delta < minDelta) {
            minDelta = delta
            activeIdx = idx
        }
    })
    const atBottom = scrollTop + getClientHeight(se) >= getScrollHeight(se) - 2
    if (atBottom) {
        activeIdx = anchors.value.length - 1
    }
    const activeAnchor = anchors.value[activeIdx]
    const sectionId = activeAnchor?.getAttribute(`data-${props.dataAttribute}-anchor`) || null
    setActive(sectionId)
    anchors.value.forEach((el, idx) => {
        if (idx !== activeIdx) {
            el.removeAttribute('data-active')
        }
    })
}

const onScroll = props.throttleTime ? useThrottleFn(handleScroll, props.throttleTime, true, false) : handleScroll

useEventListener(scroller, 'scroll', onScroll, { passive: true })

function scrollToAnchor(anchorEl: HTMLElement, ev?: Event) {
    if (ev) {
        ev.preventDefault()
    }
    const raw = anchorEl.getAttribute(`data-${props.dataAttribute}-anchor`) || ''
    const sectionId = raw.replace('#', '')
    if (!sectionId) {
        return
    }
    const sectionEl = document.getElementById(sectionId)
    if (!sectionEl) {
        return
    }
    const se = scroller.value
    let customOffset = props.offset
    const dataOffset = anchorEl.getAttribute(`data-${props.dataAttribute}-offset`)
    if (dataOffset) {
        customOffset = Number.parseInt(dataOffset, 10)
    }
    const top = sectionTopWithinScroller(sectionEl) - customOffset
    if ('scrollTo' in se) {
        ;(se as any).scrollTo({
            top,
            left: 0,
            behavior: props.smooth ? 'smooth' : 'auto',
        })
    } else {
        window.scrollTo({ top, left: 0, behavior: props.smooth ? 'smooth' : 'auto' })
    }
    setActive(sectionId, true)
}

watch(anchors, (list, _, onCleanup) => {
    const stops: Array<() => void> = []
    list.forEach((el) => {
        stops.push(useEventListener(el, 'click', (e) => scrollToAnchor(el as HTMLElement, e)))
    })
    onCleanup(() => stops.forEach((s) => s()))
})

onMounted(() => {
    setTimeout(() => {
        const raw = window.location.hash.replace('#', '')
        if (raw) {
            const target = root.value?.querySelector(
                `[data-${props.dataAttribute}-anchor="${raw}"]`,
            ) as HTMLElement | null
            if (target) scrollToAnchor(target)
        }
        setTimeout(() => onScroll(), 80)
    }, 80)
})
</script>
