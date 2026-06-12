<template>
    <AvatarFallback data-slot="avatar-fallback" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot>
            {{ fallback }}
        </slot>
    </AvatarFallback>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { AvatarFallback } from 'reka-ui'
import type { AvatarFallbackProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends AvatarFallbackProps {
    /** The text to display inside the avatar */
    fallback?: string
    /** Custom class(es) to add to the element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'fallback')

const styles = tv({
    base: 'flex size-full items-center justify-center rounded-full bg-muted',
})
</script>
