<template>
    <TagsInputItemText data-slot="tags-input-item-text" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot />
    </TagsInputItemText>
</template>

<script lang="ts" setup>
import { reactiveOmit } from '@vueuse/core'
import { TagsInputItemText } from 'reka-ui'
import type { TagsInputItemTextProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TagsInputItemTextProps {
    class?: ClassValue
}

const props = defineProps<Props>()

const forwarded = reactiveOmit(props, 'class')

const styles = tv({
    base: '',
})
</script>
