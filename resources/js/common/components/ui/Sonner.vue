<template>
    <Toaster
        data-slot="toast-provider"
        :position="isMobile ? 'top-center' : 'bottom-center'"
        :visible-toasts="5"
        :expand="false"
        :swipe-directions="[]"
        close-button
        :duration="10000"
        :theme="resolvedTheme"
        :icons="toastIcons"
        :style="{
            '--normal-bg': 'var(--color-popover)',
            '--normal-text': 'var(--color-popover-foreground)',
            '--normal-border': 'var(--color-border)',
            '--success-bg': 'var(--color-popover)',
            '--success-text': 'var(--color-popover-foreground)',
            '--success-border': 'var(--color-border)',
            '--error-bg': 'var(--color-popover)',
            '--error-text': 'var(--color-popover-foreground)',
            '--error-border': 'var(--color-border)',
            '--warning-bg': 'var(--color-popover)',
            '--warning-text': 'var(--color-popover-foreground)',
            '--warning-border': 'var(--color-border)',
            '--info-bg': 'var(--color-popover)',
            '--info-text': 'var(--color-popover-foreground)',
            '--info-border': 'var(--color-border)',
        }"
        :toast-options="{
            class: '!items-center !font-sans',
            classes: {
                icon: '[&_svg]:size-4',
                toast: 'group toast !rounded-lg !shadow-lg !bg-popover !w-[var(--width)] !max-w-[600px]',
                title: '!font-medium',
                description: '!text-muted-foreground !font-[300]',
                actionButton: '!bg-foreground !text-background !text-xs !font-medium !h-7 !px-3 !rounded-md !border-0 !ml-auto !shrink-0',
                cancelButton: '!bg-muted !text-muted-foreground',
                closeButton:
                    '!bg-popover !text-muted-foreground !border-border hover:!opacity-100 !opacity-70',
                success: '[&_[data-icon]_svg]:!text-success',
                error: '[&_[data-icon]_svg]:!text-destructive',
                warning: '[&_[data-icon]_svg]:!text-warning',
                info: '[&_[data-icon]_svg]:!text-info',
                loading: '[&_[data-icon]_svg]:!opacity-80',
            },
        }"
    />
</template>

<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import { useMediaQuery } from '@vueuse/core'
import { computed, defineComponent, h } from 'vue'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const props = defineProps<{
    /**
     * Force a toast theme. When omitted the theme follows the `dark` class on the
     * document element (the same signal the app's theme store toggles), so toasts
     * track light/dark without a store dependency.
     */
    theme?: 'light' | 'dark' | 'system'
}>()

const isMobile = useMediaQuery('(max-width: 767px)')

const resolvedTheme = computed(() => {
    if (props.theme) {
        return props.theme
    }
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    return isDark ? 'dark' : 'light'
})

const createIcon = (iconName: string) =>
    defineComponent({
        render() {
            return h(Icon, { name: iconName, class: 'size-4' })
        },
    })

const toastIcons = {
    success: createIcon('icon-circle-check'),
    error: createIcon('icon-circle-alert'),
    warning: createIcon('icon-triangle-alert'),
    info: createIcon('icon-circle-info'),
    loading: createIcon('icon-loading'),
}
</script>

<style>
/* Place toasts behind dialog/alert-dialog overlays so they appear under the backdrop blur */
body:has([data-slot="dialog-overlay"][data-state="open"]) [data-sonner-toaster],
body:has([data-slot="alert-dialog-backdrop"][data-state="open"]) [data-sonner-toaster] {
    z-index: 49 !important;
}

[data-sonner-toaster] {
    --width: 600px !important;
}

/* Hide close button on non-front toasts when stacked */
[data-sonner-toast][data-front="false"][data-expanded="false"] [data-close-button] {
    display: none;
}

/* Ensure back toasts have opaque background when expanding */
[data-sonner-toast] {
    background: var(--color-popover) !important;
}

</style>
