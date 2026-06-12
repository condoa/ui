<template>
    <DialogDescription data-slot="dialog-description" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ description }}</slot>
    </DialogDescription>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogDescription } from 'reka-ui'
import type { DialogDescriptionProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends DialogDescriptionProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
    /** The description text */
    description?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'description')

const styles = tv({
    base: 'text-sm text-muted-foreground',
})
</script>
