<template>
    <legend :class="styles({ class: props.class })" data-slot="fieldset-legend">
        <slot />
    </legend>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    /** Custom class(es) to add to the legend */
    class?: ClassValue
}

const props = defineProps<Props>()

const styles = tv({
    base: 'text-sm leading-none font-semibold',
})
</script>
