<template>
    <TabsList data-slot="tabs-list" :class="styles({ pill, class: props.class })" v-bind="forwarded">
        <slot />
    </TabsList>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TabsList } from 'reka-ui'
import type { TabsListProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TabsListProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
    pill?: boolean
}

const props = withDefaults(defineProps<Props>(), { pill: true })

const forwarded = reactiveOmit(props, 'class', 'pill')

const styles = tv({
    base: 'inline-flex w-fit items-center justify-center rounded-md p-0.5 text-muted-foreground/70',
    variants: {
        pill: {
            true: 'bg-muted',
            false: '',
        },
    },
})
</script>
