<template>
    <SelectItem data-slot="select-item" v-bind="forwarded" :value="stringValue" :class="styles({ class: props.class })">
        <span class="absolute right-2 flex size-3.5 items-center justify-center">
            <SelectItemIndicator :icon="icon" />
        </span>
        <SelectItemText>
            <slot>{{ text }}</slot>
        </SelectItemText>
    </SelectItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SelectItem, type SelectItemProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { computed } from 'vue'

interface Props extends Omit<SelectItemProps, 'value'> {
    /** The value of the item — coerced to string for reka-ui compatibility (null becomes a sentinel) */
    value: string | number | null
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** Icon to show */
    icon?: string
    /** Text to show */
    text?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon', 'text', 'value')

const NULL_SENTINEL = '__null__'

const stringValue = computed(() => (props.value === null ? NULL_SENTINEL : String(props.value)))

const styles = tv({
    base: "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
})
</script>
