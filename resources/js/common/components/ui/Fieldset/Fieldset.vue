<template>
    <fieldset :class="styles({ class: props.class })" :disabled="disabled" data-slot="fieldset" v-bind="$attrs">
        <slot />
    </fieldset>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props {
    /** Custom class(es) to add to the fieldset */
    class?: ClassValue

    /** Whether the fieldset is disabled */
    disabled?: boolean
}

const props = defineProps<Props>()

const styles = tv({
    base: 'flex flex-col gap-4',
})
</script>
