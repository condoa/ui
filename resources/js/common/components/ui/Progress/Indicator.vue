<template>
    <ProgressIndicator data-slot="progress-indicator" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </ProgressIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ProgressIndicator } from 'reka-ui'
import type { ProgressIndicatorProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends ProgressIndicatorProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'h-full w-full flex-1 rounded-full bg-primary transition-all motion-reduce:transition-none',
})
</script>
