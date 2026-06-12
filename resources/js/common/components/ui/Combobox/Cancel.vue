<template>
    <ComboboxCancel data-slot="combobox-cancel" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon :name="icon" class="size-4 shrink-0" />
        </slot>
    </ComboboxCancel>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxCancel, type ComboboxCancelProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxCancelProps {
    class?: ClassValue
    icon?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'icon-x',
})

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent text-muted-foreground/60 opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
})
</script>
