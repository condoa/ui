<template>
    <AccordionRoot v-slot="rootSlotProps" data-slot="accordion" v-bind="forwarded">
        <slot v-bind="rootSlotProps" :items="items">
            <template v-for="(item, i) in items" :key="i">
                <AccordionItem v-slot="itemSlotProps" :disabled="item.disabled" :value="item.value">
                    <slot v-bind="{ ...itemSlotProps, ...rootSlotProps, items, item }" name="header">
                        <AccordionHeader>
                            <slot v-bind="{ ...itemSlotProps, ...rootSlotProps, items, item }" name="trigger">
                                <AccordionTrigger :title="item.title" :icon="item.icon" />
                            </slot>
                        </AccordionHeader>
                    </slot>
                    <slot name="content" v-bind="{ ...itemSlotProps, ...rootSlotProps, items, item }">
                        <AccordionContent :content="item.content" />
                    </slot>
                </AccordionItem>
            </template>
        </slot>
    </AccordionRoot>
</template>

<script lang="ts">
export interface AccordionItem {
    title?: string
    content?: string
    value: string
    disabled?: boolean
    icon?: string
    [key: string]: unknown
}
</script>

<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import { AccordionRoot, useForwardPropsEmits } from 'reka-ui'
import type { AccordionRootEmits, AccordionRootProps } from 'reka-ui'

interface Props extends AccordionRootProps {
    items?: AccordionItem[]
}

const props = withDefaults(defineProps<Props>(), { type: 'single', collapsible: true, items: () => [] })

const emits = defineEmits<AccordionRootEmits>()

const forwarded = useForwardPropsEmits(reactiveOmit(props, 'items'), emits)
</script>
