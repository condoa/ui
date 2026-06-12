<template>
    <AlertDialogAction
        data-slot="alert-dialog-action"
        v-bind="forwarded"
        :class="buttonStyles({ variant, size, disabled, class: props.class })"
        @click.capture="handleClickCapture"
    >
        <slot>{{ text }} </slot>
    </AlertDialogAction>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { type ButtonProps, buttonStyles } from '../Button.variants'
import { AlertDialogAction } from 'reka-ui'
import type { AlertDialogActionProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'

interface Props extends AlertDialogActionProps {
    /**
     * Action to perform when the button is clicked.
     * Bound in the capture phase so it runs BEFORE reka-ui closes the dialog.
     * This lets async handlers safely read state (e.g. a "currently-targeted item" ref)
     * before the close mutation runs in the bubble phase.
     */
    onClick?: (event: MouseEvent) => void
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

const props = withDefaults(defineProps<Props>(), { text: 'Continue', variant: 'default', size: 'sm' })

const forwarded = reactiveOmit(props, 'class', 'text', 'variant', 'size', 'onClick')

const handleClickCapture = (event: MouseEvent) => {
    props.onClick?.(event)
}
</script>
