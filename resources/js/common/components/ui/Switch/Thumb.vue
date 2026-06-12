<template>
    <SwitchThumb data-slot="switch-thumb" :class="styles({ class: props.class })" v-bind="forwarded">
        <slot />
    </SwitchThumb>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { SwitchThumb } from 'reka-ui'
import type { SwitchThumbProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends SwitchThumbProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'pointer-events-none block size-5 rounded-full bg-background shadow-xs ring-0 transition-transform motion-reduce:transition-none data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 data-[state=checked]:rtl:-translate-x-4',
})
</script>
