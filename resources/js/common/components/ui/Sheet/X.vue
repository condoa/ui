<template>
    <DialogClose data-slot="sheet-close-x" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>
            <Icon :name="icon" class="size-4" />
            <span class="sr-only">{{ srText }}</span>
        </slot>
    </DialogClose>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { DialogClose } from 'reka-ui'
import type { DialogCloseProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends DialogCloseProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    /** Icon to display */
    icon?: string
    /** Screen reader text */
    srText?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'icon-close',
    srText: 'Close',
})

const forwarded = reactiveOmit(props, 'class', 'icon', 'srText')

const styles = tv({
    base: 'absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary',
})
</script>
