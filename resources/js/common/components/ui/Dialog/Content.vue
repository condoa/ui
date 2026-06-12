<template>
    <DialogPortal :to="to">
        <DialogOverlay />
        <DialogViewport :bottom-stick-on-mobile="bottomStickOnMobile">
            <DialogContent
                data-slot="dialog-popup"
                :class="styles({ bottomStickOnMobile, class: props.class })"
                :style="nestedStyle"
                :data-nested-open="nestedCount > 0 || undefined"
                v-bind="{ ...forwarded, ...$attrs }"
            >
                <slot>
                    <slot name="header">
                        <DialogHeader>
                            <slot name="title">
                                <DialogTitle v-if="title" :title="title" />
                            </slot>
                            <slot name="description">
                                <DialogDescription v-if="description" :description="description" />
                            </slot>
                        </DialogHeader>
                    </slot>
                    <slot name="content" />
                    <slot name="footer" />
                </slot>
                <VisuallyHidden as-child>
                    <DialogDescription />
                </VisuallyHidden>
                <slot name="close" />
                <DialogClose v-if="showCloseButton" as-child>
                    <Button
                        variant="ghost"
                        size="icon"
                        class="absolute end-2 top-2"
                        aria-label="Close"
                    >
                        <Icon name="icon-close" class="size-4" />
                    </Button>
                </DialogClose>
            </DialogContent>
        </DialogViewport>
    </DialogPortal>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { DialogContent, VisuallyHidden, useForwardPropsEmits } from 'reka-ui'
import type { DialogContentEmits, DialogContentProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { computed, inject, ref } from 'vue'
import { dialogNestedCountKey } from './useDialogNesting'

defineOptions({ inheritAttrs: false })

interface Props extends DialogContentProps {
    /** Title text */
    title?: string
    /** Description text */
    description?: string
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Whether to show the close button */
    showCloseButton?: boolean
    /** Whether to stick to bottom on mobile */
    bottomStickOnMobile?: boolean
    /** Where to render the dialog */
    to?: string | HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
    showCloseButton: true,
    bottomStickOnMobile: true,
})

const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(
    reactiveOmit(props, 'title', 'description', 'class', 'showCloseButton', 'bottomStickOnMobile', 'to'),
    emits,
)

const nestedCount = inject(dialogNestedCountKey, ref(0))

const nestedStyle = computed(() => ({
    '--nested-dialogs': nestedCount.value,
}))

const styles = tv({
    base: [
        'pointer-events-auto relative row-start-1 flex max-h-full min-h-0 w-full min-w-0 flex-col rounded-md border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 outline-none will-change-transform',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-md)-1px)] before:shadow-[0_1px_var(--color-black)/4%] dark:before:shadow-[0_-1px_var(--color-white)/6%]',
        'transition-[scale,opacity,translate] duration-150 ease-out',
        '-translate-y-[calc(0.675rem*var(--nested-dialogs))] scale-[calc(1-0.1*var(--nested-dialogs))]',
        'data-[nested-open]:origin-top',
        'data-[state=closed]:scale-98 data-[state=closed]:opacity-0',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'md:max-w-lg',
    ],
    variants: {
        bottomStickOnMobile: {
            true: [
                'max-md:row-start-2 max-md:max-w-none max-md:rounded-b-none max-md:rounded-t-md max-md:border-x-0 max-md:border-b-0 max-md:border-t max-md:before:hidden max-md:before:rounded-none',
                'max-md:opacity-[calc(1-min(var(--nested-dialogs),1))]',
                'max-md:data-[state=closed]:translate-y-4 max-md:data-[state=closed]:slide-out-to-bottom-4',
                'max-md:data-[state=open]:translate-y-0 max-md:data-[state=open]:slide-in-from-bottom-4',
            ],
            false: 'max-w-[calc(100%-2rem)]',
        },
    },
    defaultVariants: {
        bottomStickOnMobile: true,
    },
})
</script>
