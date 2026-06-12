<template>
    <component
        :is="elementType"
        :class="
            buttonStyles({
                hasIcon: !!icon,
                disabled: disabled || loading,
                variant: variant,
                size: size,
                class: props.class,
                effect,
            })
        "
        :disabled="disabled || loading"
        v-bind="forwarded"
    >
        <Icon v-if="icon && iconPlacement == 'left' && !loading && !isExpandIcon" :name="icon" class="size-4 shrink-0"></Icon>
        <slot name="iconLeft">
            <div
                v-if="icon && iconPlacement == 'left' && !loading && isExpandIcon"
                class="flex w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-[0%] group-hover:pr-2 group-hover:opacity-100"
            >
                <Icon :name="icon" class="size-4"></Icon>
            </div>
        </slot>
        <slot name="loading">
            <Icon v-if="loading" :name="loadingIcon" class="size-4 shrink-0"></Icon>
        </slot>
        <slot>
            <span v-if="text">{{ text }}</span>
        </slot>
        <slot name="iconRight">
            <div
                v-if="icon && iconPlacement == 'right' && !loading && isExpandIcon"
                class="flex w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100"
            >
                <Icon :name="icon" class="size-4"></Icon>
            </div>
        </slot>
        <Icon v-if="icon && iconPlacement == 'right' && !loading && !isExpandIcon" :name="icon" class="size-4 shrink-0"></Icon>
    </component>
</template>

<script setup lang="ts">
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import type { ClassValue } from 'tailwind-variants'
import { computed, resolveComponent } from 'vue'
import { type ButtonProps, buttonStyles } from './Button.variants'

interface Props {
    /** The type for the button */
    type?: 'button' | 'submit' | 'reset'
    /** Whether the button is disabled */
    disabled?: boolean
    /** Whether the button is loading */
    loading?: boolean
    /** The action to perform when the button is clicked */
    onClick?: any
    /** The element to render the button as */
    as?: string
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    /** The variant of the button */
    variant?: ButtonProps['variant']
    /** The size of the button */
    size?: ButtonProps['size']
    /** The effect to apply to the button */
    effect?: ButtonProps['effect']
    /** The text to display in the button */
    text?: string
    /** Should the icon be displayed on the `left` or the `right`? */
    iconPlacement?: 'left' | 'right'
    /** The icon to display in the button */
    icon?: string
    /** The icon to display when the button is loading */
    loadingIcon?: string

    href?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'submit',
    loadingIcon: 'icon-loading',
    iconPlacement: 'left',
    loading: false,
})

const elementType = computed(() => {
    if (props.as) {
        return props.as
    }

    if (props.href) {
        return resolveComponent('Link')
    }

    return 'button'
})

const isExpandIcon = computed(() => props.effect === 'expandIcon')

const forwarded = useForwardProps(
    reactiveOmit(
        props,
        'class',
        'text',
        'icon',
        'iconPlacement',
        'size',
        'variant',
        'as',
        'loading',
        'disabled',
        'loadingIcon',
        'effect',
    ),
)
</script>
