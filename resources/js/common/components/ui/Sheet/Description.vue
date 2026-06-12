<template>
    <DialogDescription data-slot="sheet-description" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>{{ description }}</slot>
    </DialogDescription>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends DialogDescriptionProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    /** Description text */
    description?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'description')

const styles = tv({
    base: 'text-sm text-muted-foreground',
})
</script>
