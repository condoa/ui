<template>
    <ProgressRoot data-slot="progress" v-bind="{ ...forwarded, ...$attrs }" :class="styles({ class: props.class })">
        <slot>
            <ProgressIndicator :style="{ transform: `translateX(-${100 - ((modelValue || 0) / max) * 100}%)` }" />
        </slot>
    </ProgressRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { ProgressRoot, useForwardPropsEmits } from 'reka-ui'
import type { ProgressRootEmits, ProgressRootProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

defineOptions({ inheritAttrs: false })

interface Props extends ProgressRootProps {
    /** Custom class(es) to add to the parent */
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), { max: 100, modelValue: 0 })

const emits = defineEmits<ProgressRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({
    base: 'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
})
</script>
