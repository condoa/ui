<template>
    <Label :class="styles({ error: Boolean(error), class: props.class })" :for="formItemId" v-bind="$attrs">
        <slot>{{ label }} <span class="ml-auto font-normal text-muted-foreground/80">{{ hint }}</span></slot>
    </Label>
</template>

<script lang="ts" setup>
import type { LabelProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'
import { useFormField } from './useFormField'

defineOptions({ inheritAttrs: false })

interface Props extends LabelProps {
    class?: ClassValue
    label?: string
    hint?: string
}

const props = defineProps<Props>()

const { error, formItemId } = useFormField()

const styles = tv({
    base: 'flex w-full items-center justify-between text-left text-sm font-medium tracking-tight text-foreground hover:cursor-pointer',
    variants: {
        error: {
            true: 'text-destructive',
        },
    },
})
</script>
