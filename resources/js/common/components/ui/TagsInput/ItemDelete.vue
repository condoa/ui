<template>
    <TagsInputItemDelete data-slot="tags-input-item-delete" v-bind="forwarded" :class="styles({ class: props.class })">
        <slot>
            <Icon v-if="icon" :name="icon" class="m-auto size-3"></Icon>
        </slot>
    </TagsInputItemDelete>
</template>

<script lang="ts" setup>
import Icon from '@/common/components/Icon.vue'
import { reactiveOmit } from '@vueuse/core'
import { TagsInputItemDelete, type TagsInputItemDeleteProps } from 'reka-ui'
import { type ClassValue, tv } from 'tailwind-variants'

interface Props extends TagsInputItemDeleteProps {
    class?: ClassValue

    icon?: string
}

const props = withDefaults(defineProps<Props>(), { icon: 'icon-close' })

const forwarded = reactiveOmit(props, 'class', 'icon')

const styles = tv({
    base: 'flex items-center justify-center p-0 text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
})
</script>
