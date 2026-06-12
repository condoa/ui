<template>
    <p :id="formDescriptionId" :class="styles({ class: props.class })" v-bind="$attrs">
        <slot><p v-html="description" /></slot>
    </p>
</template>

<script lang="ts" setup>
import { tv, type ClassValue } from 'tailwind-variants'
import { useFormField } from './useFormField'

defineOptions({
    inheritAttrs: false,
})

const { formDescriptionId } = useFormField()

interface Props {
    class?: ClassValue
    /**
     * @security Rendered as raw HTML via `v-html`. Pass only trusted, static, or
     * pre-sanitized markup. For user-supplied text use the default slot, whose
     * content is not interpreted as HTML.
     */
    description?: string
}

const props = defineProps<Props>()

const styles = tv({
    base: 'text-sm text-muted-foreground',
})
</script>
