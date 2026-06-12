<template>
    <TabsIndicator
        v-if="mounted"
        data-slot="tabs-indicator"
        v-bind="{ ...forwarded, ...$attrs }"
        :class="styles({ class: props.class })"
    >
        <slot>
            <div class="h-full w-full rounded-md bg-primary" />
        </slot>
    </TabsIndicator>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TabsIndicator } from 'reka-ui'
import type { TabsIndicatorProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'
import { onMounted, ref } from 'vue'

defineOptions({ inheritAttrs: false })

interface Props extends TabsIndicatorProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const mounted = ref(false)

onMounted(() => {
    mounted.value = true
})

const styles = tv({
    base: 'absolute bottom-0 left-0 h-[3px] rounded-full px-1 transition-[width,transform] duration-300 motion-reduce:transition-none',
})
</script>

<style scoped>
[data-slot="tabs-indicator"] {
    width: var(--reka-tabs-indicator-size);
    transform: translateX(var(--reka-tabs-indicator-position));
}
</style>
