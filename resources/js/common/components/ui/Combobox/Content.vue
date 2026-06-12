<template>
    <ComboboxPortal :to="to">
        <ComboboxContent data-slot="combobox-content" v-bind="{ ...forwarded, ...$attrs }" :class="styles({ class: props.class })">
            <ComboboxViewport class="max-h-[min(var(--reka-combobox-content-available-height,23rem),23rem)] scroll-py-1 p-1">
                <slot />
            </ComboboxViewport>
        </ComboboxContent>
    </ComboboxPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ComboboxContent, ComboboxPortal, ComboboxViewport, useForwardPropsEmits } from 'reka-ui'
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props extends ComboboxContentProps {
    to?: string | HTMLElement
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    position: 'popper',
    side: 'bottom',
    sideOffset: 4,
    align: 'start',
})

const emits = defineEmits<ComboboxContentEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'to'), emits)

const styles = tv({
    base: 'z-50 w-(--reka-combobox-trigger-width) min-w-[8rem] origin-(--reka-combobox-content-transform-origin) select-none overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg/5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
})
</script>
