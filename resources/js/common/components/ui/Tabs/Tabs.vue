<template>
    <TabsRoot data-slot="tabs" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </TabsRoot>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'
import type { TabsRootEmits, TabsRootProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TabsRootProps {
    class?: ClassValue
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    activationMode: 'automatic',
})

const emits = defineEmits<TabsRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)

const styles = tv({ base: 'flex flex-col gap-2' })
</script>
