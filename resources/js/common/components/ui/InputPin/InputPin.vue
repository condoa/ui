<template>
    <PinInputRoot data-slot="input-pin" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <template v-for="(input, k) in inputCount" :key="k">
                <InputPinInput :aria-invalid :index="k" />
                <template v-if="k < inputCount - 1">
                    <span v-if="separator" class="text-muted-foreground">{{ separator }}</span>
                </template>
            </template>
        </slot>
    </PinInputRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import { tv, type ClassValue } from 'tailwind-variants'

interface Props extends PinInputRootProps {
    /** Custom class(es) to apply to the parent element */
    class?: ClassValue
    /**
     * The number of inputs to render
     * @default 4
     */
    inputCount?: number
    /**
     * The separator to render between inputs
     * @default undefined
     */
    separator?: string
    /** Whether the input should be marked as invalid for accessibility purposes */
    ariaInvalid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    inputCount: 4,
})

const emits = defineEmits<PinInputRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class', 'inputCount', 'separator'), emits)

const styles = tv({
    base: 'flex items-center gap-2',
})
</script>
