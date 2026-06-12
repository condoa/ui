<template>
    <DropdownMenuPortal :to="to">
        <DropdownMenuSubContent data-slot="dropdown-menu-sub-content" v-bind="{ ...forwarded, ...$attrs }" :class="styles({ class: props.class })">
            <slot />
        </DropdownMenuSubContent>
    </DropdownMenuPortal>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuSubContent, useForwardPropsEmits } from 'reka-ui'
import type { DropdownMenuSubContentEmits, DropdownMenuSubContentProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props extends DropdownMenuSubContentProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The element to render the portal into */
    to?: string | HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
    loop: true,
    sideOffset: 0,
    alignOffset: -5,
    avoidCollisions: true,
    collisionPadding: 5,
    sticky: 'partial',
})

const emits = defineEmits<DropdownMenuSubContentEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'to'), emits)

const styles = tv({
    base: 'relative z-50 flex min-w-32 origin-(--reka-dropdown-menu-content-transform-origin) flex-col rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_var(--color-black)/4%] dark:before:shadow-[0_-1px_var(--color-white)/6%] data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
})
</script>
