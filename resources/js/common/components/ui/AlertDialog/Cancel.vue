<template>
    <AlertDialogCancel data-slot="alert-dialog-cancel" v-bind="forwarded" :class="buttonStyles({ variant, size, disabled, class: props.class })">
        <slot>{{ text }}</slot>
    </AlertDialogCancel>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { type ButtonProps, buttonStyles } from '../Button.variants'
import { AlertDialogCancel } from 'reka-ui'
import type { AlertDialogCancelProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'

interface Props extends AlertDialogCancelProps {
    /** Action to perform when the button is clicked */
    onClick?: () => void
    /** Text to display in the button */
    text?: string
    /** Custom class(es) to add to the button */
    class?: ClassValue
    /** Whether the button is disabled */
    disabled?: boolean
    /** The button's visual variant */
    variant?: ButtonProps['variant']
    /** The button's visual size */
    size?: ButtonProps['size']
}

const props = withDefaults(defineProps<Props>(), {
    text: 'Cancel',
    variant: 'outline',
    size: 'sm',
})

const forwarded = reactiveOmit(props, 'class', 'text', 'variant', 'size')
</script>
