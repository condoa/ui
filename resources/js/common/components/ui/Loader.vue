<template>
    <AnimatePresence>
        <motion.div v-if="fullPage && open" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0, scale: 0.95 }" :transition="{ duration: prefersReducedMotion ? 0 : undefined }" :class="loaderStyles().backdrop({ class: backdropClass, fullPage })">
            <Icon :class="loaderStyles().icon({ class: props.class })" :name="props.icon" aria-hidden="true" />
            <slot :open>{{ text }}</slot>
        </motion.div>
        <motion.div v-if="!fullPage && open" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: prefersReducedMotion ? 0 : undefined }" :class="loaderStyles().backdrop({ class: props.backdropClass, fullPage })">
            <Icon :class="loaderStyles().icon({ class: props.class })" :name="props.icon" aria-hidden="true" />
            <slot :open>{{ text }}</slot>
        </motion.div>
    </AnimatePresence>
</template>

<script lang="ts" setup>
import { useMagicKeys, usePreferredReducedMotion } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { AnimatePresence, motion } from 'motion-v'
import { useBodyScrollLock } from 'reka-ui'
import type { PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { computed, watchEffect } from 'vue'

type LoaderProps = PrimitiveProps & {
    /**
     * The icon to display in the loader.
     *
     * @default "icon-loader"
     */
    icon?: string
    /**
     * The class to apply to the loader Icon
     */
    class?: ClassValue
    /**
     * The class to apply to the backdrop
     */
    backdropClass?: ClassValue
    /**
     * Whether the loader should take up the full page.
     *
     * When this is `true`, the loader will be displayed in a fixed position that covers the entire page. You can press the `esc` key to close the loader.
     */
    fullPage?: boolean
    /**
     * Whether to lock the scroll when the loader is open.
     *
     * @default true
     */
    lockScroll?: boolean
    /**
     * The role of the component.
     *
     * @default "progressbar"
     */
    role?: string
    /**
     * The text to display in the loader.
     *
     * This is displayed below the loader icon.
     */
    text?: string
    /**
     * Whether to close the loader when the `esc` key is pressed.
     *
     * @default true
     */
    closeOnEscape?: boolean
}

const loaderStyles = tv({
    slots: {
        icon: 'size-10 text-accent-foreground',
        backdrop: 'flex flex-col items-center justify-center gap-3',
    },
    variants: {
        fullPage: {
            true: {
                backdrop: 'pointer-events-auto fixed inset-0 z-[999] size-full bg-background/80 backdrop-blur-md',
            },
            false: {
                backdrop: 'relative',
            },
        },
    },
})

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<LoaderProps>(), {
    icon: 'icon-loader',
    role: 'progressbar',
    closeOnEscape: true,
})

const open = defineModel<boolean>({ default: true })
const isLocked = useBodyScrollLock()

const reducedMotionPreference = usePreferredReducedMotion()
const prefersReducedMotion = computed(() => reducedMotionPreference.value === 'reduce')

// biome-ignore lint/suspicious/noShadowRestrictedNames: Escape is the name of the key
const { escape } = useMagicKeys()

watchEffect(() => {
    if (props.fullPage && open.value && escape?.value && props.closeOnEscape) {
        open.value = false
    }
    if (props.lockScroll && !open.value) {
        isLocked.value = false
    }
    if (props.lockScroll && open.value) {
        isLocked.value = true
    }
})
</script>
