<template>
    <TabsContent data-slot="tabs-content" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </TabsContent>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TabsContent } from 'reka-ui'
import type { TabsContentProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TabsContentProps {
    /** Custom class(es) to add to parent element */
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'flex-1 outline-none',
})
</script>
