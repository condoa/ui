<template>
    <ComboboxItem data-slot="combobox-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <ComboboxItemIndicator class="col-start-1 flex items-center justify-center">
            <Icon :name="icon" class="size-4" />
        </ComboboxItemIndicator>
        <span class="col-start-2">
            <slot>{{ textValue }}</slot>
        </span>
    </ComboboxItem>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxItem, ComboboxItemIndicator, type ComboboxItemProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ComboboxItemProps {
    class?: ClassValue
    icon?: string
}

const props = withDefaults(defineProps<Props>(), {
    icon: 'icon-check',
})

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: "grid min-h-7 w-full cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-sm py-1 ps-2 pe-4 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
})
</script>
