<template>
    <Input
        v-model="model"
        data-slot="sidebar-input"
        data-sidebar="input"
        :class="sideBarControlStyles({ class: props.class })"
        input-class="h-8"
    >
        <slot />
    </Input>
</template>

<script setup lang="ts">
import { type ClassValue, tv } from 'tailwind-variants'

const sideBarControlStyles = tv({
    base: 'bg-background shadow-none',
})

interface Props {
    /**
     * Additional classes to apply to the parent element.
     */
    class?: ClassValue
}

const props = defineProps<Props>()

const model = defineModel<string>()
</script>
