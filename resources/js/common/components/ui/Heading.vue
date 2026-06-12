<template>
    <Primitive :as="hTag" v-bind="forwarded" :class="headingStyles({ level, class: props.class })">
        <slot />
    </Primitive>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { tv, type ClassValue, type VariantProps } from 'tailwind-variants'
import { computed } from 'vue'

const headingStyles = tv({
    base: 'font-sans text-foreground',
    variants: {
        level: {
            1: 'text-xl font-semibold sm:text-2xl',
            2: 'text-lg font-semibold sm:text-xl',
            3: 'text-base font-semibold sm:text-lg',
            4: 'text-base font-semibold',
            5: 'text-base font-medium',
            6: 'text-base',
        },
    },
    defaultVariants: {
        level: 1,
    },
})

export type HeadingProps = Omit<PrimitiveProps, 'as'> & {
    /**
     * The heading level to use, which will determine the HTML tag used.
     *
     * @default 1
     */
    level?: VariantProps<typeof headingStyles>['level']
    /**
     * Custom class(es) to apply to the heading element.
     */
    class?: ClassValue
}

const props = withDefaults(defineProps<HeadingProps>(), { level: 1 })

const hTag = computed(() => `h${props.level}`)

const forwarded = reactiveOmit(props, ['class'])
</script>
