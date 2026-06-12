<template>
    <DropdownMenuArrow data-slot="dropdown-menu-arrow" v-bind="forwarded" :class="styles({ class: props.class })"/>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuArrow, type DropdownMenuArrowProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DropdownMenuArrowProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { asChild: false, width: 10, height: 5 })

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'rotate-45 border bg-muted',
})
</script>
