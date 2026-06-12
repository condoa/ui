<template>
    <component
        :is="eltype"
        :href="href"
        :to="to"
        :class="
            styles({
                hover: Boolean(onClick) || Boolean(to) || Boolean(href),
                class: props.class,
            })
        "
        @click="onClick"
    >
        <slot />
    </component>
</template>

<script lang="ts" setup>
import { computed, resolveComponent } from 'vue'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props {
    /**Custom class(es) to add to the element */
    class?: ClassValue
    /** Function called when the item is clicked */
    onClick?: () => void
    /** The location that the item should navigate to when clicked */
    to?: string
    /** The href for the `a` tag */
    href?: string
}

const props = defineProps<Props>()

const styles = tv({
    base: 'flex w-full items-center gap-5 px-4 py-2',
    variants: {
        hover: {
            true: 'cursor-pointer outline-none hover:bg-muted focus-visible:ring-4 focus-visible:ring-primary/10',
        },
    },
})

const eltype = computed(() => {
    if (props.to || props.href) {
        return resolveComponent('Link')
    }

    if (props.onClick) {
        return 'button'
    }

    return 'li'
})
</script>
