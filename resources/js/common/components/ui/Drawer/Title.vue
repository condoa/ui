<template>
    <DrawerTitle data-slot="drawer-title" v-bind="props" :class="styles({ class: props.class })">
        <slot>
            {{ props.text }}
        </slot>
    </DrawerTitle>
</template>

<script lang="ts" setup>
import { type ClassValue, tv } from 'tailwind-variants'
import { DrawerTitle } from 'vaul-vue'
import type { DrawerTitleProps } from 'vaul-vue'

interface Props extends DrawerTitleProps {
    /**
     * Custom class(es) to add to the parent.
     */
    class?: ClassValue
    /**
     * The text content of the title.
     */
    text?: string
}

const props = defineProps<Props>()

const styles = tv({
    base: 'text-lg leading-none font-semibold tracking-tight',
})
</script>
