<template>
    <TagsInputInput data-slot="tags-input-input" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </TagsInputInput>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TagsInputInput } from 'reka-ui'
import type { TagsInputInputProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TagsInputInputProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: 'min-h-6 w-full flex-1 bg-transparent px-1 text-sm focus:outline-none dark:bg-input/30',
})
</script>
