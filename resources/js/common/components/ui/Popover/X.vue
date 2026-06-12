<template>
    <PopoverClose data-slot="popover-x" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon :name="icon" class="size-4" />
            <span class="sr-only">{{ srText }}</span>
        </slot>
    </PopoverClose>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import Icon from '@/common/components/Icon.vue'
import { PopoverClose, useForwardProps } from 'reka-ui'
import type { PopoverCloseProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends PopoverCloseProps {
    class?: ClassValue
    icon?: string
    srText?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'heroicons:x-mark',
    srText: 'Close',
})

const forwarded = useForwardProps(reactiveOmit(props, 'icon', 'srText', 'class'))

const styles = tv({
    base: 'absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
})
</script>
