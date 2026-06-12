<template>
    <RadioGroupRoot data-slot="radio-group" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </RadioGroupRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { RadioGroupRoot, useForwardPropsEmits } from 'reka-ui'
import type { RadioGroupRootEmits, RadioGroupRootProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends RadioGroupRootProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { orientation: 'vertical', loop: true })

const emits = defineEmits<RadioGroupRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'grid group gap-3',
})
</script>
