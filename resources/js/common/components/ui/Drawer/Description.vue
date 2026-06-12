<template>
    <DrawerDescription
        data-slot="drawer-description"
        v-bind="props"
        :class="styles({ class: props.class })"
    >
        <slot>
            {{ props.text }}
        </slot>
    </DrawerDescription>
</template>

<script lang="ts" setup>
import { type ClassValue, tv } from 'tailwind-variants'
import { DrawerDescription } from 'vaul-vue'
import type { DrawerDescriptionProps } from 'vaul-vue'

interface Props extends DrawerDescriptionProps {
    /**
     * Custom class(es) to add to the parent.
     */
    class?: ClassValue
    /**
     * The text content of the description.
     */
    text?: string
}

const props = defineProps<Props>()

const styles = tv({ base: 'text-sm text-muted-foreground' })
</script>
