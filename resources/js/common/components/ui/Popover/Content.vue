<template>
    <PopoverPortal :to="to">
        <PopoverContent
            data-slot="popover-content"
            v-bind="{ ...forwarded, ...$attrs }"
            :class="styles({ class: props.class })"
        >
            <slot />
        </PopoverContent>
    </PopoverPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { PopoverContent, useForwardPropsEmits } from 'reka-ui'
import type { PopoverContentEmits, PopoverContentProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props extends PopoverContentProps {
    to?: string | HTMLElement
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    side: 'bottom',
    sideOffset: 4,
    align: 'center',
    avoidCollisions: true,
    collisionPadding: 0,
    sticky: 'partial',
})

const emits = defineEmits<PopoverContentEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'to', 'class'), emits)

const styles = tv({
    base: 'z-50 w-72 origin-(--reka-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
})
</script>
