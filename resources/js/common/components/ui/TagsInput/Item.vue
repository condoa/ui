<template>
    <TagsInputItem data-slot="tags-input-item" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <slot name="text">
                <TagsInputItemText />
            </slot>
            <slot name="delete">
                <TagsInputItemDelete :icon="icon" />
            </slot>
        </slot>
    </TagsInputItem>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TagsInputItem, type TagsInputItemProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TagsInputItemProps {
    class?: ClassValue

    icon?: string
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'relative flex h-7 items-center gap-1 rounded-sm border border-input bg-transparent px-2 text-xs font-medium hover:bg-background dark:bg-accent',
})
</script>
